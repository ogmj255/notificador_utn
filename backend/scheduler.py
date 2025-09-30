import schedule
import time
from daily_scraper import send_daily_alerts

def run_scheduler():
    """Ejecuta el programador de alertas"""
    print("Iniciando programador de alertas...")
    
    # Programar alertas diarias a las 7:00 AM
    schedule.every().day.at("07:00").do(send_daily_alerts)
    
    # Programar recordatorio a las 6:00 PM
    schedule.every().day.at("18:00").do(send_evening_reminder)
    
    print("Alertas programadas:")
    print("- 07:00 AM: Horario del día")
    print("- 06:00 PM: Recordatorio actividades")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Verificar cada minuto

def send_evening_reminder():
    """Envía recordatorio vespertino"""
    from scrapers.utn_scraper import UTNScraper
    from services.whatsapp_service import WhatsAppService
    import os
    
    scraper = UTNScraper()
    whatsapp = WhatsAppService()
    
    username = os.getenv('UTN_USERNAME')
    password = os.getenv('UTN_PASSWORD')
    
    if scraper.login(username, password):
        activities = scraper.get_pending_activities()
        if activities:
            msg = "🌅 Recordatorio vespertino:\n\n"
            msg += whatsapp.format_pending_activities(activities)
            whatsapp.send_message(msg)

if __name__ == "__main__":
    run_scheduler()