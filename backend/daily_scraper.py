import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Agregar el directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.utn_scraper import UTNScraper
from services.whatsapp_service import WhatsAppService

load_dotenv()

def send_daily_alerts():
    """Función principal para enviar alertas diarias"""
    print(f"Iniciando alertas diarias - {datetime.now()}")
    
    # Inicializar servicios
    scraper = UTNScraper()
    whatsapp = WhatsAppService()
    
    # Obtener credenciales
    username = os.getenv('UTN_USERNAME')
    password = os.getenv('UTN_PASSWORD')
    
    if not username or not password:
        print("Error: Credenciales no configuradas")
        return False
    
    try:
        # Intentar cargar sesión existente
        if not scraper.load_session() or not scraper.is_logged_in():
            print("Realizando login...")
            if not scraper.login(username, password):
                print("Error: No se pudo hacer login")
                return False
        
        print("Sesión activa, obteniendo datos...")
        
        # Obtener datos
        schedule = scraper.get_daily_schedule()
        activities = scraper.get_pending_activities()
        
        # Formatear y enviar mensajes
        if schedule:
            schedule_msg = whatsapp.format_daily_schedule(schedule)
            whatsapp.send_message(schedule_msg)
            print("Horario enviado")
        
        if activities:
            activities_msg = whatsapp.format_pending_activities(activities)
            whatsapp.send_message(activities_msg)
            print("Actividades pendientes enviadas")
        
        if not schedule and not activities:
            whatsapp.send_message("📱 Sistema UTN revisado - Sin novedades para hoy")
        
        return True
        
    except Exception as e:
        print(f"Error en alertas diarias: {e}")
        return False

if __name__ == "__main__":
    send_daily_alerts()