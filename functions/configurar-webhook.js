export async function onRequest(context) {
  const { env } = context;
  
  if (!env.TELEGRAM_BOT_TOKEN) {
    return new Response('Error: TELEGRAM_BOT_TOKEN no configurado');
  }
  
  try {
    const webhookUrl = 'https://notificador-utn.pages.dev/telegram-bot';
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      return new Response(`✅ Webhook configurado correctamente!\n\nURL: ${webhookUrl}\n\nAhora los botones funcionarán cuando subas el código a GitHub.`);
    } else {
      return new Response(`❌ Error configurando webhook: ${result.description}`);
    }
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}