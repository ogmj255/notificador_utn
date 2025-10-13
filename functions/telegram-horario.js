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
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    
    const chatId = env.TELEGRAM_CHAT_IDS.trim();
    const nombre = env.STUDENT_NAMES || 'Estudiante';
    
    if (!chatId) {
      return new Response('Error: TELEGRAM_CHAT_IDS no configurado');
    }
    
    // Mensaje matutino (sin botones)
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
    
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
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
    
    return new Response(`📅 Horario matutino enviado: ${result.ok ? 'Éxito' : 'Error'}`);
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}