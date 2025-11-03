# The Jhumka Luxury – Backend

A tiny Node/Express server to:

- Send you an SMS with the customer's order (Twilio)
- Prepare for a future Vipps Checkout integration

## Prerequisites

- Node.js 18+
- A Twilio account (or comment out SMS sending to run in dry-run mode)

## Setup

1. Copy env template and edit values:

```powershell
Copy-Item .env.example .env
notepad .env
```

Required values:

- OWNER_PHONE: Your phone number to receive SMS (e.g. 45898908)
- TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM (E.164 format like +47XXXXXXXX)
- API_KEY: Any string; the front-end will send it as `x-api-key`

2. Install and run:

```powershell
cd server
npm install
npm run dev
```

The server runs on http://localhost:3001.

## API

POST /api/notify-order

Body:

```json
{
  "items": [{ "name": "Classic Jhumka", "qty": 2, "unitTotal": "kr 99,-" }],
  "total": 198,
  "currency": "NOK",
  "channel": "vipps|sms|web",
  "customer": { "phone": "+47...", "note": "optional" }
}
```

Headers:

- `Content-Type: application/json`
- `x-api-key: <your API_KEY>`

Response: `{ ok: true }` or an error with HTTP status.

## Notes

- If Twilio env vars are missing, the server will log the SMS instead of sending (dry-run).
- Vipps integration requires merchant credentials and is not included here, but this server is a good starting point to add a `/api/vipps/create-payment` endpoint later.
