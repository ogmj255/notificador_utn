export async function onRequest(context) {
  const { env } = context;
  
  if (!env.TELEGRAM_BOT_TOKEN) {
    return new Response('Error: TELEGRAM_BOT_TOKEN no configurado');
  }
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    
    if (!data.ok) {
      return new Response(`Error de Telegram: ${data.description}`);
    }
    
    const updates = data.result;
    const chatIds = new Set();
    
    updates.forEach(update => {
      if (update.message && update.message.chat) {
        chatIds.add({
          id: update.message.chat.id,
          name: update.message.chat.first_name || update.message.chat.title || 'Usuario',
          username: update.message.chat.username || 'sin_username'
        });
      }
    });
    
    if (chatIds.size === 0) {
      return new Response(`
📱 No se encontraron chats recientes.

🔧 Para obtener tu Chat ID:
1. Envía cualquier mensaje a tu bot
2. Recarga esta página
3. Tu Chat ID aparecerá aquí

🤖 Bot: @${env.TELEGRAM_BOT_TOKEN.split(':')[0]}
      `);
    }
    
    let resultado = '📱 Chat IDs encontrados:\n\n';
    Array.from(chatIds).forEach(chat => {
      resultado += `👤 ${chat.name} (@${chat.username})\n`;
      resultado += `🆔 Chat ID: ${chat.id}\n\n`;
    });
    
    resultado += '📋 Copia el Chat ID y actualiza TELEGRAM_CHAT_IDS en .dev.vars';
    
    return new Response(resultado, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}