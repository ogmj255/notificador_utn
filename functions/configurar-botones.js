export async function onRequest(context) {
  const { env, request } = context;
  
  if (request.method === 'POST') {
    try {
      const { contentSid } = await request.json();
      
      if (!contentSid || !contentSid.startsWith('HX')) {
        return new Response('Error: ContentSid inválido. Debe empezar con HX', { status: 400 });
      }
      
      // Aquí normalmente actualizarías una base de datos o variable de entorno
      // Por ahora, solo devolvemos instrucciones
      
      return new Response(`✅ ContentSid recibido: ${contentSid}

📝 INSTRUCCIONES:
1. Copia este ContentSid: ${contentSid}
2. Ve al archivo functions/recordatorio.js
3. Reemplaza 'CONTENT_SID_AQUI' con: ${contentSid}
4. Guarda y haz push a GitHub

🔄 Después de esto, /recordatorio enviará mensajes con botones reales.

📱 Los usuarios verán 3 botones:
   ✅ Recibido
   👍 Gracias  
   📅 Horario`, {
        headers: { 'Content-Type': 'text/plain' }
      });
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 400 });
    }
  }
  
  // GET request - mostrar formulario
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Configurar Botones WhatsApp</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .container { max-width: 600px; margin: 0 auto; }
    input { width: 100%; padding: 10px; margin: 10px 0; }
    button { background: #007acc; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; }
    .step { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔧 Configurar Botones WhatsApp</h1>
    
    <div class="step">
      <h3>Paso 1: Crear Contenido</h3>
      <p>Primero ve a: <a href="/crear-contenido" target="_blank">/crear-contenido</a></p>
      <p>Copia el ContentSid que te devuelve (empieza con HX...)</p>
    </div>
    
    <div class="step">
      <h3>Paso 2: Configurar ContentSid</h3>
      <form id="configForm">
        <label>ContentSid:</label>
        <input type="text" id="contentSid" placeholder="HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" required>
        <button type="submit">Configurar Botones</button>
      </form>
    </div>
    
    <div id="result"></div>
  </div>
  
  <script>
    document.getElementById('configForm').onsubmit = async (e) => {
      e.preventDefault();
      const contentSid = document.getElementById('contentSid').value;
      
      const response = await fetch('/configurar-botones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentSid })
      });
      
      const result = await response.text();
      document.getElementById('result').innerHTML = '<pre>' + result + '</pre>';
    };
  </script>
</body>
</html>`;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}