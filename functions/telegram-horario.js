const HORARIO = {
  'lunes': [
    {'hora': '18:00-19:00', 'materia': 'GESTIÓN DE SISTEMAS DE CALIDAD', 'profesor': 'CATHY GUEVARA'},
    {'hora': '19:00-20:00', 'materia': 'GESTIÓN DE SISTEMAS DE CALIDAD', 'profesor': 'CATHY GUEVARA'},
    {'hora': '20:00-21:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA'},
  ],
  'martes': [
    {'hora': '19:00-20:00', 'materia': 'FORMULACIÓN Y EVALUACIÓN DEL TRABAJO DE TITULACIÓN	', 'profesor': 'DIEGO TERÁN'},
    {'hora': '20:00-21:00', 'materia': 'FORMULACIÓN Y EVALUACIÓN DEL TRABAJO DE TITULACIÓN	', 'profesor': 'DIEGO TERÁN'},
  ],
  'miercoles': [
    {'hora': '18:00-19:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO'},
    {'hora': '19:00-20:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO'},
    {'hora': '20:00-21:00', 'materia': 'COMPUTACIÓN MÓVIL', 'profesor': 'DIEGO TREJO'},
  ],
  'jueves': [
    {'hora': '18:00-19:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA'},
    {'hora': '19:00-20:00', 'materia': 'I.I. DESARROLLO BASADO EN FRAMEWORKS', 'profesor': 'PABLO LANDETA'},
    {'hora': '20:00-21:00', 'materia': 'SISTEMAS DISTRIBUIDOS', 'profesor': 'PABLO LANDETA'},
    {'hora': '21:00-22:00', 'materia': 'SISTEMAS DISTRIBUIDOS', 'profesor': 'PABLO LANDETA'}
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
        mensaje = `¡Buenos días *${nombre}*!\n\nNo tienes clases programadas para *${diaNombre.toUpperCase()}*\n\n¡Disfruta tu día libre! 🌟`;
      } else {
        mensaje = `¡Buenos días *${nombre}*!\n\n*HORARIO ${diaNombre.toUpperCase()}*\n========================\n\n`;
        
        horarioHoy.forEach((clase, i) => {
          mensaje += `*Clase ${i + 1}*\nHora: ${clase.hora}\nMateria: ${clase.materia}\nIng: ${clase.profesor}\n\n`;
        });
        
        mensaje += "========================\n¡Que tengas un excelente día académico!";
      }
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: mensaje,
            parse_mode: 'Markdown'
          })
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
    
    let respuesta = `📅 Horarios matutinos enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += `\nErrores: ${errores.join(', ')}`;
    }
    
    return new Response(respuesta);
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}