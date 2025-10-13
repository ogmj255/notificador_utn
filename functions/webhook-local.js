export async function onRequest(context) {
  const { env, request } = context;
  
  if (request.method === 'GET') {
    return new Response(`
🔧 CONFIGURAR WEBHOOK LOCAL

Para probar botones localmente:

1. Instala ngrok: https://ngrok.com/download
2. Ejecuta: ngrok http 8787
3. Copia la URL HTTPS que te da (ej: https://abc123.ngrok.io)
4. Ve a: /configurar-webhook-local?url=TU_URL_NGROK

Ejemplo:
/configurar-webhook-local?url=https://abc123.ngrok.io

Esto configurará el webhook temporalmente para pruebas.
    `);
  }
  
  // Configurar webhook con URL de ngrok
  const url = new URL(request.url);
  const ngrokUrl = url.searchParams.get('url');
  
  if (!ngrokUrl) {
    return new Response('Error: Falta parámetro ?url=TU_URL_NGROK');
  }
  
  try {
    const webhookUrl = `${ngrokUrl}/telegram-bot`;
    
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      return new Response(`✅ Webhook local configurado!\n\nURL: ${webhookUrl}\n\nAhora los botones funcionarán mientras ngrok esté activo.`);
    } else {
      return new Response(`❌ Error: ${result.description}`);
    }
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}