export async function onRequest(context) {
  const { env } = context;
  
  try {
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response('Error: TWILIO_ACCOUNT_SID no configurado');
    }
    if (!env.STUDENT_PHONE) {
      return new Response('Error: STUDENT_PHONE no configurado');
    }
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    
    const numeros = env.STUDENT_PHONE.split(',');
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(',') : [];
    let mensajesEnviados = 0;
    let errores = [];
    
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
        
        // Usar template simple con botones básicos
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({ 
            From: env.WHATSAPP_FROM,
            To: numero,
            Body: `🔔 *RECORDATORIO CLASES UTN*\n\nHola *${nombre}*!\n\n📚 Tienes clases hoy a las 18:00\n⏰ ¡No olvides conectarte!\n\n👇 Responde con:`,
            // Intentar agregar botones usando MediaUrl (método alternativo)
            MediaUrl: 'https://via.placeholder.com/300x100/007acc/white?text=Botones+de+Respuesta'
          })
        });
        
        const resultado = await response.json();
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || 'Error desconocido'}`);
        }
      }
    }
    
    let respuesta = `Mensajes con botones enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(', ')}`;
    }
    
    return new Response(respuesta);

  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}