export async function onRequest(context) {
  const { env } = context;
  
  try {
    const url = "https://content.twilio.com/v1/Content";
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    
    // Crear contenido dinámico con variables
    const payload = {
      friendly_name: `Recordatorio_${diaNombre}`,
      language: "es",
      types: {
        "twilio/quick-reply": {
          body: "🔔 *RECORDATORIO DE CLASES*\n\nHola {{1}}!\n\nTienes clases hoy {{2}} a partir de las 18:00:\n\n{{3}}\n⏰ *¡No olvides conectarte a tiempo!*",
          actions: [
            { title: "✅ Recibido" },
            { title: "👍 Gracias" },
            { title: "📅 Ver horario" }
          ]
        }
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    return new Response(JSON.stringify(result, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}