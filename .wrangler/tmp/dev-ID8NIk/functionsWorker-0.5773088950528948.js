var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-onk0Kq/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-hH4NNq/functionsWorker-0.5773088950528948.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
async function onRequest(context) {
  const { env } = context;
  try {
    const contentUrl = "https://content.twilio.com/v1/Content";
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    const contentData = {
      "FriendlyName": "Recordatorio UTN",
      "Language": "es",
      "Types": JSON.stringify([{
        "type": "twilio/quick-reply",
        "body": "\u{1F514} RECORDATORIO DE CLASES\n\nHola {{1}}!\n\nTienes clases hoy {{2}} a partir de las 18:00:\n\n{{3}}\n\u23F0 \xA1No olvides conectarte a tiempo!",
        "actions": [
          { "title": "\u2705 Recibido" },
          { "title": "\u{1F44D} Gracias" },
          { "title": "\u{1F4C5} Horario" }
        ]
      }])
    };
    const contentResponse = await fetch(contentUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(contentData)
    });
    const contentResult = await contentResponse.json();
    if (!contentResult.sid) {
      return new Response(`Error creando contenido: ${JSON.stringify(contentResult)}`, { status: 400 });
    }
    const HORARIO3 = {
      "jueves": [
        { "hora": "18:00-19:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
        { "hora": "19:00-20:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
        { "hora": "20:00-21:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" },
        { "hora": "21:00-22:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" }
      ]
    };
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const hoy = (/* @__PURE__ */ new Date()).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date()).getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO3[diaNombre] || [];
    let clases = "";
    horarioHoy.forEach((clase, i) => {
      clases += `\u{1F4DA} ${clase.hora} - ${clase.materia}
\u{1F468}\u{1F3EB} Ing. ${clase.profesor}

`;
    });
    const messageUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const numeros = env.STUDENT_PHONE.split(",");
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(",") : [];
    let mensajesEnviados = 0;
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : "Estudiante";
        const messageResponse = await fetch(messageUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            from: env.WHATSAPP_FROM,
            to: numero,
            content_sid: contentResult.sid,
            content_variables: JSON.stringify({
              "1": nombre,
              "2": diaNombre.toUpperCase(),
              "3": clases
            })
          })
        });
        const messageResult = await messageResponse.json();
        if (messageResult.sid) {
          mensajesEnviados++;
        }
      }
    }
    return new Response(`\u2705 Contenido creado: ${contentResult.sid}
\u{1F4F1} Mensajes con botones enviados: ${mensajesEnviados}`);
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
async function onRequest2(context) {
  const { env } = context;
  try {
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response("Error: TWILIO_ACCOUNT_SID no configurado");
    }
    if (!env.STUDENT_PHONE) {
      return new Response("Error: STUDENT_PHONE no configurado");
    }
    const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    const numeros = env.STUDENT_PHONE.split(",");
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(",") : [];
    let mensajesEnviados = 0;
    let errores = [];
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : "Estudiante";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            From: env.WHATSAPP_FROM,
            To: numero,
            Body: `\u{1F514} *RECORDATORIO CLASES UTN*

Hola *${nombre}*!

\u{1F4DA} Tienes clases hoy a las 18:00
\u23F0 \xA1No olvides conectarte!

\u{1F447} Responde con:`,
            // Intentar agregar botones usando MediaUrl (método alternativo)
            MediaUrl: "https://via.placeholder.com/300x100/007acc/white?text=Botones+de+Respuesta"
          })
        });
        const resultado = await response.json();
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || "Error desconocido"}`);
        }
      }
    }
    let respuesta = `Mensajes con botones enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(", ")}`;
    }
    return new Response(respuesta);
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}
__name(onRequest2, "onRequest2");
__name2(onRequest2, "onRequest");
async function onRequest3(context) {
  const { env, request } = context;
  if (request.method === "POST") {
    try {
      const { contentSid } = await request.json();
      if (!contentSid || !contentSid.startsWith("HX")) {
        return new Response("Error: ContentSid inv\xE1lido. Debe empezar con HX", { status: 400 });
      }
      return new Response(`\u2705 ContentSid recibido: ${contentSid}

\u{1F4DD} INSTRUCCIONES:
1. Copia este ContentSid: ${contentSid}
2. Ve al archivo functions/recordatorio.js
3. Reemplaza 'CONTENT_SID_AQUI' con: ${contentSid}
4. Guarda y haz push a GitHub

\u{1F504} Despu\xE9s de esto, /recordatorio enviar\xE1 mensajes con botones reales.

