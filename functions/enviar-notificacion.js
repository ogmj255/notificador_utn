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
    
    // Detectar si es mañana (7 AM) o tarde (5:45 PM)
    const ahora = new Date();
    const hora = ahora.getHours();
    const esMañana = hora >= 6 && hora <= 8; // Entre 6-8 AM
    
    const numeros = env.STUDENT_PHONE.split(',');
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(',') : [];
    let mensajesEnviados = 0;
    let errores = [];
    
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
        const mensaje = esMañana ? 
          formatearMensajeMañana(horarioHoy, diaNombre, nombre) : 
          formatearMensajeTarde(horarioHoy, diaNombre, nombre);
        
        const resultado = await enviarWhatsApp(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.WHATSAPP_FROM, numero, mensaje);
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || 'Error desconocido'}`);
        }
      }
    }
    
    let respuesta = `Mensajes enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(', ')}`;
    }
    
    return new Response(respuesta);

  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}

function formatearMensajeMañana(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `¡Buenos días *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\n¡Disfruta tu día libre!`;
  }

  let mensaje = `¡Buenos días *${nombre}*!\n\n*HORARIO ${dia.toUpperCase()}*\n========================\n\n`;

  horario.forEach((clase, i) => {
    mensaje += `*Clase ${i + 1}*\nHora: ${clase.hora}\nMateria: ${clase.materia}\nIng: ${clase.profesor}\n\n`;
  });

  mensaje += "========================\n¡Que tengas un excelente día académico!";
  return mensaje;
}

function formatearMensajeTarde(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `Hola *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\n¡Disfruta tu tarde libre!`;
  }

  let mensaje = `🔔 *RECORDATORIO DE CLASES*\n\nHola *${nombre}*!\n\nTienes clases hoy *${dia.toUpperCase()}* a partir de las 18:00:\n\n`;

  horario.forEach((clase, i) => {
    mensaje += `📚 ${clase.hora} - ${clase.materia}\n👨🏫 Ing. ${clase.profesor}\n\n`;
  });

  mensaje += "⏰ *¡No olvides conectarte a tiempo!*\n\n✅ Responde 'Recibido' para confirmar";
  return mensaje;
}

async function enviarWhatsApp(accountSid, authToken, from, to, body) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${accountSid}:${authToken}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ 
      From: from,
      To: to, 
      Body: body
    })
  });
  
  return response.json();
}