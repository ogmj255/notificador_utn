# Notificador de Horario UTN

Sistema automatizado para recibir notificaciones diarias del horario de clases por WhatsApp.

## Despliegue en Cloudflare Workers

### 1. Instalar Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Autenticar con Cloudflare
```bash
wrangler login
```

### 3. Desplegar
```bash
wrangler deploy
```

### 4. Configurar cron-job.org
- URL: `https://notificador-utn.tu-subdominio.workers.dev/enviar-notificacion`
- Schedule: `0 7 * * *` (7:00 AM diario)
- Timezone: America/Guayaquil

## Funcionalidades

- Notificaciones diarias automáticas a las 7:00 AM
- Soporte para múltiples números de WhatsApp
- Mensajes personalizados por estudiante
- Horario semanal completo de la UTN

## Estructura

- `src/index.js` - Worker de Cloudflare
- `wrangler.toml` - Configuración de Cloudflare
- `app.py` - Alternativa para Render.com
- `backend/` - Archivos Python originales