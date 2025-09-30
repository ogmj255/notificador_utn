from twilio.rest import Client

account_sid = 'ACf4ea1b96456fc01f6d39b55bcbe42adc'
auth_token = 'TU_AUTH_TOKEN_REAL_AQUI'  # Reemplazar con el token real
client = Client(account_sid, auth_token)

message = client.messages.create(
    from_='whatsapp:+14155238886',
    body='Prueba simple - Hola Omar!',  # Mensaje simple, no template
    to='whatsapp:+593985051676'
)

print(f"Mensaje enviado: {message.sid}")