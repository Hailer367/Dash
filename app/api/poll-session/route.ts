import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/dash-store';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || '';
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  const s = await getSession(id);
  if (!s) return NextResponse.json({ error: 'not found' }, { status: 404 });
  if (s.status === 'pending') return NextResponse.json({ status: 'pending' });
  if (s.status === 'pass') return NextResponse.json({ status: 'pass', redirectUrl: s.redirectUrl });
  return NextResponse.json({ status: 'notpass' });
}
