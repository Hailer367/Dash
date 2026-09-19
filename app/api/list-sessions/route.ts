import { NextResponse } from 'next/server';
import { listSessions } from '@/lib/dash-store';

export async function GET() {
  const sessions = await listSessions(20);
  return NextResponse.json({ sessions });
}
