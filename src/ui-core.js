/* PITCH! shared UI helpers: HTML escaping, DOM morphing, timers, drawing pad, sounds, storage. */
(function (P) {
  const U = (P.ui = {});

  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.money = (n) => '$' + (Math.round((Number(n) || 0) * 100) / 100).toFixed(2).replace(/\.00$/, '');
  U.money2 = (n) => '$' + (Number(n) || 0).toFixed(2);
  U.initials = (name) => String(name || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  U.avatar = (p, size) => '<span class="av' + (size ? ' av-' + size : '') + '" style="--c:' + U.esc(p.color) + '">' + U.esc(U.initials(p.name)) + '</span>';
  U.fmtTime = (ms) => { const s = Math.ceil(Math.max(0, ms) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  U.roleName = (r) => P.engine.ROLE_NAMES[r] || '';

  // ---------- safe storage ----------
  U.store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  /** This device's saved player profile (rulebook section 12): wallet, inventory, invention collection. */
  U.profile = {
    load() {
      const p = U.store.get('pitch.profile', null) || {};
      return {
        id: p.id || 'p' + P.net.randomId(10),
        name: p.name || '',
        prefs: p.prefs || { peddler: true, prospect: true, phil: true },
        wallet: p.wallet || { career: 0, cash: 0, inventory: { notToday: 0, knowPeople: 0, daddy: 0 } },
        inventions: p.inventions || []
      };
    },
    save(p) {
      if (!U.store.set('pitch.profile', p) && p.inventions.length) {
        // storage full: drop drawings from older inventions and try again
        p.inventions.forEach((x, i) => { if (i < p.inventions.length - 3) x.image = null; });
        U.store.set('pitch.profile', p);
      }
    }
  };

  // ---------- DOM morphing: update the page without destroying inputs, canvases or animations ----------
  const keyOf = (n) => (n.nodeType === 1 ? n.getAttribute('data-key') : null);
  function morphNode(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b.cloneNode(true)); return; }
    if (a.nodeType === 3 || a.nodeType === 8) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
    if (a.nodeType !== 1) return;
    const keep = b.getAttribute('data-keep');
    if (keep && a.getAttribute('data-keep') === keep) { syncAttrs(a, b, true); return; }
    syncAttrs(a, b, false);
    const tag = a.nodeName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      if (document.activeElement !== a) {
        if (a.type === 'checkbox' || a.type === 'radio') a.checked = b.hasAttribute('checked');
        else if (tag === 'TEXTAREA') { if (a.value !== b.textContent) a.value = b.textContent; }
        else if (tag === 'SELECT') { morphChildren(a, b); const sel = b.querySelector('option[selected]'); if (sel) a.value = sel.value; }
        else { const v = b.getAttribute('value') || ''; if (a.value !== v) a.value = v; }
      }
      if (tag !== 'SELECT') return;
      return;
    }
    morphChildren(a, b);
  }
  function syncAttrs(a, b, keepOnly) {
    if (keepOnly) { ['class', 'style'].forEach((n) => { const v = b.getAttribute(n); if (v == null) a.removeAttribute(n); else if (a.getAttribute(n) !== v) a.setAttribute(n, v); }); return; }
    for (let i = a.attributes.length - 1; i >= 0; i--) { const n = a.attributes[i].name; if (!b.hasAttribute(n)) a.removeAttribute(n); }
    for (let i = 0; i < b.attributes.length; i++) { const at = b.attributes[i]; if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value); }
  }
  function morphChildren(a, b) {
    const bKids = Array.from(b.childNodes);
    for (let i = 0; i < bKids.length; i++) {
      const bk = bKids[i];
      const cur = a.childNodes[i];
      const key = keyOf(bk);
      if (!cur) { a.appendChild(bk.cloneNode(true)); continue; }
      if (key) {
        if (keyOf(cur) === key) { morphNode(cur, bk); continue; }
        let match = null;
        for (let j = i + 1; j < a.childNodes.length; j++) if (keyOf(a.childNodes[j]) === key) { match = a.childNodes[j]; break; }
        if (match) { a.insertBefore(match, cur); morphNode(match, bk); } else a.insertBefore(bk.cloneNode(true), cur);
      } else if (keyOf(cur)) a.insertBefore(bk.cloneNode(true), cur);
      else morphNode(cur, bk);
    }
    while (a.childNodes.length > bKids.length) a.removeChild(a.lastChild);
  }
  const tpl = document.createElement('template');
  U.morph = function (root, html) {
    tpl.innerHTML = html;
    morphChildren(root, tpl.content);
  };

  // ---------- live countdowns ----------
  /** Timer markup: the number counts down locally between updates. */
  U.timerAttrs = (t, recvAt) => t ? ' data-timer="1" data-rem="' + Math.round(t.remaining) + '" data-run="' + (t.running ? 1 : 0) + '" data-recv="' + recvAt + '" data-total="' + t.total + '"' : '';
  U.timerNow = (el) => {
    const rem = Number(el.getAttribute('data-rem')), run = el.getAttribute('data-run') === '1';
    return run ? Math.max(0, rem - (Date.now() - Number(el.getAttribute('data-recv')))) : rem;
  };
  let lastBeep = 0;
  U.startTimerLoop = function (opts) {
    setInterval(() => {
      document.querySelectorAll('[data-timer]').forEach((el) => {
        const ms = U.timerNow(el);
        const total = Number(el.getAttribute('data-total')) || 1;
        const txt = el.querySelector('.t-num');
        if (txt) { const s = U.fmtTime(ms); if (txt.textContent !== s) txt.textContent = s; }
        el.style.setProperty('--p', Math.max(0, Math.min(1, ms / total)).toFixed(4));
        el.classList.toggle('t-low', ms <= 10000 && el.getAttribute('data-run') === '1');
        el.classList.toggle('t-paused', el.getAttribute('data-run') !== '1');
        if (opts && opts.beep && el.hasAttribute('data-beep') && el.getAttribute('data-run') === '1' && ms > 0 && ms <= 5000) {
          const sec = Math.ceil(ms / 1000);
          if (sec !== lastBeep) { lastBeep = sec; U.sound('tick'); }
        }
      });
    }, 200);
  };
  U.timerHTML = (t, recvAt, cls, beep) => t
    ? '<div class="timer ' + (cls || '') + '"' + U.timerAttrs(t, recvAt) + (beep ? ' data-beep="1"' : '') + '><span class="t-ring"></span><span class="t-num">' + U.fmtTime(t.remaining) + '</span></div>'
    : '';

  // ---------- sound (tiny synth, no files) ----------
  let actx = null;
  U.muted = U.store.get('pitch.muted', false);
  U.unlockAudio = () => { try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { /* no audio */ } };
  U.sound = function (kind) {
    if (U.muted || !actx) return;
    const notes = {
      tick: [[880, 0.05]], start: [[523, 0.1], [659, 0.1], [784, 0.18]], buzz: [[140, 0.35, 'sawtooth'], [110, 0.35, 'sawtooth']],
      ding: [[1047, 0.12], [1319, 0.25]], cash: [[784, 0.08], [988, 0.08], [1175, 0.08], [1568, 0.3]], join: [[660, 0.08], [880, 0.12]],
      time: [[392, 0.2, 'square'], [262, 0.4, 'square']]
    }[kind];
    if (!notes) return;
    let t = actx.currentTime;
    notes.forEach(([f, d, type]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
      t += d * 0.9;
    });
  };
  U.vibrate = (ms) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* ignore */ } };
  U.keepAwake = async () => { try { if (navigator.wakeLock) U.wake = await navigator.wakeLock.request('screen'); } catch (e) { /* optional */ } };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && U.wake) U.keepAwake(); });

  // ---------- toasts ----------
  U.toast = function (text, kind) {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = text;
    box.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, kind === 'big' ? 5200 : 3200);
  };

  // ---------- QR code (optional library from cdnjs; falls back to text) ----------
  U.qr = function (text) {
    try {
      if (!window.qrcode) return '';
      const q = window.qrcode(0, 'M'); q.addData(text); q.make();
      return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
    } catch (e) { return ''; }
  };

  // ---------- drawing pad ----------
  const INKS = ['#1B2138', '#EF4B3F', '#2B8FD6', '#2FA35B', '#F2A93B', '#8E5BD8', '#ffffff'];
  class DrawPad {
    constructor(opts) {
      this.opts = opts || {};
      this.strokes = [];
      this.color = INKS[0];
      this.size = 6;
      this.el = document.createElement('div');
      this.el.className = 'pad';
      this.canvas = document.createElement('canvas');
      this.canvas.width = 800; this.canvas.height = 600;
      this.canvas.setAttribute('aria-label', 'Drawing area');
      this.ctx = this.canvas.getContext('2d');
      const tools = document.createElement('div');
      tools.className = 'pad-tools';
      INKS.forEach((c) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ink' + (c === this.color ? ' on' : ''); b.style.setProperty('--pen', c);
        b.setAttribute('aria-label', c === '#ffffff' ? 'Eraser (white)' : 'Color ' + c);
        b.onclick = () => { this.color = c; tools.querySelectorAll('.ink').forEach((x) => x.classList.toggle('on', x === b)); };
        tools.appendChild(b);
      });
      const mk = (label, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'pad-btn ' + (cls || ''); b.textContent = label; b.onclick = fn; tools.appendChild(b); return b; };
      const sizeName = { 3: 'Fine', 6: 'Medium', 14: 'Thick' };
      this.sizeBtn = mk('Medium', () => { this.size = this.size === 6 ? 14 : this.size === 14 ? 3 : 6; this.sizeBtn.textContent = sizeName[this.size]; });
      mk('Undo', () => { this.strokes.pop(); this.redraw(); this.changed(); });
      mk('Clear', () => { this.strokes = []; this.redraw(); this.changed(); });
      this.el.appendChild(this.canvas);
      this.el.appendChild(tools);
      this.redraw();
      let cur = null;
      const pos = (e) => { const r = this.canvas.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 800, ((e.clientY - r.top) / r.height) * 600]; };
      this.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault(); this.canvas.setPointerCapture(e.pointerId);
        cur = { c: this.color, s: this.size, pts: [pos(e)] }; this.strokes.push(cur); this.redraw();
      });
      this.canvas.addEventListener('pointermove', (e) => { if (!cur) return; e.preventDefault(); cur.pts.push(pos(e)); this.drawStroke(cur, true); });
      const end = () => { if (cur) { cur = null; this.changed(); } };
      this.canvas.addEventListener('pointerup', end);
      this.canvas.addEventListener('pointercancel', end);
      this.canvas.style.touchAction = 'none';
    }
    changed() { this.dirty = true; if (this.opts.onChange) this.opts.onChange(this); }
    drawStroke(st, lastOnly) {
      const c = this.ctx, p = st.pts;
      c.strokeStyle = st.c; c.lineWidth = st.s * 1.6; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath();
      if (lastOnly && p.length > 1) { c.moveTo(p[p.length - 2][0], p[p.length - 2][1]); c.lineTo(p[p.length - 1][0], p[p.length - 1][1]); }
      else { c.moveTo(p[0][0], p[0][1]); if (p.length === 1) c.lineTo(p[0][0] + 0.1, p[0][1]); p.forEach((q) => c.lineTo(q[0], q[1])); }
      c.stroke();
    }
    redraw() {
      const c = this.ctx;
      c.fillStyle = '#ffffff'; c.fillRect(0, 0, 800, 600);
      this.strokes.forEach((s) => this.drawStroke(s, false));
    }
    isEmpty() { return this.strokes.length === 0; }
    /** Small image for sending: 400x300 PNG (JPEG if the PNG is large). */
    export() {
      const out = document.createElement('canvas');
      out.width = 400; out.height = 300;
      out.getContext('2d').drawImage(this.canvas, 0, 0, 400, 300);
      let d = out.toDataURL('image/png');
      if (d.length > 110000) d = out.toDataURL('image/jpeg', 0.75);
      return d;
    }
    /** Random doodle, used by practice bots. */
    scribble(seed) {
      const r = () => Math.random();
      for (let k = 0; k < 5 + Math.floor(r() * 5); k++) {
        const st = { c: INKS[Math.floor(r() * 6)], s: 4 + Math.floor(r() * 8), pts: [] };
        let x = 100 + r() * 600, y = 100 + r() * 400;
        for (let i = 0; i < 25; i++) { x += (r() - 0.5) * 90; y += (r() - 0.5) * 90; st.pts.push([Math.max(10, Math.min(790, x)), Math.max(10, Math.min(590, y))]); }
        this.strokes.push(st);
      }
      this.redraw();
    }
  }
  U.DrawPad = DrawPad;
})(window.PITCH = window.PITCH || {});
