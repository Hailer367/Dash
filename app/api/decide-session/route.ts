import { NextRequest, NextResponse } from 'next/server';
import { decideSession } from '@/lib/dash-store';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const s = await decideSession(body.id, body.decision);
  if (!s) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true, status: s.status });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