\u{1F4F1} Los usuarios ver\xE1n 3 botones:
   \u2705 Recibido
   \u{1F44D} Gracias  
   \u{1F4C5} Horario`, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 400 });
    }
  }
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
    <h1>\u{1F527} Configurar Botones WhatsApp</h1>
    
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
  <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
__name(onRequest3, "onRequest3");
__name2(onRequest3, "onRequest");
async function onRequest4(context) {
  const { env } = context;
  try {
    const url = "https://content.twilio.com/v1/Content";
    const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
    const data = {
      "FriendlyName": "Recordatorio de clases UTN",
      "Language": "es",
      "Types": '[{"type":"twilio/quick-reply","body":"\u{1F514} RECORDATORIO DE CLASES\n\nHola {{1}}!\n\nTienes clases hoy {{2}} a partir de las 18:00:\n\n{{3}}\n\u23F0 \xA1No olvides conectarte a tiempo!","actions":[{"title":"\u2705 Recibido"},{"title":"\u{1F44D} Gracias"},{"title":"\u{1F4C5} Horario"}]}]'
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(data)
    });
    const result = await response.json();
    if (result.sid) {
      return new Response(`\u2705 Contenido creado exitosamente!

ContentSid: ${result.sid}

Copia este SID y reemplaza 'CONTENT_SID_AQUI' en recordatorio.js`, {
        headers: { "Content-Type": "text/plain" }
      });
    } else {
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}
__name(onRequest4, "onRequest4");
__name2(onRequest4, "onRequest");
var HORARIO = {
  "lunes": [
    { "hora": "18:00-19:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" },
    { "hora": "19:00-20:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" },
    { "hora": "20:00-21:00", "materia": "Deontolog\xEDa", "profesor": "Carlos D\xE1vila Montalvo" },
    { "hora": "21:00-22:00", "materia": "Deontolog\xEDa", "profesor": "Carlos D\xE1vila Montalvo" }
  ],
  "martes": [
    { "hora": "18:00-19:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" },
    { "hora": "19:00-20:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "20:00-21:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" }
  ],
  "miercoles": [
    { "hora": "18:00-19:00", "materia": "Emprendimiento e Innovaci\xF3n", "profesor": "Marcelo Cisneros Ruales" },
    { "hora": "19:00-20:00", "materia": "Emprendimiento e Innovaci\xF3n", "profesor": "Marcelo Cisneros Ruales" }
  ],
  "jueves": [
    { "hora": "18:00-19:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "19:00-20:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "20:00-21:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" },
    { "hora": "21:00-22:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" }
  ],
  "viernes": [],
  "sabado": [],
  "domingo": []
};
async function onRequest5(context) {
  const { env } = context;
  try {
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response("Error: TWILIO_ACCOUNT_SID no configurado");
    }
    if (!env.STUDENT_PHONE) {
      return new Response("Error: STUDENT_PHONE no configurado");
    }
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const hoy = (/* @__PURE__ */ new Date()).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date()).getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO[diaNombre] || [];
    const numeros = env.STUDENT_PHONE.split(",");
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(",") : [];
    let mensajesEnviados = 0;
    let errores = [];
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : "Estudiante";
        const mensaje = formatearMensajeMa\u00F1ana(horarioHoy, diaNombre, nombre);
        const resultado = await enviarWhatsApp(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.WHATSAPP_FROM, numero, mensaje);
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || "Error desconocido"}`);
        }
      }
    }
    let respuesta = `Mensajes enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(", ")}`;
    }
    return new Response(respuesta);
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}
__name(onRequest5, "onRequest5");
__name2(onRequest5, "onRequest");
function formatearMensajeMa\u00F1ana(horario, dia, nombre) {
  if (!horario || horario.length === 0) {
    return `\xA1Buenos d\xEDas *${nombre}*!

No tienes clases programadas para *${dia.toUpperCase()}*

\xA1Disfruta tu d\xEDa libre!`;
  }
  let mensaje = `\xA1Buenos d\xEDas *${nombre}*!

*HORARIO ${dia.toUpperCase()}*
========================

`;
  horario.forEach((clase, i) => {
    mensaje += `*Clase ${i + 1}*
Hora: ${clase.hora}
Materia: ${clase.materia}
Ing: ${clase.profesor}

`;
  });
  mensaje += "========================\n\xA1Que tengas un excelente d\xEDa acad\xE9mico!";
  return mensaje;
}
__name(formatearMensajeMa\u00F1ana, "formatearMensajeMa\xF1ana");
__name2(formatearMensajeMa\u00F1ana, "formatearMensajeMa\xF1ana");
async function enviarWhatsApp(accountSid, authToken, from, to, body) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${accountSid}:${authToken}`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: from,
      To: to,
      Body: body
    })
  });
  return response.json();
}
__name(enviarWhatsApp, "enviarWhatsApp");
__name2(enviarWhatsApp, "enviarWhatsApp");
var HORARIO2 = {
  "lunes": [
    { "hora": "18:00-19:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" },
    { "hora": "19:00-20:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" },
    { "hora": "20:00-21:00", "materia": "Deontolog\xEDa", "profesor": "Carlos D\xE1vila Montalvo" },
    { "hora": "21:00-22:00", "materia": "Deontolog\xEDa", "profesor": "Carlos D\xE1vila Montalvo" }
  ],
  "martes": [
    { "hora": "18:00-19:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" },
    { "hora": "19:00-20:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "20:00-21:00", "materia": "Inteligencia Artificial", "profesor": "V\xEDctor Caranqui S\xE1nchez" }
  ],
  "miercoles": [
    { "hora": "18:00-19:00", "materia": "Emprendimiento e Innovaci\xF3n", "profesor": "Marcelo Cisneros Ruales" },
    { "hora": "19:00-20:00", "materia": "Emprendimiento e Innovaci\xF3n", "profesor": "Marcelo Cisneros Ruales" }
  ],
  "jueves": [
    { "hora": "18:00-19:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "19:00-20:00", "materia": "Auditor\xEDa de TI", "profesor": "Diego Ter\xE1n Pineda" },
    { "hora": "20:00-21:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" },
    { "hora": "21:00-22:00", "materia": "I.B. Programaci\xF3n Avanzada", "profesor": "Fausto Salazar Fierro" }
  ],
  "viernes": [],
  "sabado": [],
  "domingo": []
};
async function onRequest6(context) {
  const { env } = context;
  try {
    if (!env.TWILIO_ACCOUNT_SID) {
      return new Response("Error: TWILIO_ACCOUNT_SID no configurado");
    }
    if (!env.STUDENT_PHONE) {
      return new Response("Error: STUDENT_PHONE no configurado");
    }
    const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    const hoy = (/* @__PURE__ */ new Date()).getDay() === 0 ? 6 : (/* @__PURE__ */ new Date()).getDay() - 1;
    const diaNombre = dias[hoy];
    const horarioHoy = HORARIO2[diaNombre] || [];
    const numeros = env.STUDENT_PHONE.split(",");
    const nombres = env.STUDENT_NAMES ? env.STUDENT_NAMES.split(",") : [];
    let mensajesEnviados = 0;
    let errores = [];
    for (let i = 0; i < numeros.length; i++) {
      const numero = numeros[i].trim();
      if (numero) {
        const nombre = nombres[i] ? nombres[i].trim() : "Estudiante";
        const resultado = await enviarRecordatorio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN, env.WHATSAPP_FROM, numero, horarioHoy, diaNombre, nombre);
        if (resultado.sid) {
          mensajesEnviados++;
        } else {
          errores.push(`${numero}: ${resultado.message || "Error desconocido"}`);
        }
      }
    }
    let respuesta = `Recordatorios enviados: ${mensajesEnviados}`;
    if (errores.length > 0) {
      respuesta += ` | Errores: ${errores.join(", ")}`;
    }
    return new Response(respuesta);
  } catch (error) {
    return new Response(`Error: ${error.message}`);
  }
}
__name(onRequest6, "onRequest6");
__name2(onRequest6, "onRequest");
async function enviarRecordatorio(accountSid, authToken, from, to, horario, dia, nombre) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${accountSid}:${authToken}`);
  if (!horario || horario.length === 0) {
    const response2 = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        From: from,
        To: to,
        Body: `Hola *${nombre}*!

No tienes clases programadas para *${dia.toUpperCase()}*

\xA1Disfruta tu tarde libre!`
      })
    });
    return response2.json();
  }
  let clases = "";
  horario.forEach((clase, i) => {
    clases += `\u{1F4DA} ${clase.hora} - ${clase.materia}
\u{1F468}\u{1F3EB} Ing. ${clase.profesor}

`;
  });
  const numeroLimpio = from.replace("whatsapp:", "").replace("+", "");
  const enlaceRecibido = `https://wa.me/${numeroLimpio}?text=Recibido%20\u2705`;
  const enlaceGracias = `https://wa.me/${numeroLimpio}?text=Gracias%20\u{1F44D}`;
  const enlaceHorario = `https://wa.me/${numeroLimpio}?text=Horario%20\u{1F4C5}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: from,
      To: to,
      Body: `\u{1F514} *RECORDATORIO DE CLASES*

