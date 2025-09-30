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
        mensaje = self.formatear_mensaje(horario, dia)
        
        if self.client:
            try:
                message = self.client.messages.create(
                    body=mensaje,
                    from_=self.from_number,
                    to=self.to_number
                )
                return True
            except:
                return False
        return True
    
    def formatear_mensaje(self, horario, dia):
        if not horario:
            return f"Buenos días! No tienes clases programadas para {dia.upper()}"
        
        mensaje = f"Buenos días! Tu horario para {dia.upper()}:\n\n"
        
        for clase in horario:
            mensaje += f"{clase['hora']}\n"
            mensaje += f"{clase['materia']}\n"
            if 'profesor' in clase:
                mensaje += f"Prof: {clase['profesor']}\n\n"
            else:
                mensaje += f"{clase.get('aula', '')}\n\n"
        
        mensaje += "Que tengas un excelente día!"
        return mensaje