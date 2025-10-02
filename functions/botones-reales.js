export async function onRequest(context) {
  const { env } = context;
  
  try {
    // Paso 1: Crear contenido con botones usando el formato exacto
    const contentUrl = "https://content.twilio.com/v1/Content";
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    
    const contentData = {
      "FriendlyName": "Recordatorio UTN",
      "Language": "es",
      "Types": JSON.stringify([{
        "type": "twilio/quick-reply",
        "body": "🔔 RECORDATORIO DE CLASES\n\nHola {{1}}!\n\nTienes clases hoy {{2}} a partir de las 18:00:\n\n{{3}}\n⏰ ¡No olvides conectarte a tiempo!",
        "actions": [
          {"title": "✅ Recibido"},
          {"title": "👍 Gracias"},
          {"title": "📅 Horario"}
        ]
      }])
    };
    
    // Crear contenido
    const contentResponse = await fetch(contentUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(contentData)
    });
    
    const contentResult = await contentResponse.json();
    
    if (!contentResult.sid) {
      return new Response(`Error creando contenido: ${JSON.stringify(contentResult)}`, { status: 400 });
    }
    
    // Paso 2: Enviar mensaje con botones
    const HORARIO = {
      'jueves': [
        {'hora': '18:00-19:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda'},
        {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda'},
        {'hora': '20:00-21:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro'},
        {'hora': '21:00-22:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro'}
      ]
    };
    
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    
    let clases = '';
    horarioHoy.forEach((clase, i) => {
      clases += `📚 ${clase.hora} - ${clase.materia}\n👨🏫 Ing. ${clase.profesor}\n\n`;
    });
    
    const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const numeros = env.STUDENT_PHONE.split(',');
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(',') : [];
    let mensajesEnviados = 0;
    
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
        
        const messageResponse = await fetch(messageUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            from: env.WHATSAPP_FROM,
            to: numero,
            content_sid: contentResult.sid,
            content_variables: JSON.stringify({
              "1": nombre,
              "2": diaNombre.toUpperCase(),
              "3": clases
            })
          })
        });
        
        const messageResult = await messageResponse.json();
        if (messageResult.sid) {
          mensajesEnviados++;
        }
      }
    }
    
    return new Response(`✅ Contenido creado: ${contentResult.sid}\n📱 Mensajes con botones enviados: ${mensajesEnviados}`);
    
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}