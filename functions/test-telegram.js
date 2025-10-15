export async function onRequest(context) {
  const { env } = context;
  
  const debug = {
    TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN ? 'Configurado' : 'NO configurado',
    TELEGRAM_CHAT_IDS: env.TELEGRAM_CHAT_IDS || 'NO configurado',
    STUDENT_NAMES: env.STUDENT_NAMES || 'NO configurado'
  };
  
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_IDS) {
    return new Response(JSON.stringify(debug, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_IDS,
        text: '🧪 *PRUEBA DE BOT*\n\n¡Hola Omar!\n\nEste es un mensaje de prueba para verificar que el bot funciona correctamente.',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '✅ Funciona', callback_data: 'test_ok' },
            { text: '🔧 Debug', callback_data: 'test_debug' }
          ]]
        }
      })
    });
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      debug,
      telegram_response: result,
      status: result.ok ? 'ÉXITO' : 'ERROR'
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      debug,
      error: error.message
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}