Hola *${nombre}*!

Tienes clases hoy *${dia.toUpperCase()}* a partir de las 18:00:

${clases}\u23F0 *\xA1No olvides conectarte a tiempo!*

\u2705 Confirmar: ${enlaceRecibido}
\u{1F44D} Gracias: ${enlaceGracias}
\u{1F4C5} Horario: ${enlaceHorario}`
    })
  });
  return response.json();
}
__name(enviarRecordatorio, "enviarRecordatorio");
__name2(enviarRecordatorio, "enviarRecordatorio");
async function onRequest7(context) {
  const { env } = context;
  const variables = {
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID ? "Configurado" : "NO configurado",
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN ? "Configurado" : "NO configurado",
    WHATSAPP_FROM: env.WHATSAPP_FROM || "NO configurado",
    STUDENT_PHONE: env.STUDENT_PHONE || "NO configurado"
  };
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}.json`;
      const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
      const response = await fetch(url, {
        headers: { "Authorization": `Basic ${auth}` }
      });
      variables.AUTH_TEST = response.ok ? "EXITOSO" : `ERROR: ${response.status}`;
    } catch (error) {
      variables.AUTH_TEST = `ERROR: ${error.message}`;
    }
  }
  return new Response(JSON.stringify(variables, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequest7, "onRequest7");
__name2(onRequest7, "onRequest");
async function onRequest8(context) {
  const { request } = context;
  if (request.method === "POST") {
    const formData = await request.formData();
    const body = formData.get("Body") || "";
    const from = formData.get("From") || "";
    console.log("Mensaje recibido:", body, "De:", from);
    const respuestasRecibido = [
      "\u2705 \xA1Perfecto! Recordatorio confirmado. \xA1Que tengas excelentes clases!",
      "\u2705 \xA1Genial! Ya tienes todo listo para tus clases de hoy.",
      "\u2705 \xA1Excelente! Recordatorio recibido. \xA1\xC9xito en tus estudios!",
      "\u2705 \xA1Confirmado! Que tengas un d\xEDa acad\xE9mico productivo.",
      "\u2705 \xA1Listo! Ya est\xE1s preparado para tus clases de hoy."
    ];
    const respuestasGracias = [
      "\u{1F60A} \xA1De nada! Siempre aqu\xED para apoyar tu \xE9xito acad\xE9mico.",
      "\u{1F60A} \xA1Un placer! Que tengas un excelente d\xEDa de clases.",
      "\u{1F60A} \xA1Para eso estoy! \xA1Que disfrutes tus materias de hoy!",
      "\u{1F60A} \xA1Siempre! Tu educaci\xF3n es mi prioridad.",
      "\u{1F60A} \xA1Con gusto! \xA1Que tengas un d\xEDa lleno de aprendizaje!"
    ];
    const respuestasHorario = [
      "\u{1F4C5} Aqu\xED tienes tu horario completo de la semana UTN.",
      "\u{1F4C5} Te muestro todas tus clases programadas.",
      "\u{1F4C5} Este es tu cronograma acad\xE9mico semanal.",
      "\u{1F4C5} Revisa tu horario completo de clases."
    ];
    const respuestasSaludo = [
      "\u{1F44B} \xA1Hola! Soy tu asistente personal de horarios UTN.",
      "\u{1F44B} \xA1Saludos! Te ayudo con tus recordatorios acad\xE9micos.",
      "\u{1F44B} \xA1Hola estudiante! Aqu\xED para organizar tu d\xEDa.",
      "\u{1F44B} \xA1Bienvenido! Tu asistente de clases UTN a tu servicio."
    ];
    let respuesta = "";
    const random = Math.floor(Math.random() * 5);
    if (body.toLowerCase().includes("recibido")) {
      respuesta = respuestasRecibido[random % respuestasRecibido.length];
    } else if (body.toLowerCase().includes("gracias")) {
      respuesta = respuestasGracias[random % respuestasGracias.length];
    } else if (body.toLowerCase().includes("horario")) {
      respuesta = respuestasHorario[random % respuestasHorario.length];
    } else {
      respuesta = respuestasSaludo[random % respuestasSaludo.length];
    }
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${respuesta}</Message>
</Response>`;
    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" }
    });
  }
  return new Response("Webhook funcionando", { status: 200 });
}
__name(onRequest8, "onRequest8");
__name2(onRequest8, "onRequest");
var routes = [
  {
    routePath: "/botones-reales",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/botones-simples",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/configurar-botones",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/crear-contenido",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/enviar-notificacion",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/recordatorio",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/test",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/webhook",
    mountPath: "/",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-onk0Kq/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-onk0Kq/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.5773088950528948.js.map
