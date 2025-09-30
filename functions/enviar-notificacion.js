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
    // Debug: verificar variables
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response('Error: TWILIO_ACCOUNT_SID no configurado');
    }
    if (!env.STUDENT_PHONE) {
      return new Response('Error: STUDENT_PHONE no configurado');
    }
    
    // Debug: mostrar credenciales (solo para debug)
    return new Response(`Debug - SID: ${env.TWILIO_ACCOUNT_SID}, Token: ${env.TWILIO_AUTH_TOKEN ? 'Configurado' : 'No configurado'}, From: ${env.WHATSAPP_FROM}, Phone: ${env.STUDENT_PHONE}`);
    

  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}

function formatearMensaje(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `Buenos dias *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\nDisfruta tu dia libre!`;
  }

  let mensaje = `Buenos dias *${nombre}*!\n\n*HORARIO ${dia.toUpperCase()}*\n========================\n\n`;

  horario.forEach((clase, i) => {
    mensaje += `*Clase ${i + 1}*\nHora: ${clase.hora}\nMateria: ${clase.materia}\nProfesor: ${clase.profesor}\n\n`;
  });

  mensaje += "========================\nQue tengas un excelente dia academico!";
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
    body: new URLSearchParams({ From: from, To: to, Body: body })
  });
  
  return response.json();
}