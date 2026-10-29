/* P!TCH app shell: home screen, hosting, joining, and practice mode. */
(function (P) {
  const U = P.ui, N = P.net, E = P.engine, C = P.content;
  const esc = U.esc;
  const root = document.getElementById('app');
  let cleanup = null;

  function reset(cls) {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    root.className = cls || '';
    root.onclick = null;
    root.innerHTML = '';
    window.scrollTo(0, 0);
    const view = document.createElement('div');
    view.className = 'view';
    root.appendChild(view);
    return view;
  }
  const onlineAllowed = () => !P.config.artifact;
  function siteUrl() {
    if (P.config.artifact || location.protocol === 'file:') return P.config.pagesUrl;
    return location.origin + location.pathname;
  }

  // ---------------------------------------------------------------- home
  function home() {
    reset('home-mode');
    const saved = U.store.get('pitch.host', null);
    const canResume = onlineAllowed() && saved && saved.state && Date.now() - (saved.savedAt || 0) < 12 * 3600e3 && saved.state.phase !== 'final';
    const last = U.store.get('pitch.lastRoom', null);
    const canRejoin = onlineAllowed() && last && Date.now() - last.at < 4 * 3600e3;
    const hofCount = U.store.get('pitch.hof', []).length;
    root.innerHTML =
      '<div class="home"><header class="hero"><div class="eyebrow">The party game of impossible sales</div><h1 class="logo big">P<span>!</span>TCH</h1>' +
      '<p class="tagline">Do you have what it takes to sell the impossible, learn about your prospects, and survive their objections?</p>' +
      '<p class="meta">3–20+ players · 1 Peddler · 1–3 Prospects · everyone else: Philanthropists</p></header>' +
      '<div class="choices">' +
      (onlineAllowed()
        ? '<button class="choice c-host" data-go="host"><span class="c-k">On the TV or laptop</span><b>Host a game</b><span>Opens a room with a 4-letter code. This screen becomes the stage.</span></button>' +
          '<button class="choice c-join" data-go="join"><span class="c-k">On your phone</span><b>Join a game</b><span>Enter the code from the big screen.</span></button>'
        : '<div class="choice c-online"><span class="c-k">Play with friends</span><b>Open the game online</b><span>Phones can’t connect from inside this preview. Open the game link on your TV or laptop, and everyone joins from their phones:</span>' +
          '<code class="link">' + esc(P.config.pagesUrl) + '</code><a class="btn gold" href="' + esc(P.config.pagesUrl) + '" target="_blank" rel="noopener">Open the online game</a></div>') +
      '<button class="choice c-prac" data-go="practice"><span class="c-k">One screen</span><b>Practice mode</b><span>See the TV and every phone side by side. Bots can play the other seats.</span></button></div>' +
      (canResume ? '<div class="resume"><span>Your room <b>' + esc(saved.state.code) + '</b> is still open on this device.</span><button class="btn gold" data-go="resume">Resume hosting</button><button class="btn ghost" data-go="forget">Forget it</button></div>' : '') +
      (canRejoin ? '<div class="resume"><span>Rejoin room <b>' + esc(last.code) + '</b> as ' + esc(last.name) + '?</span><button class="btn gold" data-go="rejoin">Rejoin</button></div>' : '') +
      '<details class="howto"><summary>How to play</summary>' + howTo() + '</details>' +
      '<footer class="home-foot"><button class="btn ghost sm" data-go="hof">Hall of Fame (' + hofCount + ')</button><span class="muted">Official rules, Philanthropist Edition v4.0</span></footer></div>';
    root.onclick = (e) => {
      const b = e.target.closest('[data-go]');
      if (!b) return;
      U.unlockAudio();
      const go = b.dataset.go;
      if (go === 'host') startHost(null);
      else if (go === 'resume') startHost(saved);
      else if (go === 'forget') { U.store.del('pitch.host'); home(); }
      else if (go === 'join') joinScreen('');
      else if (go === 'rejoin') doJoin(last.code, last.name, U.profile.load().prefs);
      else if (go === 'practice') practiceSetup();
      else if (go === 'hof') hofScreen();
    };
  }

  function howTo() {
    return '<div class="howto-body"><div><h4>Roles</h4><ul><li><b>Peddler</b> invents a product from three cards, interviews the Prospects, pitches, and closes.</li>' +
      '<li><b>Prospects</b> (1–3) play fictional characters with a secret, draw a portrait, and each play one SCREW! card.</li>' +
      '<li><b>Philanthropists</b> (everyone else) score the Peddler with game money.</li></ul></div>' +
      '<div><h4>Each round</h4><ol><li>Creation Lab · 2:00</li><li>Fact-Finding · 2:30 · $25 per secret uncovered</li><li>PITCH! · 1:30 · each Prospect may SCREW! once (15 s, clock pauses, then the table votes)</li><li>Objections + Close · 0:45</li><li>Money Reveal</li></ol></div>' +
      '<div><h4>Money</h4><p>Each Philanthropist awards $0–$50 in six categories: Invention, Ingenuity, Fact-Finding, Overcoming Objections, Overall Pitch, The Close. ' +
      'The Peddler earns the average scorecard plus $25 per secret (with 4+ Philanthropists, a scorecard more than $100 away from the rest of the room is set aside). Prospects earn the average of up to $25 each for role-play. ' +
      '<b>Secret Sleuth:</b> during Fact-Finding, Philanthropists guess each Prospect’s secret from 4 options, $10 per correct guess. The Peddler can buy <b>INSIDE TRADING</b> to peek at a guess. Most money tonight wins.</p>' +
      '<p>Spend cash between rounds on NEPO BABY! Power Cards: NOT TODAY! ($75), I KNOW PEOPLE ($100), DADDY MADE A CALL ($125).</p></div></div>';
  }

  function hofScreen() {
    reset('home-mode');
    const list = U.store.get('pitch.hof', []);
    root.innerHTML = '<div class="home"><header class="hero small"><h1 class="logo">Hall of Fame</h1><p class="muted">Inventions and portraits players chose to feature, saved on this device.</p></header>' +
      (list.length ? '<div class="hof-grid">' + list.map((e) => '<div class="hof-card">' + (e.image ? '<img alt="' + esc(e.name) + '" src="' + e.image + '">' : '') + '<span class="eyebrow">' + (e.kind === 'invention' ? 'Invention' : 'Prospect') + '</span><b>' + esc(e.name) + '</b>' + (e.slogan ? '<em>“' + esc(e.slogan) + '”</em>' : '') + '<span class="muted">by ' + esc(e.creator) + ' · ' + U.money2(e.earned) + '</span></div>').join('') + '</div>'
        : '<p class="center muted">Nothing featured yet. After a round, the Peddler and Prospects can opt in from their phones.</p>') +
      '<div class="actions"><button class="btn gold" data-go="back">Back</button></div></div>';
    root.onclick = (e) => { if (e.target.closest('[data-go]')) home(); };
  }

  function statusScreen(title, text, retry) {
    reset('home-mode');
    root.innerHTML = '<div class="home status"><h1 class="logo">P<span>!</span>TCH</h1><h2>' + esc(title) + '</h2><p>' + esc(text || '') + '</p>' +
      (retry ? '<div class="actions"><button class="btn gold" data-go="retry">Try again</button><button class="btn ghost" data-go="home">Back</button></div>' : '<div class="spinner" aria-hidden="true"></div>') + '</div>';
    root.onclick = (e) => { const b = e.target.closest('[data-go]'); if (!b) return; if (b.dataset.go === 'retry') retry(); else home(); };
  }

  // ---------------------------------------------------------------- host
  async function startHost(saved) {
    statusScreen('Opening your room…', 'Connecting to the game server.');
    let code = saved ? saved.state.code : N.randomCode();
    const opts = () => ({ clientId: 'pH' + N.randomId(12), will: { topic: N.PREFIX + code + '/status', payload: 'offline', retain: true } });
    let client;
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        client = await N.connectHost(opts());
        if (saved) break;
        const taken = await new Promise((res) => {
          let hit = false;
          client.on('message', (t, p) => { if (t === N.PREFIX + code + '/status' && p === 'online') hit = true; });
          client.subscribe([N.PREFIX + code + '/status']);
          setTimeout(() => res(hit), 900);
        });
        if (!taken) break;
        client.end(); code = N.randomCode();
      }
    } catch (e) {
      statusScreen('Couldn’t reach the game server', 'Check this device’s internet connection, then try again. (Some work or school networks block it.)', () => startHost(saved));
      return;
    }
    const view = reset('host-mode');
    const game = saved ? new E.Game({ saved }) : new E.Game({ code });
    let saveTimer = null;
    const link = new N.HostLink(game, client, {
      reconnect: () => N.connectHost(opts()),
      save: (g) => { clearTimeout(saveTimer); saveTimer = setTimeout(() => { const d = g.serialize(); d.savedAt = Date.now(); U.store.set('pitch.host', d); }, 1500); }
    });
    const tv = P.tv.create(view, {
      game, joinUrl: siteUrl(),
      onExit: () => { link.close(); U.store.del('pitch.host'); home(); }
    });
    let raf = 0;
    link.onUpdate((m) => {
      if (m.connection) U.toast(m.connection === 'online' ? 'Back online' : 'Connection lost. Reconnecting…', m.connection === 'online' ? '' : 'warn');
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; tv.render(); });
    });
    link.start();
    tv.render();
    U.keepAwake();
    const unload = () => { /* keep retained state so a refresh can resume */ };
    window.addEventListener('beforeunload', unload);
    cleanup = () => { window.removeEventListener('beforeunload', unload); };
  }

  // ---------------------------------------------------------------- join
  function joinScreen(code, err) {
    reset('phone-mode');
    const prof = U.profile.load();
    root.innerHTML = '<div class="phone join"><header class="ph-top"><span class="logo">P<span>!</span>TCH</span></header><main class="ph-body"><section>' +
      '<h2>Join a game</h2><form id="joinForm" novalidate>' +
      '<label class="field"><span>Room code</span><input id="j-code" class="code-input" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD" value="' + esc(code || '') + '"></label>' +
      '<label class="field"><span>Your name</span><input id="j-name" maxlength="16" autocomplete="nickname" placeholder="Name" value="' + esc(prof.name) + '"></label>' +
      '<fieldset class="prefs"><legend>Roles I’m up for</legend>' + E.ROLES.map((r) => '<label class="set-row toggle"><span>' + U.roleName(r) + '</span><input type="checkbox" id="j-' + r + '"' + (prof.prefs[r] ? ' checked' : '') + '></label>').join('') + '</fieldset>' +
      (err ? '<p class="err">' + esc(err) + '</p>' : '') +
      '<button class="btn gold big" type="submit">Join</button></form>' +
      (prof.wallet.cash > 0 ? '<p class="muted center">Your saved cash: <b>' + U.money2(prof.wallet.cash) + '</b></p>' : '') +
      '</section><button class="btn ghost" id="j-back" type="button">Back</button></main></div>';
    const f = document.getElementById('joinForm');
    const ci = document.getElementById('j-code');
    ci.addEventListener('input', () => { ci.value = ci.value.toUpperCase().replace(/[^A-Z]/g, ''); });
    if (!code) ci.focus();
    document.getElementById('j-back').onclick = () => { history.replaceState(null, '', location.pathname); home(); };
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = ci.value.trim().toUpperCase(), name = document.getElementById('j-name').value.trim();
      if (c.length !== 4) return joinScreen(c, 'Room codes are 4 letters.');
      if (!name) return joinScreen(c, 'Enter your name.');
      const prefs = {}; E.ROLES.forEach((r) => { prefs[r] = document.getElementById('j-' + r).checked; });
      U.unlockAudio();
      doJoin(c, name, prefs);
    });
  }

  async function doJoin(code, name, prefs) {
    const prof = U.profile.load();
    prof.name = name; prof.prefs = prefs; U.profile.save(prof);
    statusScreen('Finding room ' + code + '…');
    const identKey = 'pitch.ident.' + code;
    const ident = U.store.get(identKey, null) || { pid: prof.id, token: N.randomId(16), seq: 0 };
    let client;
    try { client = await N.findRoom(code, 'pP' + N.randomId(10)); } catch (e) {
      joinScreen(code, 'Couldn’t find room ' + code + '. Check the code on the big screen (and your internet connection).');
      return;
    }
    U.store.set(identKey, ident);
    U.store.set('pitch.lastRoom', { code, name, at: Date.now() });
    const view = reset('phone-mode');
    let link;
    const phone = P.phone.create(view, {
      send: (a) => link.send(a), profile: prof,
      onProfile: (p) => U.profile.save(p),
      onLeave: () => { link.leave(); U.store.del('pitch.lastRoom'); home(); }
    });
    link = new N.PlayerLink(client, code, ident, {
      public: phone.public, private: (v) => { if (v.removed) U.store.del('pitch.lastRoom'); phone.private(v); }, asset: phone.asset, host: phone.host, connection: phone.connection,
      saveIdent: (i) => U.store.set(identKey, i),
      reconnect: () => N.findRoom(code, 'pP' + N.randomId(10))
    });
    link.start({ type: 'join', name, prefs, wallet: prof.wallet });
    phone.render();
    U.keepAwake();
    cleanup = () => link.leave();
  }

  // ---------------------------------------------------------------- practice
  // seat 0 is the person at the screen: their saved name, else a real name so sentences read naturally
  const PRACTICE_NAMES = ['Sam', 'Ava', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay', 'Gus', 'Hal', 'Ivy', 'Jo', 'Kai'];
  const nameSeat0 = () => { PRACTICE_NAMES[0] = U.profile.load().name.trim() || 'Sam'; };
  function practiceSetup() {
    nameSeat0();
    reset('home-mode');
    let n = U.store.get('pitch.practiceN', 5);
    const draw = () => {
      root.innerHTML = '<div class="home"><header class="hero small"><div class="eyebrow">Practice mode</div><h1 class="logo">P<span>!</span>TCH</h1><p class="tagline">The TV and every phone on one screen. Switch phones with the tabs. Bots play every seat except the phone you’re looking at.</p></header>' +
        '<section class="setup"><h3>How many players?</h3><div class="seg big-seg">' + [3, 4, 5, 6, 8, 10].map((k) => '<button data-n="' + k + '" class="' + (k === n ? 'on' : '') + '">' + k + '</button>').join('') + '</div>' +
        '<p class="muted">' + PRACTICE_NAMES.slice(0, n).join(', ') + '</p><div class="actions"><button class="btn ghost" data-go="back">Back</button><button class="btn gold big" data-go="start">Start practice</button></div></section></div>';
    };
    draw();
    root.onclick = (e) => {
      const b = e.target.closest('[data-n]');
      if (b) { n = Number(b.dataset.n); U.store.set('pitch.practiceN', n); draw(); return; }
      const g = e.target.closest('[data-go]');
      if (!g) return;
      if (g.dataset.go === 'back') home(); else startPractice(n);
    };
  }

  function startPractice(n) {
    nameSeat0();
    reset('practice-mode');
    root.onclick = null;
    root.innerHTML = '<div class="practice"><div class="pr-switch seg"><button data-view="tv" class="on">TV</button><button data-view="phone">Phones</button></div>' +
      '<div class="pr-tv" id="prTv"></div><aside class="pr-side"><div class="pr-tabs" id="prTabs"></div><label class="set-row toggle pr-bots"><span>Bots play the other seats</span><input type="checkbox" id="prBots" checked></label><div class="pr-phones" id="prPhones"></div></aside></div>';
    const broker = new N.MemoryBroker();
    const game = new E.Game({ code: 'PRAC' });
    const hostLink = new N.HostLink(game, broker.client());
    const tvEl = document.getElementById('prTv');
    const tv = P.tv.create(tvEl, { game, practice: true, onExit: () => home() });
    let raf = 0;
    hostLink.onUpdate(() => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tv.render(); }); });
    hostLink.start();
    const seats = [];
    const phonesEl = document.getElementById('prPhones');
    for (let i = 0; i < n; i++) {
      const el = document.createElement('div');
      el.className = 'pr-phone'; el.hidden = i !== 0;
      phonesEl.appendChild(el);
      const prof = { id: 'bot' + i, name: PRACTICE_NAMES[i], prefs: { peddler: true, prospect: true, phil: true }, wallet: { career: 0, cash: 0, inventory: { notToday: 0, knowPeople: 0, daddy: 0, insider: 0 } }, inventions: [] };
      const ident = { pid: 'seat' + i, token: 'seat' + i + N.randomId(6), seq: 0 };
      let link;
      const phone = P.phone.create(el, { send: (a) => link.send(a), profile: prof, onProfile: () => {}, onLeave: () => {}, practice: true });
      link = new N.PlayerLink(broker.client(), 'PRAC', ident, { public: phone.public, private: phone.private, asset: phone.asset });
      link.start({ type: 'join', name: PRACTICE_NAMES[i], prefs: prof.prefs, wallet: prof.wallet });
      seats.push({ el, phone, link, memo: {}, name: PRACTICE_NAMES[i] });
    }
    // in practice, nobody times out
    setTimeout(() => Object.values(game.s.players).forEach((p) => { p.bot = true; }), 300);
    let current = 0;
    const tabs = document.getElementById('prTabs');
    const drawTabs = () => {
      tabs.innerHTML = seats.map((s, i) => {
        const pv = s.phone.state.priv;
        return '<button class="pr-tab' + (i === current ? ' on' : '') + '" data-seat="' + i + '">' + (pv ? U.avatar(pv) : '') + '<span>' + esc(s.name) + '</span>' + (pv && pv.role ? '<i class="dot dot-' + pv.role + '"></i>' : '') + '</button>';
      }).join('');
    };
    tabs.onclick = (e) => {
      const b = e.target.closest('[data-seat]');
      if (!b) return;
      current = Number(b.dataset.seat);
      seats.forEach((s, i) => { s.el.hidden = i !== current; });
      seats[current].phone.render();
      drawTabs();
    };
    root.querySelector('.pr-switch').onclick = (e) => {
      const b = e.target.closest('[data-view]');
      if (!b) return;
      root.querySelector('.practice').setAttribute('data-view', b.dataset.view);
      root.querySelectorAll('.pr-switch button').forEach((x) => x.classList.toggle('on', x === b));
    };
    const botsBox = document.getElementById('prBots');
    const botTimer = setInterval(() => {
      drawTabs();
      if (!botsBox.checked) return;
      seats.forEach((s, i) => { if (i !== current) bot(s); });
    }, 1100);
    tv.render();
    cleanup = () => { clearInterval(botTimer); hostLink.close(); seats.forEach((s) => s.link.leave()); };
  }

  /** Simple practice bot: does something reasonable for its role in each phase. */
  function bot(seat) {
    const st = seat.phone.state, v = st.pub, p = st.priv, m = seat.memo;
    if (!v || !p || p.removed) return;
    const r = v.round, key = v.phase + (r ? r.n : '');
    const once = (k, fn) => { if (!m[key + k]) { m[key + k] = true; fn(); } };
    const send = (a) => seat.link.send(a);
    const rnd = (n) => Math.floor(Math.random() * n);
    const chance = (x) => Math.random() < x;
    if (v.phase === 'brief' && p.role && p.role !== 'sitout') {
      once('brief', () => setTimeout(() => send({ type: 'briefed' }), 800 + rnd(2500)));
    } else if (v.phase === 'lab' && p.role === 'peddler') {
      if (p.invention.item == null) {
        const it = rnd(3);
        send({ type: 'invention', item: it, func: rnd(3), name: 'The ' + p.hand.items[it] + ' ' + ['3000', 'Deluxe', 'Pro Max', '-inator', 'Supreme'][rnd(5)], slogan: ['You need this.', 'Why not?', 'Life, upgraded.', 'Patent pending.'][rnd(4)] });
      } else once('draw', () => { const pad = new U.DrawPad(); pad.scribble(); send({ type: 'drawing', data: pad.export() }); });
      if (p.invention.item != null && !p.labDone && chance(0.3)) send({ type: 'labDone' });
    } else if (v.phase === 'lab' && p.role === 'prospect') {
      once('draw', () => { const pad = new U.DrawPad(); pad.scribble(); send({ type: 'drawing', data: pad.export() }); });
      if (!p.labDone && chance(0.3)) send({ type: 'labDone' });
    } else if (v.phase === 'fact' && p.role === 'prospect') {
      if (p.secretStatus !== 'confirmed' && chance(0.004)) send({ type: 'secretAnswer', yes: true });
    } else if (v.phase === 'fact' && p.role === 'phil') {
      (p.sleuth || []).forEach((t) => { if (!t.locked && (p.sleuthPicks || {})[t.pid] === undefined) once('sleuth-' + t.pid, () => setTimeout(() => send({ type: 'sleuthPick', target: t.pid, idx: rnd(t.options.length) }), 1500 + rnd(6000))); });
    } else if (v.phase === 'pitch' && (p.screwVotes || []).some((x) => !x.mine && !(r.activeScrew && r.activeScrew.by === x.by))) {
      p.screwVotes.forEach((x) => { if (!x.mine && !(r.activeScrew && r.activeScrew.by === x.by)) once('vote-screw-' + x.by, () => setTimeout(() => send({ type: 'screwVote', by: x.by, result: chance(0.6) ? 'done' : 'missed' }), 800 + rnd(3000))); });
    } else if (v.phase === 'pitch' && p.role === 'prospect') {
      const t = v.timer.main;
      const left = t ? t.remaining - (t.running ? Date.now() - st.recvAt : 0) : 0;
      if (!p.screwPlayed && !r.activeScrew && !v.hostPaused && left > 25000 && chance(0.06)) send({ type: 'screw', idx: rnd(3) });
    } else if (v.phase === 'close' && p.role === 'prospect') {
      if (!r.objections[p.pid] && chance(0.2)) send({ type: 'objection' });
      if (!p.verdict && chance(0.15)) send({ type: 'verdict', buy: chance(0.5) });
    } else if (v.phase === 'scoring' && p.role === 'phil') {
      once('score', () => {
        const cats = {}; C.categories.forEach((c) => { cats[c.id] = 15 + rnd(8) * 5; });
        const pros = {}; r.prospects.forEach((id) => { pros[id] = rnd(6) * 5; });
        setTimeout(() => send({ type: 'scorecard', cats, prospects: pros }), 1000 + rnd(3000));
      });
    } else if (v.phase === 'scoring' && p.role === 'prospect') {
      if (!p.verdict) send({ type: 'verdict', buy: chance(0.5) });
    } else if (v.phase === 'awards' && v.awards) {
      v.awards.cats.forEach((c) => {
        const opts = c.candidates.filter((x) => x.owner !== p.pid);
        if (opts.length && !(p.votes || {})[c.id]) once('vote-' + c.id, () => setTimeout(() => send({ type: 'vote', cat: c.id, key: opts[rnd(opts.length)].key }), 600 + rnd(3000)));
      });
    } else if (v.phase === 'reveal' && (p.role === 'peddler' || p.role === 'prospect')) {
      once('hof', () => send({ type: 'hof', yes: chance(0.5) }));
    }
  }

  // ---------------------------------------------------------------- boot
  app_boot();
  function app_boot() {
    U.startTimerLoop({ beep: true });
    const q = new URLSearchParams(location.search);
    const room = (q.get('room') || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    if (room && onlineAllowed()) joinScreen(room);
    else if (q.get('practice') != null) startPractice(Number(q.get('practice')) || 5);
    else home();
  }
  P.app = { home, startPractice };
})(window.PITCH = window.PITCH || {});
