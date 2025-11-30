# notifications-comms-service

Microservice para envío de notificaciones via email, SMS y webhooks. Proporciona interfaz unificada de notificaciones con retry logic y tracking de entrega.

## ✅ Completado

- **Email service con Nodemailer**:
  - Soporte para SMTP configurable
  - Plantillas HTML
  - Envío en bulk
- **SMS service con Twilio**:
  - Envío de SMS individual y en bulk
  - Integración con Twilio API
- **Webhook management**:
  - Registro de webhooks
  - Entrega confiable con exponential backoff (3 reintentos)
  - Listado y eliminación de webhooks
  - Payload tracking
- **9 tests pasando**: health, email, SMS, webhooks CRUD, entrega, validación
- **Backend CI workflow**: incluido `.github/workflows/backend-ci.yml`

## Stack

- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.2
- **Framework**: Express 4.18
- **Email**: Nodemailer 6.9
- **SMS**: Twilio 4.0
- **HTTP**: axios 1.6
- **Testing**: Jest 29.6 + supertest 7.1

## Features

- Email delivery via SMTP (Nodemailer)
- SMS delivery via Twilio
- Webhook registration and delivery con exponential backoff retry
- Bulk notification support (email y SMS)
- Health checks
- Validation de inputs

## Quick Start

```bash
cd notifications-comms-service
npm install
npm run dev        # puerto 3004
```

## Run Tests

```bash
npm test           # 9 tests passing
```

## Environment Variables

- `PORT`: Puerto del servicio (default: 3004)
- `SMTP_HOST`: Host SMTP (default: smtp.mailtrap.io)
- `SMTP_PORT`: Puerto SMTP (default: 2525)
- `SMTP_USER`: Usuario SMTP
- `SMTP_PASSWORD`: Contraseña SMTP
- `EMAIL_FROM`: Email del remitente (default: noreply@ticketing-system.com)
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Número de teléfono Twilio

## Endpoints

- `GET /health` - Health check
- `POST /notifications/email` - Enviar email
  - Body: `{ to: string, subject: string, text: string, html?: string }`
- `POST /notifications/sms` - Enviar SMS
  - Body: `{ to: string, message: string }`
- `POST /notifications/webhooks` - Registrar webhook
  - Body: `{ url: string, events: string[] }`
- `GET /notifications/webhooks` - Listar webhooks
- `POST /notifications/webhooks/deliver` - Entregar webhook
  - Body: `{ event: string, payload: object }`
- `DELETE /notifications/webhooks/:id` - Eliminar webhook

## Ejemplo de uso

```bash
# Enviar email
curl -X POST http://localhost:3004/notifications/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Bienvenido",
    "text": "Gracias por registrarte"
  }'

# Registrar webhook
curl -X POST http://localhost:3004/notifications/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://your-server.com/webhook",
    "events": ["ticket.created", "ticket.sold"]
  }'

# Entregar webhook
curl -X POST http://localhost:3004/notifications/webhooks/deliver \
  -H "Content-Type: application/json" \
  -d '{
    "event": "ticket.created",
    "payload": {"ticketId": "123", "owner": "alice"}
  }'

# Listar webhooks
curl http://localhost:3004/notifications/webhooks
```

## Webhook Retry Logic

Los webhooks se reintenta automáticamente con backoff exponencial:

```
Intento 1: Inmediato
Intento 2: +200ms (2^2 * 100ms)
Intento 3: +400ms (2^3 * 100ms)
```

## Build & Deploy

```bash
npm run build      # compila TypeScript a dist/
npm start          # ejecuta dist/index.js
```

## Docker

```bash
docker build -t notifications-comms-service .
docker run -p 3004:3004 notifications-comms-service
```

## Próximos pasos

- Message queue (RabbitMQ/Redis) para async processing
- Email templates engine (Handlebars/Liquid)
- Push notifications (Firebase/OneSignal)
- Webhooks signing (HMAC)
- Event sourcing y event replay
- Analytics y delivery metrics
