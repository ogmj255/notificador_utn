# Desplegar en Cloudflare Workers

## 1. Instalar Wrangler CLI
```bash
npm install -g wrangler
```

## 2. Autenticar con Cloudflare
```bash
wrangler login
```

## 3. Configurar variables de entorno
Editar `wrangler.toml` con tus credenciales:
```toml
[vars]
TWILIO_ACCOUNT_SID = "ACf4ea1b96456fc01f6d39b55bcbe42adc"
TWILIO_AUTH_TOKEN = "adfcb3fa55747377a7e0d00b922569f6"
WHATSAPP_FROM = "whatsapp:+14155238886"
STUDENT_PHONE = "whatsapp:+593985051676,whatsapp:+593967896267"
STUDENT_NAMES = "Omar,Domenica"
```

## 4. Desplegar
```bash
wrangler deploy
```

## 5. URL resultante
Tu worker estará disponible en:
`https://notificador-utn.tu-subdominio.workers.dev`

## 6. Configurar cron-job.org
URL para cron: `https://notificador-utn.tu-subdominio.workers.dev/enviar-notificacion`

## Ventajas de Cloudflare Workers
- Gratis hasta 100,000 requests/día
- Más rápido que Render
- Sin cold starts
- Global edge network