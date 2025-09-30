# Notificador de Horario UTN

Sistema simple para recibir notificaciones diarias de tu horario de clases por WhatsApp.

## Configuración

1. **Instalar dependencias:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configurar Twilio WhatsApp:**
   - Crear cuenta en https://www.twilio.com/try-twilio
   - Ir a Messaging > Try it out > Send a WhatsApp message
   - Desde tu WhatsApp enviar `join <código>` al +1 415 523 8886
   - Obtener Account SID y Auth Token del dashboard

3. **Configurar variables de entorno:**
Editar el archivo `.env` con tus credenciales:
```
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
WHATSAPP_FROM=whatsapp:+14155238886
STUDENT_PHONE=whatsapp:+593xxxxxxxxx
```

4. **Personalizar horario:**
Editar `horario.py` con tu horario real de clases.

## Uso

### Enviar notificación manual:
```bash
cd backend
python notificador_diario.py
```

### Programar notificaciones automáticas:
```bash
cd backend
python programador.py
```

### Programar con Windows (Programador de Tareas):
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Programa: `python`
4. Argumentos: `C:\ruta\al\proyecto\backend\notificador_diario.py`
5. Programar para las 7:00 AM diariamente

## Estructura

- `horario.py` - Horario semanal de clases
- `whatsapp_simple.py` - Servicio de WhatsApp
- `notificador_diario.py` - Script principal
- `programador.py` - Programador automático

## Personalización

Edita `horario.py` para agregar/modificar tus materias:
```python
'lunes': [
    {'hora': '08:00-10:00', 'materia': 'Tu Materia', 'aula': 'Tu Aula'},
]
```