from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

class WhatsAppService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.from_number = os.getenv('WHATSAPP_FROM')
        self.to_number = os.getenv('STUDENT_PHONE')
        self.client = Client(self.account_sid, self.auth_token)
    
    def send_message(self, message):
        """Envía mensaje por WhatsApp"""
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=self.to_number
            )
            return True
        except Exception as e:
            print(f"Error enviando WhatsApp: {e}")
            return False
    
    def format_daily_schedule(self, schedule):
        """Formatea el horario del día"""
        if not schedule:
            return "📅 No tienes clases programadas para hoy"
        
        message = "📅 *Horario de Hoy*\n\n"
        for item in schedule:
            message += f"🕐 {item['time']}\n"
            message += f"📚 {item['subject']}\n"
            if item['classroom']:
                message += f"🏫 {item['classroom']}\n"
            message += "\n"
        
        return message
    
    def format_pending_activities(self, activities):
        """Formatea actividades pendientes"""
        if not activities:
            return "✅ No tienes actividades pendientes"
        
        message = "⚠️ *Actividades Pendientes*\n\n"
        for activity in activities:
            message += f"📚 {activity['subject']}\n"
            message += f"📝 {activity['type']}: {activity['description']}\n"
            message += f"📅 Vence: {activity['due_date']}\n\n"
        
        return message