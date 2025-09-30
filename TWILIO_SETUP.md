# Configuración Twilio WhatsApp

## 1. Crear Cuenta Twilio
1. Ir a https://www.twilio.com/try-twilio
2. Registrarse con email
3. Verificar número de teléfono

## 2. Configurar WhatsApp Sandbox
1. En el dashboard de Twilio ir a: **Messaging > Try it out > Send a WhatsApp message**
2. Copiar el número sandbox: `+1 415 523 8886`
3. Desde tu WhatsApp personal enviar: `join <código>` al número sandbox
4. Ejemplo: `join shadow-thumb`

## 3. Obtener Credenciales
En el dashboard de Twilio:
- **Account SID**: En la página principal
- **Auth Token**: Hacer clic en "Show" junto al Auth Token

## 4. Configurar .env
```env
UTN_USERNAME=tu_usuario_utn
UTN_PASSWORD=tu_contraseña_utn
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu_auth_token_aqui
WHATSAPP_FROM=whatsapp:+14155238886
STUDENT_PHONE=whatsapp:+593987654321
```

## 5. Números de Teléfono
- **WHATSAPP_FROM**: Siempre `whatsapp:+14155238886` (número sandbox)
- **STUDENT_PHONE**: Tu número con código país `whatsapp:+593xxxxxxxxx`

## 6. Limitaciones Sandbox
- Solo puedes enviar a números que se unieron al sandbox
- Mensajes tienen prefijo automático
- Para producción necesitas número verificado ($$$)