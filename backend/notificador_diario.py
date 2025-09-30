from horario import obtener_horario_hoy
from whatsapp_simple import WhatsAppNotifier

def enviar_notificacion_diaria():
    horario_hoy, dia = obtener_horario_hoy()
    notificador = WhatsAppNotifier()
    return notificador.enviar_horario(horario_hoy, dia)

if __name__ == "__main__":
    enviar_notificacion_diaria()