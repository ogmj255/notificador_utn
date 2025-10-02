export async function onRequest(context) {
  const { request } = context;
  
  if (request.method === 'POST') {
    const formData = await request.formData();
    const body = formData.get('Body') || '';
    const from = formData.get('From') || '';
    
    let respuesta = '';
    
    if (body.toLowerCase().includes('recibido')) {
      respuesta = '✅ ¡Perfecto! Recordatorio confirmado. ¡Que tengas excelentes clases!';
    } else if (body.toLowerCase().includes('gracias')) {
      respuesta = '😊 ¡De nada! Siempre aquí para recordarte tu horario académico.';
    } else {
      respuesta = '👋 ¡Hola! Soy tu asistente de horarios UTN. Te envío recordatorios diarios automáticamente.';
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