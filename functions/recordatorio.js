const HORARIO = {
  'lunes': [
    {'hora': '18:00-19:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez'},
    {'hora': '19:00-20:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez'},
    {'hora': '20:00-21:00', 'materia': 'Deontología', 'profesor': 'Carlos Dávila Montalvo'},
    {'hora': '21:00-22:00', 'materia': 'Deontología', 'profesor': 'Carlos Dávila Montalvo'}
  ],
  'martes': [
    {'hora': '18:00-19:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro'},
    {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda'},
    {'hora': '20:00-21:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez'}
  ],
  'miercoles': [
    {'hora': '18:00-19:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Marcelo Cisneros Ruales'},
    {'hora': '19:00-20:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Marcelo Cisneros Ruales'}
  ],
  'jueves': [
    {'hora': '18:00-19:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda'},
    {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda'},
    {'hora': '20:00-21:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro'},
    {'hora': '21:00-22:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro'}
  ],
  'viernes': [], 'sabado': [], 'domingo': []
};

export async function onRequest(context) {
  const { env } = context;
  
  try {
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response('Error: TWILIO_ACCOUNT_SID no configurado');
    }
    if (!env.STUDENT_PHONE) {
      return new Response('Error: STUDENT_PHONE no configurado');
    }
    
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    
    const numeros = env.STUDENT_PHONE.split(',');
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(',') : [];
    let mensajesEnviados = 0;
    let errores = [];
    
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
        
        const resultado = await enviarRecordatorio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.WHATSAPP_FROM, numero, horarioHoy, diaNombre, nombre);
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || 'Error desconocido'}`);
        }
      }
    }
    
    let respuesta = `Recordatorios enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(', ')}`;
    }
    
    return new Response(respuesta);

  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}

async function enviarRecordatorio(accountSid, authToken, from, to, horario, dia, nombre) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${accountSid}:${authToken}`);
  
  if (!horario || horario.length === 0) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ 
        From: from,
        To: to, 
        Body: `Hola *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\n¡Disfruta tu tarde libre!`
      })
    });
    return response.json();
  }

  // Formatear clases para el template
  let clases = '';
  horario.forEach((clase, i) => {
    clases += `📚 ${clase.hora} - ${clase.materia}\n👨🏫 Ing. ${clase.profesor}\n\n`;
  });

  // Mensaje con respuestas sugeridas
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ 
      From: from,
      To: to, 
      Body: `🔔 *RECORDATORIO DE CLASES*\n\nHola *${nombre}*!\n\nTienes clases hoy *${dia.toUpperCase()}* a partir de las 18:00:\n\n${clases}⏰ *¡No olvides conectarte a tiempo!*\n\n✅ Responde: *Recibido*\n👍 Responde: *Gracias*\n📅 Responde: *Horario*`
    })
  });
  
  return response.json();
}