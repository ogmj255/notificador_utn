export async function onRequest(context) {
  const { env } = context;
  
  // Verificar variables de entorno
  const variables = {
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID ? 'Configurado' : 'NO configurado',
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN ? 'Configurado' : 'NO configurado', 
    WHATSAPP_FROM: env.WHATSAPP_FROM || 'NO configurado',
    STUDENT_PHONE: env.STUDENT_PHONE || 'NO configurado'
  };
  
  // Probar autenticación con Twilio
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}.json`;
      const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Basic ${auth}` }
      });
      
      variables.AUTH_TEST = response.ok ? 'EXITOSO' : `ERROR: ${response.status}`;
    } catch (error) {
      variables.AUTH_TEST = `ERROR: ${error.message}`;
    }
  }
  
  return new Response(JSON.stringify(variables, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
}