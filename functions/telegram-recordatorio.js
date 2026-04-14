const HORARIO = {
  'lunes': [
    {'hora': '18:00-19:00', 'materia': 'GESTIÓN DE SISTEMAS DE CALIDAD', 'profesor': 'CATHY GUEVARA','zoom': 'https://cedia.zoom.us/j/81850705472'},
    {'hora': '19:00-20:00', 'materia': 'GESTIÓN DE SISTEMAS DE CALIDAD', 'profesor': 'CATHY GUEVARA','zoom': 'https://cedia.zoom.us/j/81850705472'},
    {'hora': '20:00-21:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA','zoom': 'https://cedia.zoom.us/j/87211572878'},
  ],
  'martes': [
    {'hora': '19:00-20:00', 'materia': 'FORMULACIÓN Y EVALUACIÓN DEL TRABAJO DE TITULACIÓN	', 'profesor': 'DIEGO TERÁN','zoom': 'https://cedia.zoom.us/j/82302575429'},
    {'hora': '20:00-21:00', 'materia': 'FORMULACIÓN Y EVALUACIÓN DEL TRABAJO DE TITULACIÓN	', 'profesor': 'DIEGO TERÁN','zoom': 'https://cedia.zoom.us/j/82302575429'},
  ],
  'miercoles': [
    {'hora': '18:00-19:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO','TEAMS': 'REUNION POR TEAMS'},
    {'hora': '19:00-20:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO','TEAMS': 'REUNION POR TEAMS'},
    {'hora': '20:00-21:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO','TEAMS': 'REUNION POR TEAMS'},
  ],
  'jueves': [
    {'hora': '18:00-19:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA', 'zoom': 'https://cedia.zoom.us/j/87926689296'},
    {'hora': '19:00-20:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA', 'zoom': 'https://cedia.zoom.us/j/87926689296'},
    {'hora': '20:00-21:00', 'materia': 'SISTEMAS DISTRIBUIDOS', 'profesor': 'PABLO LANDETA', 'zoom': 'https://cedia.zoom.us/j/83947994550'},
    {'hora': '21:00-22:00', 'materia': 'SISTEMAS DISTRIBUIDOS', 'profesor': 'PABLO LANDETA', 'zoom': 'https://cedia.zoom.us/j/83947994550'}
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
      
      let mensaje;
      if (!horarioHoy || horarioHoy.length === 0) {
        mensaje = `Hola *${nombre}*!\n\nNo tienes clases programadas para *${diaNombre.toUpperCase()}*\n\n¡Disfruta tu tarde libre! 🌟`;
      } else {
        mensaje = `🔔 *RECORDATORIO DE CLASES*\n\n¡Hola *${nombre}*!\n\nTienes clases hoy *${diaNombre.toUpperCase()}* a partir de las 18:00:\n\n`;
        
        horarioHoy.forEach((clase, i) => {
          mensaje += `📚 ${clase.hora} - ${clase.materia}\n👨🏫 Ing. ${clase.profesor}\n`;
          
          if (clase.teams) {
            mensaje += `📱 ${clase.teams}\n`;
          } else if (clase.zoom && clase.zoom !== 'PENDIENTE_ENLACE') {
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