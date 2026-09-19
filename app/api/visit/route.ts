import { NextRequest, NextResponse } from 'next/server';

// POST /api/visit { siteId, page } -> Telegram message.
// Configure in Vercel: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// Without them this is a silent no-op (local dev keeps working).

const NAMES: Record<string, string> = {
  'commercial-cbe': 'CBE bank portal (/cbe)',
  'telebirr-portal': 'telebirr portal (/telebirr)'
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const siteId = String(body.siteId || 'unknown').slice(0, 64);
  const page = String(body.page || 'visit').slice(0, 128);
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '';
  if (!token || !chatId) return NextResponse.json({ ok: true, notified: false });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'n/a';
  const ua = (req.headers.get('user-agent') || 'n/a').slice(0, 160);
  const label = NAMES[siteId] || siteId;
  const text =
    `👁 Visitor on ${label}\n` +
    `Page: ${page}\n` +
    `Time: ${new Date().toISOString()}\n` +
    `IP: ${ip}\n` +
    `UA: ${ua}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const j = await r.json().catch(() => null);
    return NextResponse.json({ ok: true, notified: Boolean(j && j.ok) });
  } catch {
    return NextResponse.json({ ok: true, notified: false });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
