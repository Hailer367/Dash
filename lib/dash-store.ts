import fs from 'fs';
import path from 'path';

export type SessionStatus = 'pending' | 'pass' | 'notpass';

export interface DashSession {
  id: string;
  siteId: string;
  siteName: string;
  page: string;
  meta: Record<string, unknown>;
  redirectUrl: string;
  status: SessionStatus;
  createdAt: number;
  decidedAt: number | null;
  ip: string;
  ua: string;
}

function loadSitesConfig(): { sites: { id: string; name: string; passRedirect?: string }[] } {
  try {
    const p = path.join(process.cwd(), 'sites.config.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { sites: [] };
  }
}

function genId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

const g = globalThis as unknown as { __DASH_SESSIONS?: Map<string, DashSession> };
if (!g.__DASH_SESSIONS) g.__DASH_SESSIONS = new Map();
const mem = g.__DASH_SESSIONS!;

function useRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisCall(command: string, ...args: (string | number)[]): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command, ...args])
  });
  const data = await res.json();
  return data.result;
}

function inflate(o: Record<string, string>): DashSession {
  let meta: Record<string, unknown> = {};
  try {
    meta = o.meta ? JSON.parse(o.meta) : {};
  } catch {
    meta = {};
  }
  return {
    id: o.id,
    siteId: o.siteId,
    siteName: o.siteName,
    page: o.page,
    meta,
    redirectUrl: o.redirectUrl,
    status: (o.status as SessionStatus) || 'pending',
    createdAt: Number(o.createdAt) || Date.now(),
    decidedAt: o.decidedAt ? Number(o.decidedAt) : null,
    ip: o.ip || '',
    ua: o.ua || ''
  };
}

function deflate(s: DashSession): Record<string, string> {
  return {
    id: s.id,
    siteId: s.siteId,
    siteName: s.siteName,
    page: s.page,
    meta: JSON.stringify(s.meta || {}),
    redirectUrl: s.redirectUrl,
    status: s.status,
    createdAt: String(s.createdAt),
    decidedAt: s.decidedAt ? String(s.decidedAt) : '',
    ip: s.ip,
    ua: s.ua
  };
}

async function redisHSet(s: DashSession): Promise<void> {
  const flat = deflate(s);
  await redisCall('HSET', `dash:session:${s.id}`, ...Object.entries(flat).flat());
  await redisCall('EXPIRE', `dash:session:${s.id}`, 3600);
  await redisCall('ZADD', 'dash:sessions', Date.now(), s.id);
  // Keep only the 20 newest sessions.
  await redisCall('ZREMRANGEBYRANK', 'dash:sessions', 0, -(MAX_SESSIONS + 1));
}

async function redisHGet(id: string): Promise<DashSession | null> {
  const flat: string[] | null = await redisCall('HGETALL', `dash:session:${id}`);
  if (!flat || flat.length === 0) return null;
  const o: Record<string, string> = {};
  for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1];
  return inflate(o);
}

const MAX_SESSIONS = 20;

function pruneMemory(): void {
  const now = Date.now();
  for (const [k, v] of mem.entries()) {
    if (now - v.createdAt > 3 * 3600 * 1000) mem.delete(k);
  }
  // Keep only the 20 newest sessions.
  if (mem.size > MAX_SESSIONS) {
    const ids = [...mem.entries()]
      .sort((a, b) => b[1].createdAt - a[1].createdAt)
      .slice(MAX_SESSIONS)
      .map(([id]) => id);
    ids.forEach((id) => mem.delete(id));
  }
}

export async function createSession(args: {
  siteId?: string;
  page?: string;
  meta?: Record<string, unknown>;
  redirectHint?: string;
  ip?: string;
  ua?: string;
}): Promise<DashSession> {
  const cfg = loadSitesConfig();
  const site = (cfg.sites || []).find((s) => s.id === args.siteId);
  const session: DashSession = {
    id: genId(),
    siteId: String(args.siteId || 'unknown').slice(0, 64),
    siteName: site ? site.name : String(args.siteId || 'unknown'),
    page: String(args.page || '').slice(0, 256),
    meta: args.meta && typeof args.meta === 'object' ? args.meta : {},
    redirectUrl: String(args.redirectHint || (site?.passRedirect ?? '/')).slice(0, 512),
    status: 'pending',
    createdAt: Date.now(),
    decidedAt: null,
    ip: args.ip || '',
    ua: args.ua || ''
  };
  if (useRedis()) await redisHSet(session);
  else {
    pruneMemory();
    mem.set(session.id, session);
  }
  return session;
}

export async function getSession(id: string): Promise<DashSession | null> {
  if (useRedis()) return redisHGet(id);
  return mem.get(id) || null;
}

export async function decideSession(id: string, decision: string): Promise<DashSession | null> {
  const d: SessionStatus = decision === 'pass' ? 'pass' : 'notpass';
  if (useRedis()) {
    const s = await redisHGet(id);
    if (!s) return null;
    s.status = d;
    s.decidedAt = Date.now();
    await redisHSet(s);
    return s;
  }
  const s = mem.get(id);
  if (!s) return null;
  s.status = d;
  s.decidedAt = Date.now();
  mem.set(id, s);
  return s;
}

export async function listSessions(limit = MAX_SESSIONS): Promise<DashSession[]> {
  if (useRedis()) {
    const ids: string[] = (await redisCall('ZREVRANGE', 'dash:sessions', 0, limit - 1)) || [];
    const out: DashSession[] = [];
    for (const id of ids) {
      const s = await redisHGet(id);
      if (s) out.push(s);
    }
    return out;
  }
  pruneMemory();
  return [...mem.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
}
