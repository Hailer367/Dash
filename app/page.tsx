export default function Home() {
  return (
    <main
      style={{
        fontFamily: 'system-ui,sans-serif',
        maxWidth: 640,
        margin: '80px auto',
        padding: 24,
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'linear-gradient(135deg,#38bdf8,#6366f1)',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
          color: '#fff',
          fontSize: 24,
          margin: '0 auto 16px'
        }}
      >
        D
      </div>
      <h1>Dash — one deployment</h1>
      <p style={{ color: '#555' }}>
        Type the path manually, just like <code>tea.com/login</code>:
      </p>
      <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2.2 }}>
        <li>
          <a href="/dash">
            <code>/dash</code>
          </a>{' '}
          — operator dashboard (Pass / Not Pass)
        </li>
        <li>
          <a href="/cbe">
            <code>/cbe</code>
          </a>{' '}
          — CBE commercial bank portal
        </li>
        <li>
          <a href="/telebirr">
            <code>/telebirr</code>
          </a>{' '}
          — telebirr / Ethio Telecom portal
        </li>
      </ul>
      <p style={{ color: '#777', fontSize: 13 }}>
        Same domain, same Vercel project. Example: <code>your-app.vercel.app/cbe</code>,{' '}
        <code>your-app.vercel.app/telebirr</code>, <code>your-app.vercel.app/dash</code>.
      </p>
    </main>
  );
}
