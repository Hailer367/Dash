import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/dash-store';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const session = await createSession({
    siteId: body.siteId,
    page: body.page,
    meta: body.meta || {},
    redirectHint: body.redirectHint,
    ip: req.headers.get('x-forwarded-for') || '',
    ua: req.headers.get('user-agent') || ''
  });
  return NextResponse.json({ id: session.id, status: session.status });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
