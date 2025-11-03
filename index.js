import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY || '';
const OWNER_PHONE = (process.env.OWNER_PHONE || '').replace(/\D/g, '');

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function toE164(noDigits) {
  // Norway country code +47
  if (!noDigits) return null;
  if (noDigits.startsWith('+')) return noDigits;
  const cleaned = noDigits.replace(/\D/g, '');
  if (cleaned.startsWith('47')) return `+${cleaned}`;
  return `+47${cleaned}`;
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/notify-order', async (req, res) => {
  try {
    if (API_KEY && req.headers['x-api-key'] !== API_KEY) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const { items, total, currency = 'NOK', channel = 'web', customer = {} } = req.body || {};
    if (!Array.isArray(items) || typeof total !== 'number') {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }
    if (!OWNER_PHONE) {
      return res.status(500).json({ ok: false, error: 'OWNER_PHONE not set' });
    }

    const lines = items.map(i => `${i.name} x${i.qty} – ${i.unitTotal}`).join('\n');
    const msg = [
      'New Jhumka order',
      lines,
      `Total: ${total.toLocaleString('no-NO')} ${currency}`,
      `Channel: ${channel}`,
      customer?.phone ? `Customer phone: ${customer.phone}` : null,
      customer?.note ? `Note: ${customer.note}` : null,
    ].filter(Boolean).join('\n');

    let result = { sent: false };
    if (twilioClient && process.env.TWILIO_FROM) {
      const to = toE164(OWNER_PHONE);
      const from = process.env.TWILIO_FROM;
      const sms = await twilioClient.messages.create({ to, from, body: msg });
      result = { sent: true, sid: sms.sid };
    } else {
      console.log('[notify-order] (dry-run)\n' + msg);
    }

    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Jhumka server listening on http://localhost:${PORT}`);
});
