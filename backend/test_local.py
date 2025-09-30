import os
from twilio.rest import Client

# Configurar credenciales directamente
os.environ['TWILIO_ACCOUNT_SID'] = 'ACf4ea1b96456fc01f6d39b55bcbe42adc'
os.environ['TWILIO_AUTH_TOKEN'] = 'adfcb3fa55747377a7e0d00b922569f6'
os.environ['WHATSAPP_FROM'] = 'whatsapp:+14155238886'
os.environ['STUDENT_PHONE'] = 'whatsapp:+593985051676'
os.environ['STUDENT_NAME'] = 'Omar'

def test_whatsapp():
    """Prueba local de WhatsApp"""
    try:
        client = Client(
            os.environ['TWILIO_ACCOUNT_SID'],
            os.environ['TWILIO_AUTH_TOKEN']
        )
        
        mensaje = "Prueba local - Buenos dias Omar! Tu horario funciona correctamente."
        
        message = client.messages.create(
            body=mensaje,
            from_=os.environ['WHATSAPP_FROM'],
            to=os.environ['STUDENT_PHONE']
        )
        
        print(f"Mensaje enviado exitosamente: {message.sid}")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Probando WhatsApp localmente...")
    test_whatsapp()