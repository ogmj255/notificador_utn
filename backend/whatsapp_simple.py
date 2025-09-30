from twilio.rest import Client
import os

class WhatsAppNotifier:
    def __init__(self):
        self.account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        self.auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        self.from_number = os.environ.get('WHATSAPP_FROM')
        self.to_number = os.environ.get('STUDENT_PHONE')
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
    
    def enviar_horario(self, horario, dia):
        if self.client:
            try:
                numeros = os.environ.get('STUDENT_PHONE', '').split(',')
                nombres = os.environ.get('STUDENT_NAMES', '').split(',')
                
                for i, numero in enumerate(numeros):
                    numero = numero.strip()
                    if numero:
                        nombre = nombres[i].strip() if i < len(nombres) else 'Estudiante'
                        mensaje = self.formatear_mensaje(horario, dia, nombre)
                        self.client.messages.create(
                            body=mensaje,
                            from_=self.from_number,
                            to=numero
                        )
                return True
            except:
                return False
        return True
    
    def formatear_mensaje(self, horario, dia, nombre=None):
        if not nombre:
            nombre = os.environ.get('STUDENT_NAME', 'Estudiante')
        
        if not horario:
            return f"Buenos dias *{nombre}*!\n\nNo tienes clases programadas para *{dia.upper()}*\n\nDisfruta tu dia libre!"

        mensaje = f"Buenos dias *{nombre}*!\n\n"
        mensaje += f"*HORARIO {dia.upper()}*\n"
        mensaje += "========================\n\n"

        for i, clase in enumerate(horario, 1):
            mensaje += f"*Clase {i}*\n"
            mensaje += f"Hora: {clase['hora']}\n"
            mensaje += f"Materia: {clase['materia']}\n"
            if 'profesor' in clase:
                mensaje += f"Profesor: {clase['profesor']}\n\n"
            else:
                mensaje += f"Aula: {clase.get('aula', '')}\n\n"

        mensaje += "========================\n"
        mensaje += "Que tengas un excelente dia academico!"
        return mensaje