HORARIO_SEMANAL = {
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

def obtener_horario_hoy():
    from datetime import datetime
    dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
    hoy = datetime.now().weekday()
    dia_nombre = dias[hoy]
    return HORARIO_SEMANAL.get(dia_nombre, []), dia_nombre