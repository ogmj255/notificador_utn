const HORARIO = {
  'lunes': [
    {'hora': '18:00-19:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez', 'zoom': 'https://cedia.zoom.us/j/84075745352'},
    {'hora': '19:00-20:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez', 'zoom': 'https://cedia.zoom.us/j/84075745352'},
    {'hora': '20:00-21:00', 'materia': 'Deontología', 'profesor': 'Carlos Dávila Montalvo', 'zoom': 'https://cedia.zoom.us/j/88685446908'},
    {'hora': '21:00-22:00', 'materia': 'Deontología', 'profesor': 'Carlos Dávila Montalvo', 'zoom': 'https://cedia.zoom.us/j/88685446908'}
  ],
  'martes': [
    {'hora': '18:00-19:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro', 'teams': 'REUNION POR TEAMS'},
    {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda', 'zoom': 'https://cedia.zoom.us/j/84286828097'},
    {'hora': '20:00-21:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Víctor Caranqui Sánchez', 'zoom': 'https://cedia.zoom.us/j/88448571232'}
  ],
  'miercoles': [
    {'hora': '18:00-19:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Marcelo Cisneros Ruales', 'zoom': 'PENDIENTE_ENLACE'},
    {'hora': '19:00-20:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Marcelo Cisneros Ruales', 'zoom': 'PENDIENTE_ENLACE'}
  ],
  'jueves': [
    {'hora': '18:00-19:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda', 'zoom': 'https://cedia.zoom.us/j/89774207590'},
    {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Diego Terán Pineda', 'zoom': 'https://cedia.zoom.us/j/89774207590'},
    {'hora': '20:00-21:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro', 'teams': 'REUNION POR TEAMS'},
    {'hora': '21:00-22:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Fausto Salazar Fierro', 'teams': 'REUNION POR TEAMS'}
  ],
  'viernes': [], 'sabado': [], 'domingo': []
};

export async function onRequest(context) {
  const { env } = context;
  
  try {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    
    const chatIds = env.TELEGRAM_CHAT_IDS.split(',');
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(',') : [];
    let mensajesEnviados = 0;
    let errores = [];
    
    if (!chatIds || chatIds.length === 0) {
      return new Response('Error: TELEGRAM_CHAT_IDS no configurado');
    }
    
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    for (let i = 0; i < chatIds.length; i++) {
      const chatId = chatIds[i].trim();
      if (!chatId) continue;
      
      const nombre = nombres[i] ? nombres[i].trim() : 'Estudiante';
      
      // Recordatorio con botones
      let mensaje;
      if (!horarioHoy || horarioHoy.length === 0) {
        mensaje = `Hola *${nombre}*!\n\nNo tienes clases programadas para *${diaNombre.toUpperCase()}*\n\n¡Disfruta tu tarde libre! 🌟`;
      } else {
        mensaje = `🔔 *RECORDATORIO DE CLASES*\n\n¡Hola *${nombre}*!\n\nTienes clases hoy *${diaNombre.toUpperCase()}* a partir de las 18:00:\n\n`;
        
        horarioHoy.forEach((clase, i) => {
          mensaje += `📚 ${clase.hora} - ${clase.materia}\n👨🏫 Ing. ${clase.profesor}\n`;
          
          if (clase.zoom && clase.zoom !== 'PENDIENTE_ENLACE') {
            mensaje += `🔗 [Unirse a Zoom](${clase.zoom})\n`;
          } else {
            mensaje += `🔗 Enlace Zoom: Pendiente\n`;
          }
          
          mensaje += `\n`;
        });
        
        mensaje += "⏰ *¡No olvides conectarte a tiempo!*";
      }
      
      const payload = {
        chat_id: chatId,
        text: mensaje,
        parse_mode: 'Markdown'
      };
      
      // Agregar botones solo si hay clases
      if (horarioHoy && horarioHoy.length > 0) {
        payload.reply_markup = {
          inline_keyboard: [[
            { text: '✅ Recibido', callback_data: 'recibido' },
            { text: '👍 Gracias', callback_data: 'gracias' },
            { text: '📅 Horario', callback_data: 'horario' }
          ]]
        };
      }
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.ok) {
          mensajesEnviados++;
        } else {
          errores.push(`${nombre}: ${result.description || 'Error desconocido'}`);
        }
      } catch (error) {
        errores.push(`${nombre}: ${error.message}`);
      }
    }
    
    let respuesta = `🔔 Recordatorios enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += `\nErrores: ${errores.join(', ')}`;
    }
    
    return new Response(respuesta);
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}