export async function onRequest(context) {
  const { env } = context;
  
  if (!env.TELEGRAM_BOT_TOKEN) {
    return new Response('Error: TELEGRAM_BOT_TOKEN no configurado');
  }
  
  return new Response(`
📱 OBTENER CHAT ID - Método Alternativo

Como el webhook está activo, usa este método:

🔧 OPCIÓN 1: Bot directo
1. Envía cualquier mensaje a @notificador_utn_bot
2. El bot responderá con tu Chat ID automáticamente

🔧 OPCIÓN 2: Bot de terceros
1. Busca @userinfobot en Telegram
2. Envía /start
3. Te dará tu Chat ID

🔧 OPCIÓN 3: Método manual
1. Abre: https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getUpdates
2. Busca "chat":{"id": TU_NUMERO
3. Ese número es tu Chat ID

Una vez que tengas el Chat ID, actualiza las variables en Cloudflare:
TELEGRAM_CHAT_IDS = 7922117066,NUEVO_CHAT_ID
STUDENT_NAMES = Omar,NuevoNombre
  `, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}