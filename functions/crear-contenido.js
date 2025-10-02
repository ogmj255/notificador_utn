export async function onRequest(context) {
  const { env } = context;
  
  try {
    const url = "https://content.twilio.com/v1/Content";
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    
    // Crear contenido con botones usando el formato exacto que funciona
    const data = {
      "FriendlyName": "Recordatorio de clases UTN",
      "Language": "es", 
      "Types": '[{"type":"twilio/quick-reply","body":"🔔 RECORDATORIO DE CLASES\n\nHola {{1}}!\n\nTienes clases hoy {{2}} a partir de las 18:00:\n\n{{3}}\n⏰ ¡No olvides conectarte a tiempo!","actions":[{"title":"✅ Recibido"},{"title":"👍 Gracias"},{"title":"📅 Horario"}]}]'
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data)
    });
    
    const result = await response.json();
    
    if (result.sid) {
      return new Response(`✅ Contenido creado exitosamente!\n\nContentSid: ${result.sid}\n\nCopia este SID y reemplaza 'CONTENT_SID_AQUI' en recordatorio.js`, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}