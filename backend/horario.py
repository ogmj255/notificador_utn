HORARIO_SEMANAL = {
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