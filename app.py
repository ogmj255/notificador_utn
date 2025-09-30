from flask import Flask
import os
from twilio.rest import Client

app = Flask(__name__)

HORARIO = {
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
    'viernes': [],
    'sabado': [],
    'domingo': []
}

@app.route('/enviar-notificacion')
def enviar_notificacion():
    """Endpoint que activa cron-job.org"""
    from datetime import datetime
    
    dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    hoy = datetime.now().weekday()
    dia_nombre = dias[hoy]
    horario_hoy = HORARIO.get(dia_nombre, [])
    nombre = os.environ.get('STUDENT_NAME', 'Estudiante')
    
    if not horario_hoy:
        mensaje = f"¡Buenos días *{nombre}*!\n\nNo tienes clases programadas para *{dia_nombre.upper()}*\n\nDisfruta tu día libre!"
    else:
        mensaje = f"¡Buenos días *{nombre}*!\n\n"
        mensaje += f"📅*HORARIO {dia_nombre.upper()}*\n"
        mensaje += "========================\n\n"
        
        for i, clase in enumerate(horario_hoy, 1):
            mensaje += f"*Clase {i}*\n"
            mensaje += f"🕕Hora: {clase['hora']}\n"
            mensaje += f"📖Materia: {clase['materia']}\n"
            mensaje += f"🧑‍💻Ing: {clase['profesor']}\n\n"
        
        mensaje += "========================\n"
        mensaje += "¡Que tengas un excelente día académico!💫"
    try:
        client = Client(
            os.environ.get('TWILIO_ACCOUNT_SID'),
            os.environ.get('TWILIO_AUTH_TOKEN')
        )
        
        numeros = os.environ.get('STUDENT_PHONE', '').split(',')
        nombres = os.environ.get('STUDENT_NAMES', '').split(',')
        mensajes_enviados = []
        
        for i, numero in enumerate(numeros):
            numero = numero.strip()
            if numero:
                nombre_actual = nombres[i].strip() if i < len(nombres) else 'Estudiante'
                mensaje_personalizado = mensaje.replace('*Estudiante*', f'*{nombre_actual}*')
                message = client.messages.create(
                    body=mensaje_personalizado,
                    from_=os.environ.get('WHATSAPP_FROM'),
                    to=numero
                )
                mensajes_enviados.append(message.sid)
        
        return f"Mensajes enviados: {len(mensajes_enviados)}"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def home():
    return "Servicio de notificaciones UTN activo ✅"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))