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
  const { env, request } = context;
  
  if (request.method === 'POST') {
    const update = await request.json();
    return handleTelegramUpdate(update, env);
  }
  return enviarNotificacion(env);
}

async function enviarNotificacion(env) {
  try {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const hoy = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    
    const chatId = env.TELEGRAM_CHAT_IDS.trim();
    const nombre = env.STUDENT_NAMES || 'Estudiante';
    let mensajesEnviados = 0;
    
    if (chatId) {
      const mensaje = formatearMensaje(horarioHoy, diaNombre, nombre);
      
      const resultado = await enviarMensajeTelegram(env.TELEGRAM_BOT_TOKEN, chatId, mensaje, horarioHoy.length > 0);
      if (resultado.ok) {
        mensajesEnviados++;
      }
    }
    
    return new Response(`📱 Mensajes enviados: ${mensajesEnviados}`);
    
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}

async function handleTelegramUpdate(update, env) {
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const firstName = update.message.chat.first_name || 'Usuario';
    
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `¡Hola ${firstName}! 👋\n\n🆔 Tu Chat ID es: \`${chatId}\`\n\n📋 Para agregarte al sistema:\n1. Copia este Chat ID\n2. Actualiza TELEGRAM_CHAT_IDS en Cloudflare\n3. Agrega tu nombre en STUDENT_NAMES`,
        parse_mode: 'Markdown'
      })
    });
    
    return new Response('OK');
  }
  
  if (update.callback_query) {
    const callbackData = update.callback_query.data;
    const chatId = update.callback_query.message.chat.id;
    const messageId = update.callback_query.message.message_id;
    
    let respuesta = '';
    const respuestas = {
      'recibido': [
        '✅ ¡Perfecto! Recordatorio confirmado.',
        '✅ ¡Genial! Ya tienes todo listo.',
        '✅ ¡Excelente! Que tengas buen día académico.',
        '✅ ¡Confirmado! Éxito en tus clases.',
        '✅ ¡Listo! Preparado para estudiar.'
      ],
      'gracias': [
        '😊 ¡De nada! Siempre aquí para apoyarte.',
        '😊 ¡Un placer! Que disfrutes tus clases.',
        '😊 ¡Para eso estoy! Buen día académico.',
        '😊 ¡Siempre! Tu educación es prioridad.',
        '😊 ¡Con gusto! Que aprendas mucho hoy.'
      ],
      'horario': [
        '📅 Aquí tienes tu horario completo UTN.',
        '📅 Te muestro todas tus clases.',
        '📅 Este es tu cronograma semanal.',
        '📅 Revisa tu horario completo.'
      ]
    };
    
    const random = Math.floor(Math.random() * 5);
    if (callbackData in respuestas) {
      respuesta = respuestas[callbackData][random % respuestas[callbackData].length];
    }
    
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: update.callback_query.id,
        text: respuesta
      })
    });
    
    return new Response('OK');
  }
  
  return new Response('OK');
}

function formatearMensaje(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `¡Buenos días *${nombre}*!\n\nNo tienes clases programadas para *${dia.toUpperCase()}*\n\n¡Disfruta tu día libre! 🌟`;
  }

  let mensaje = `🔔 *RECORDATORIO DE CLASES*\n\n¡Hola *${nombre}*!\n\nTienes clases hoy *${dia.toUpperCase()}* a partir de las 18:00:\n\n`;

  horario.forEach((clase, i) => {
    mensaje += `📚 ${clase.hora} - ${clase.materia}\n👨‍🏫 Ing. ${clase.profesor}\n\n`;
  });

  mensaje += "⏰ *¡No olvides conectarte a tiempo!*";
  return mensaje;
}

async function enviarMensajeTelegram(botToken, chatId, mensaje, conBotones) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text: mensaje,
    parse_mode: 'Markdown'
  };
  
  if (conBotones) {
    payload.reply_markup = {
      inline_keyboard: [[
        { text: '✅ Recibido', callback_data: 'recibido' },
        { text: '👍 Gracias', callback_data: 'gracias' },
        { text: '📅 Horario', callback_data: 'horario' }
      ]]
    };
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return response.json();
}