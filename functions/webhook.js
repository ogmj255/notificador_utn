export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'POST') {
    const formData = await request.formData();
    const body = formData.get('Body') || '';
    const from = formData.get('From') || '';
    
    // Debug: log del mensaje recibido
    console.log('Mensaje recibido:', body, 'De:', from);
    
    // Respuestas dinámicas que cambian aleatoriamente
    const respuestasRecibido = [
      '✅ ¡Perfecto! Recordatorio confirmado. ¡Que tengas excelentes clases!',
      '✅ ¡Genial! Ya tienes todo listo para tus clases de hoy.',
      '✅ ¡Excelente! Recordatorio recibido. ¡Éxito en tus estudios!',
      '✅ ¡Confirmado! Que tengas un día académico productivo.',
      '✅ ¡Listo! Ya estás preparado para tus clases de hoy.'
    ];
    
    const respuestasGracias = [
      '😊 ¡De nada! Siempre aquí para apoyar tu éxito académico.',
      '😊 ¡Un placer! Que tengas un excelente día de clases.',
      '😊 ¡Para eso estoy! ¡Que disfrutes tus materias de hoy!',
      '😊 ¡Siempre! Tu educación es mi prioridad.',
      '😊 ¡Con gusto! ¡Que tengas un día lleno de aprendizaje!'
    ];
    
    const respuestasHorario = [
      '📅 Aquí tienes tu horario completo de la semana UTN.',
      '📅 Te muestro todas tus clases programadas.',
      '📅 Este es tu cronograma académico semanal.',
      '📅 Revisa tu horario completo de clases.'
    ];
    
    const respuestasSaludo = [
      '👋 ¡Hola! Soy tu asistente personal de horarios UTN.',
      '👋 ¡Saludos! Te ayudo con tus recordatorios académicos.',
      '👋 ¡Hola estudiante! Aquí para organizar tu día.',
      '👋 ¡Bienvenido! Tu asistente de clases UTN a tu servicio.'
    ];
    
    let respuesta = '';
    const random = Math.floor(Math.random() * 5);
    
    if (body.toLowerCase().includes('recibido')) {
      respuesta = respuestasRecibido[random % respuestasRecibido.length];
    } else if (body.toLowerCase().includes('gracias')) {
      respuesta = respuestasGracias[random % respuestasGracias.length];
    } else if (body.toLowerCase().includes('horario')) {
      respuesta = respuestasHorario[random % respuestasHorario.length];
    } else {
      respuesta = respuestasSaludo[random % respuestasSaludo.length];
    }
    
    // Respuesta TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${respuesta}</Message>
</Response>`;
    
    return new Response(twiml, {
      headers: { 'Content-Type': 'text/xml' }
    });
  }
  
  return new Response('Webhook funcionando', { status: 200 });
}