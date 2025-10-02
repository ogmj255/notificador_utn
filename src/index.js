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
  'viernes': [],
  'sabado': [],
  'domingo': []
};

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

function formatearMensaje(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `Buenos dias *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\nDisfruta tu dia libre!`;
  }

  let mensaje = `Buenos dias *${nombre}*!\n\n`;
  mensaje += `*HORARIO ${dia.toUpperCase()}*\n`;
  mensaje += "========================\n\n";

  horario.forEach((clase, i) => {
    mensaje += `*Clase ${i + 1}*\n`;
    mensaje += `Hora: ${clase.hora}\n`;
    mensaje += `Materia: ${clase.materia}\n`;
    mensaje += `Profesor: ${clase.profesor}\n\n`;
  });

  mensaje += "========================\n";
  mensaje += "Que tengas un excelente dia academico!";
  return mensaje;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Notificador UTN</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .method { color: #007acc; font-weight: bold; }
    .url { color: #333; }
    .desc { color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>🎓 Notificador de Horario UTN</h1>
  <p>Sistema automatizado para notificaciones diarias de clases por WhatsApp</p>
  
  <h2>Endpoints Disponibles:</h2>
  
  <div class="endpoint">
    <div class="method">GET</div>
    <div class="url">/enviar-notificacion</div>
    <div class="desc">Envía mensaje matutino con horario del día (7:00 AM)</div>
  </div>
  
  <div class="endpoint">
    <div class="method">GET</div>
    <div class="url">/recordatorio</div>
    <div class="desc">Envía recordatorio con opciones de respuesta (5:45 PM)</div>
  </div>
  
  <div class="endpoint">
    <div class="method">POST</div>
    <div class="url">/webhook</div>
    <div class="desc">Webhook para respuestas automáticas de WhatsApp</div>
  </div>
  
  <div class="endpoint">
    <div class="method">GET</div>
    <div class="url">/test</div>
    <div class="desc">Verificar configuración y credenciales de Twilio</div>
  </div>
  
  <div class="endpoint">
    <div class="method">GET</div>
    <div class="url">/crear-contenido</div>
    <div class="desc">Crear contenido con botones interactivos (experimental)</div>
  </div>
  
  <h2>Configuración Cron Jobs:</h2>
  <ul>
    <li><strong>7:00 AM:</strong> <code>0 7 * * *</code> → /enviar-notificacion</li>
    <li><strong>5:45 PM:</strong> <code>45 17 * * *</code> → /recordatorio</li>
  </ul>
  
  <p><em>Estado: ✅ Sistema activo</em></p>
</body>
</html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    }
    
    if (url.pathname === '/enviar-notificacion') {
      try {
        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
        const diaNombre = dias[hoy];
        const horarioHoy = HORARIO[diaNombre] || [];
        
        const numeros = env.STUDENT_PHONE.split(',');
        const nombres = env.STUDENT_NAMES.split(',');
        const mensajesEnviados = [];
        
        for (let i = 0; i < numeros.length; i++) {
          const numero = numeros[i].trim();
          if (numero) {
            const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
            const mensaje = formatearMensaje(horarioHoy, diaNombre, nombre);
            
            const resultado = await enviarWhatsApp(
              env.TWILIO_ACCOUNT_SID,
              env.TWILIO_AUTH_TOKEN,
              env.WHATSAPP_FROM,
              numero,
              mensaje
            );
            
            if (resultado.sid) {
              mensajesEnviados.push(resultado.sid);
            }
          }
        }
        
        return new Response(`Mensajes enviados: ${mensajesEnviados.length}`);
      } catch (error) {
        return new Response(`Error: ${error.message}`);
      }
    }
    if (url.pathname === '/recordatorio') {
      return new Response('Servicio de recordatorio activo ✅');
    }
    

    return new Response('Not Found', { status: 404 });
  }

};