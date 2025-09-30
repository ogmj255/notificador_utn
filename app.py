from flask import Flask
import os
from twilio.rest import Client

app = Flask(__name__)

# Horario directo en el código
HORARIO = {
    'lunes': [
        {'hora': '18:00-19:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Caranqui Sánchez Víctor Manuel'},
        {'hora': '19:00-20:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Caranqui Sánchez Víctor Manuel'},
        {'hora': '20:00-21:00', 'materia': 'Deontología', 'profesor': 'Dávila Montalvo Carlos Andrés'},
        {'hora': '21:00-22:00', 'materia': 'Deontología', 'profesor': 'Dávila Montalvo Carlos Andrés'}
    ],
    'martes': [
        {'hora': '18:00-19:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Salazar Fierro Fausto Alberto'},
        {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Terán Pineda Diego Francisco'},
        {'hora': '20:00-21:00', 'materia': 'Inteligencia Artificial', 'profesor': 'Caranqui Sánchez Víctor Manuel'}
    ],
    'miercoles': [
        {'hora': '18:00-19:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Cisneros Ruales Marcelo Bayardo'},
        {'hora': '19:00-20:00', 'materia': 'Emprendimiento e Innovación', 'profesor': 'Cisneros Ruales Marcelo Bayardo'}
    ],
    'jueves': [
        {'hora': '18:00-19:00', 'materia': 'Auditoría de TI', 'profesor': 'Terán Pineda Diego Francisco'},
        {'hora': '19:00-20:00', 'materia': 'Auditoría de TI', 'profesor': 'Terán Pineda Diego Francisco'},
        {'hora': '20:00-21:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Salazar Fierro Fausto Alberto'},
        {'hora': '21:00-22:00', 'materia': 'I.B. Programación Avanzada', 'profesor': 'Salazar Fierro Fausto Alberto'}
    ],
    'viernes': [], 'sabado': [], 'domingo': []
}

@app.route('/enviar-notificacion')
def enviar_notificacion():
    """Endpoint que activa cron-job.org"""
    from datetime import datetime
    
    dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    hoy = datetime.now().weekday()
    dia_nombre = dias[hoy]
    horario_hoy = HORARIO.get(dia_nombre, [])
    
    # Formatear mensaje
    if not horario_hoy:
        mensaje = f"Buenos días! No tienes clases programadas para {dia_nombre.upper()}"
    else:
        mensaje = f"Buenos días! Tu horario para {dia_nombre.upper()}:\n\n"
        for clase in horario_hoy:
            mensaje += f"{clase['hora']}\n{clase['materia']}\nProf: {clase['profesor']}\n\n"
        mensaje += "Que tengas un excelente día!"
    
    # Enviar WhatsApp
    try:
        client = Client(
            os.environ.get('TWILIO_ACCOUNT_SID'),
            os.environ.get('TWILIO_AUTH_TOKEN')
        )
        message = client.messages.create(
            body=mensaje,
            from_=os.environ.get('WHATSAPP_FROM'),
            to=os.environ.get('STUDENT_PHONE')
        )
        return f"Mensaje enviado: {message.sid}"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def home():
    return "Servicio de notificaciones UTN activo ✅"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))