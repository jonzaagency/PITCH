/* PITCH! the TV / Host screen. Shows the shared stage and the Host controls.
 * Reads straight from the engine (the Host device runs the game). Never shows hidden secrets. */
(function (P) {
  const U = P.ui, E = P.engine, C = P.content;
  const esc = U.esc;

  const PHASE_TITLE = {
    lobby: 'Lobby', roles: 'Up Next', lab: 'Creation Lab', fact: 'Fact-Finding', pitch: 'PITCH!',
    close: 'Objections + Close', scoring: 'Scoring', reveal: 'Money Reveal', final: 'Final Results'
  };
  // the rulebook's numbered round sequence (section 5)
  const STEPS = [['lab', 'Creation Lab'], ['fact', 'Fact-Finding'], ['pitch', 'PITCH! + SCREW!'], ['close', 'Objections + Close'], ['scoring', 'Money Reveal']];

  function create(root, opts) {
    const game = opts.game;
    const ui = { manage: null, settings: false, rulings: false, peek: {}, hof: false, confirm: null, menu: false };
    let lastFeed = null, lastPhase = null, lastScrew = null, recvAt = Date.now(), view = null;

    function host(cmd, args) {
      if (cmd === 'nextRound' || cmd === 'end') saveHof();
      const res = game.host(cmd, args);
      if (res && !res.ok && res.error) U.toast(res.error, 'warn');
      return res;
    }
    function saveHof() {
      const add = game.hofEntries();
      if (!add.length) return;
      const list = U.store.get('pitch.hof', []);
      add.forEach((e) => { if (!list.some((x) => x.key === e.key)) list.unshift(e); });
      while (list.length > 40) list.pop();
      if (!U.store.set('pitch.hof', list)) { list.forEach((x, i) => { if (i > 12) x.image = null; }); U.store.set('pitch.hof', list); }
    }

    const asset = (ref) => (ref && game.assets[ref.id]) || null;
    const player = (id) => game.s.players[id] || { name: '(left)', color: '#777', id };

    // ---------- pieces ----------
    function stepper(phase) {
      const idx = STEPS.findIndex((s) => s[0] === phase || (s[0] === 'scoring' && (phase === 'reveal')));
      if (idx < 0) return '';
      return '<ol class="steps">' + STEPS.map((s, i) => '<li class="' + (i < idx ? 'done' : i === idx ? 'now' : '') + '"><span class="n">' + (i + 1) + '</span>' + esc(s[1]) + '</li>').join('') + '</ol>';
    }
    function chip(p, extra) {
      return '<span class="chip' + (p.connected === false ? ' off' : '') + '">' + U.avatar(p) + '<span class="chip-name">' + esc(p.name) + '</span>' + (extra || '') + '</span>';
    }
    function deckCard(kind, label, text) {
      return '<div class="deck deck-' + kind + '"><span class="deck-k">' + label + '</span><span class="deck-t">' + esc(text || '?') + '</span></div>';
    }
    function portrait(r, id, size) {
      const img = asset(r.portraits[id]);
      return '<div class="portrait ' + (size || '') + '">' + (img ? '<img alt="Portrait of ' + esc(r.profiles[id].name) + '" src="' + img + '">' : '<span class="portrait-empty">?</span>') + '</div>';
    }
    function profileFacts(pr) {
      return '<ul class="facts"><li><b>Age</b> ' + esc(pr.age) + '</li><li><b>Status</b> ' + esc(pr.marital) + '</li><li><b>Kids</b> ' + esc(pr.kids) +
        '</li><li><b>Job</b> ' + esc(pr.job) + '</li></ul><p class="bg">' + esc(pr.background) + '</p>';
    }
    function secretChip(r, id) {
      const st = r.secrets[id];
      if (st === 'confirmed') return '<div class="secret unlocked"><span class="lbl">Secret unlocked +$25</span>' + esc((game.s.round.profiles[id] || {}).secret) + '</div>';
      if (st === 'claimed') return '<div class="secret claimed"><span class="lbl">Secret claimed</span>Waiting for the Prospect to answer…</div>';
      if (st === 'denied') return '<div class="secret denied"><span class="lbl">Disputed</span>The Host will settle it.</div>';
      return '<div class="secret hidden-s"><span class="lbl">Secret</span>Still hidden</div>';
    }
    function leaderboard(v, limit) {
      const list = v.standings.slice(0, limit || 8);
      if (!list.length) return '';
      return '<ol class="board">' + list.map((p, i) => '<li data-key="lb-' + esc(p.id) + '"' + (p.connected ? '' : ' class="off"') + '><span class="rank">' + (i + 1) + '</span>' + U.avatar(p) +
        '<span class="nm">' + esc(p.name) + '</span><span class="amt">' + U.money(p.earned) + '</span></li>').join('') + '</ol>';
    }
    function inventionShow(v, compact) {
      const r = game.s.round, inv = v.round.invention;
      const img = asset(r.invention.sketch);
      return '<div class="showcase' + (compact ? ' compact' : '') + '">' +
        '<div class="sketch">' + (img ? '<img alt="Sketch of ' + esc(inv.name) + '" src="' + img + '">' : '<span class="portrait-empty">No sketch</span>') + '</div>' +
        '<div class="show-info"><div class="eyebrow">' + esc(player(r.peddler).name) + ' presents</div><h2 class="prod">' + esc(inv.name) + '</h2>' +
        (inv.slogan ? '<p class="slogan">“' + esc(inv.slogan) + '”</p>' : '') +
        '<div class="decks">' + deckCard('item', 'Item', inv.item) + deckCard('func', 'Function', inv.func) + deckCard('spokes', 'Spokesperson', inv.spokes) + '</div></div></div>';
    }

    // ---------- phases ----------
    function lobby(v) {
      const url = opts.joinUrl || '';
      const shortUrl = url.replace(/^https?:\/\//, '').replace(/\?.*$/, '').replace(/\/$/, '');
      const qr = opts.practice ? '' : U.qr(url + (url.indexOf('?') < 0 ? '?' : '&') + 'room=' + v.code);
      const players = v.players;
      return '<section class="lobby">' +
        (opts.practice ? '<div class="join-card practice-note"><div class="eyebrow">Practice mode</div><h2>Everyone plays on this screen</h2><p>Use the phone panel to act as each player. Turn on bots to let the other players act on their own.</p></div>' :
          '<div class="join-card"><div class="eyebrow">Join on your phone</div><p class="join-url">' + esc(shortUrl) + '</p>' +
          '<div class="code-tag" aria-label="Room code ' + esc(v.code.split('').join(' ')) + '">' + esc(v.code) + '</div>' +
          (qr ? '<div class="qr">' + qr + '</div>' : '') + '<p class="muted">3 to 20+ players. Phones are the controllers; this screen is the stage.</p></div>') +
        '<div class="lobby-main"><div class="lobby-head"><h2>Players <span class="count">' + players.filter((p) => p.connected).length + '</span></h2>' +
        '<button class="btn gold big" data-act="start"' + (players.filter((p) => p.connected).length < 3 ? ' disabled' : '') + '>Start the game</button></div>' +
        (players.length ? '<div class="pgrid">' + players.map((p) => '<button class="pcard' + (p.connected ? '' : ' off') + '" data-key="pc-' + esc(p.id) + '" data-act="manage" data-pid="' + esc(p.id) + '">' + U.avatar(p, 'lg') +
          '<span class="pc-name">' + esc(p.name) + '</span><span class="pc-roles">' + E.ROLES.filter((r) => p.prefs[r] && !p.excluded[r]).map((r) => '<i class="dot dot-' + r + '" title="' + U.roleName(r) + '"></i>').join('') + '</span></button>').join('') + '</div>'
          : '<div class="empty"><p>Waiting for players…</p><p class="muted">You need at least 3 to start.</p></div>') +
        settingsPanel(v, true) + '</div></section>';
    }

    function settingsPanel(v, inline) {
      if (!inline && !ui.settings) return '';
      const st = v.settings;
      const num = (k, label) => '<label class="set-num"><span>' + label + '</span><input type="number" min="5" max="900" step="5" id="set-' + k + '" data-set="timers.' + k + '" value="' + st.timers[k] + '"><em>sec</em></label>';
      return '<div class="settings' + (inline ? ' inline' : ' panel') + '"><div class="set-head"><h3>Game settings</h3>' + (inline ? '' : '<button class="btn ghost sm" data-act="settings">Close</button>') + '</div>' +
        '<div class="set-grid">' + num('lab', 'Creation Lab') + num('fact', 'Fact-Finding') + num('pitch', 'Pitch') + num('close', 'Objections + Close') + num('screw', 'SCREW! response') + '</div>' +
        '<div class="set-row"><span>Prospects per round (max)</span><div class="seg">' + [1, 2, 3].map((n) => '<button data-act="setProspects" data-n="' + n + '" class="' + (st.maxProspects === n ? 'on' : '') + '">' + n + '</button>').join('') + '</div></div>' +
        '<div class="set-row"><span>Rounds</span><div class="seg">' + [0, 3, 5, 8].map((n) => '<button data-act="setRounds" data-n="' + n + '" class="' + (st.rounds === n ? 'on' : '') + '">' + (n ? n : 'Everyone pitches once') + '</button>').join('') + '</div></div>' +
        '<label class="set-row toggle"><span>Move on automatically when time runs out or everyone is done</span><input type="checkbox" id="set-auto" data-set="autoAdvance"' + (st.autoAdvance ? ' checked' : '') + '></label>' +
        '<label class="set-row toggle"><span>Sound effects on this screen</span><input type="checkbox" id="set-sound" data-set="sound"' + (!U.muted ? ' checked' : '') + '></label></div>';
    }

    function roles(v) {
      const pr = v.proposal;
      const need = v.need;
      let banner = '';
      if (need) {
        banner = need.role === 'players'
          ? '<div class="banner warn">Waiting for ' + need.count + ' more player' + (need.count > 1 ? 's' : '') + ' to connect.</div>'
          : '<div class="banner warn"><b>We need a volunteer ' + esc(U.roleName(need.role)) + '!</b> Nobody available has opted in. Tap “Volunteer” on your phone.</div>';
      }
      const col = (title, ids, role) => '<div class="rcol rcol-' + role + '"><h3>' + title + '</h3>' + (ids && ids.length ? ids.map((id) =>
        '<button class="rplayer" data-key="rp-' + esc(id) + '" data-act="manage" data-pid="' + esc(id) + '">' + U.avatar(player(id), role === 'peddler' ? 'xl' : 'lg') + '<span>' + esc(player(id).name) + '</span></button>').join('') : '<p class="muted">Nobody</p>') + '</div>';
      return '<section class="roles">' + banner +
        '<div class="round-title"><div class="eyebrow">Round ' + (v.roundNo + 1) + '</div><h2>Here is the table</h2><p class="muted">Tap a player to move them. Roles respect everyone’s opt-outs.</p></div>' +
        (pr ? '<div class="rcols">' + col('Peddler', [pr.peddler], 'peddler') + col('Prospects', pr.prospects, 'prospect') + col('Philanthropists', pr.phils, 'phil') + (pr.sitOut.length ? col('Sitting out', pr.sitOut, 'sitout') : '') + '</div>' : '') +
        '<div class="actions">' + '<button class="btn ghost" data-act="shuffle">Shuffle roles</button>' +
        '<button class="btn gold big" data-act="begin"' + (v.proposalError ? ' disabled' : '') + '>Start the Creation Lab</button></div>' +
        (v.proposalError && pr ? '<p class="err center">' + esc(v.proposalError) + '</p>' : '') +
        '<p class="center muted shop-note">The <b>NEPO BABY!</b> shop is open on everyone’s phone until the round starts.</p>' +
        (v.roundNo ? '<div class="side-board"><h3>Session money</h3>' + leaderboard(v, 10) + '</div>' : '') + '</section>';
    }

    function lab(v) {
      const r = v.round;
      return '<section class="lab"><div class="lab-ped">' + U.avatar(player(r.peddler), 'xl') + '<div><div class="eyebrow">Peddler</div><h2>' + esc(player(r.peddler).name) + ' is inventing' + '</h2>' +
        '<p>' + (r.labDone[r.peddler] ? '<span class="ok">Ready ✓</span>' : 'Choosing an Item, a Function and a Spokesperson, then sketching it.') + '</p></div></div>' +
        '<div class="lab-pros"><h3>Prospects are drawing their characters</h3><div class="lab-grid">' + r.prospects.map((id) =>
          '<div class="lab-p" data-key="lp-' + esc(id) + '">' + U.avatar(player(id), 'lg') + '<span>' + esc(player(id).name) + '</span>' + (r.labDone[id] ? '<span class="ok">Ready ✓</span>' : '<span class="muted">Drawing…</span>') + '</div>').join('') + '</div></div>' +
        '<p class="center muted">Philanthropists: you will score six categories, $0 to $50 each. Watch closely.</p></section>';
    }

    function fact(v) {
      const r = v.round;
      return '<section class="fact"><p class="lead">' + esc(player(r.peddler).name) + ', ask every Prospect at least one real question. Each secret you uncover earns <b>$25</b>.</p>' +
        '<div class="pros">' + r.prospects.map((id) => '<article class="pro" data-key="pro-' + esc(id) + '">' + portrait(game.s.round, id) +
          '<div class="pro-body"><h3>' + esc(r.profiles[id].name) + '</h3><p class="played-by">played by ' + esc(player(id).name) + '</p>' + profileFacts(r.profiles[id]) +
          '<div class="pro-tags">' + (r.asked[id] ? '<span class="tag ok">Questioned ✓</span>' : '<span class="tag">Not questioned yet</span>') + '</div>' + secretChip(r, id) + '</div></article>').join('') + '</div>' +
        disputes(v) + '</section>';
    }

    function disputes(v) {
      const r = v.round;
      if (!r || !r.disputes.length) return '';
      return '<div class="disputes">' + r.disputes.map((d) => {
        const prof = game.s.round.profiles[d.pid];
        return '<div class="dispute" data-key="dp-' + esc(d.pid) + '"><div><span class="lbl">Host ruling needed</span><p>The Peddler thinks <b>' + esc(prof.name) + '</b>’s secret is: “' + esc(d.guess || '(said out loud)') + '”. The Prospect said no.</p>' +
          (ui.peek[d.pid] ? '<p class="peek">Actual secret: ' + esc(prof.secret) + '</p>' : '<button class="btn ghost sm" data-act="peek" data-pid="' + esc(d.pid) + '">Show the real secret (everyone will see it)</button>') + '</div>' +
          '<div class="dispute-btns"><button class="btn mint" data-act="secret" data-pid="' + esc(d.pid) + '" data-status="confirmed">Award the secret</button><button class="btn ghost" data-act="secret" data-pid="' + esc(d.pid) + '" data-status="hidden">Not a match</button></div></div>';
      }).join('') + '</div>';
    }

    function screwRow(v) {
      const r = v.round;
      return '<div class="screw-row">' + r.prospects.map((id) => {
        const pl = r.screwPlayed[id];
        let st = '<span class="tag">SCREW! in hand</span>';
        if (pl) st = '<span class="tag red">' + esc(pl.card.t) + (pl.result === 'done' ? ' · nailed it' : pl.result === 'missed' ? ' · missed' : pl.result === 'cancelled' ? ' · NOT TODAY!' : '') + '</span>';
        return '<div class="mini-pro" data-key="mp-' + esc(id) + '">' + portrait(game.s.round, id, 'sm') + '<div><b>' + esc(r.profiles[id].name) + '</b>' + st + (pl && !pl.result && !(r.activeScrew && r.activeScrew.by === id) ? judgeBtns(id, true) : '') + '</div></div>';
      }).join('') + '</div>';
    }
    function judgeBtns(pid, small) {
      return '<span class="judge"><button class="btn mint' + (small ? ' sm' : ' big') + '" data-act="judge" data-pid="' + esc(pid) + '" data-result="done">Nailed it</button><button class="btn ghost' + (small ? ' sm' : ' big') + '" data-act="judge" data-pid="' + esc(pid) + '" data-result="missed">Missed it</button></span>';
    }

    function pitch(v) {
      return '<section class="pitch">' + inventionShow(v) + screwRow(v) + '</section>';
    }

    function close(v) {
      const r = v.round;
      const order = Object.keys(r.objections).sort((a, b) => r.objections[a] - r.objections[b]);
      return '<section class="close">' + inventionShow(v, true) +
        '<p class="lead">Prospects: raise one final objection each. ' + esc(player(r.peddler).name) + ': answer it and <b>ask for the sale</b>.</p>' +
        '<div class="obj-row">' + r.prospects.map((id) => {
          const n = order.indexOf(id);
          return '<div class="obj' + (n >= 0 ? ' raised' : '') + '" data-key="ob-' + esc(id) + '">' + portrait(game.s.round, id, 'sm') + '<div><b>' + esc(r.profiles[id].name) + '</b>' +
            (n >= 0 ? '<span class="tag red">Objection #' + (n + 1) + '</span>' : '<span class="tag">No objection yet</span>') +
            (r.verdicts[id] ? '<span class="tag ok">Decided</span>' : '') + '</div></div>';
        }).join('') + '</div></section>';
    }

    function scoring(v) {
      const r = v.round;
      const confirmed = r.prospects.filter((id) => r.secrets[id] === 'confirmed').length;
      return '<section class="scoring"><div class="round-title"><div class="eyebrow">Philanthropists</div><h2>Score the pitch on your phone</h2><p class="muted">Six categories, $0 to $50 each. Score what you saw, not who you like.</p></div>' +
        '<div class="phil-grid">' + r.phils.map((id) => '<div class="phil' + (r.scorecardsIn.indexOf(id) >= 0 ? ' in' : '') + '" data-key="ph-' + esc(id) + '">' + U.avatar(player(id), 'lg') + '<span>' + esc(player(id).name) + '</span>' +
          (r.scorecardsIn.indexOf(id) >= 0 ? '<span class="ok">Scored ✓</span>' : '<span class="muted">Scoring…</span>') + '</div>').join('') + '</div>' +
        '<p class="center">Secrets discovered: <b>' + confirmed + ' of ' + r.prospects.length + '</b> (+' + U.money(confirmed * 25) + ' bonus)</p>' +
        disputes(v) +
        '<div class="actions"><button class="btn gold big" data-act="reveal">Reveal the money' + (r.scorecardsIn.length < r.phils.length ? ' now (' + r.scorecardsIn.length + '/' + r.phils.length + ' in)' : '') + '</button></div></section>';
    }

    function reveal(v) {
      const r = v.round, res = r.results;
      const gr = game.s.round;
      const bars = C.categories.map((c, i) => '<div class="bar-row" style="--d:' + (0.25 * i).toFixed(2) + 's"><span class="bar-name">' + esc(c.name) + '</span><span class="bar"><i style="--w:' + ((res.catAvg[c.id] / 50) * 100).toFixed(1) + '%"></i></span><span class="bar-amt">' + U.money(res.catAvg[c.id]) + '</span></div>').join('');
      return '<section class="reveal"><div class="rv-main"><div class="eyebrow">' + esc(player(r.peddler).name) + '’s pitch</div><h2 class="prod">' + esc(r.invention.name) + '</h2>' +
        '<div class="bars">' + bars + '</div>' +
        '<div class="math"><div><span>Average scorecard</span><b>' + U.money2(res.base) + '</b><em>' + res.scorecards + ' Philanthropist' + (res.scorecards === 1 ? '' : 's') + '</em></div>' +
        '<div class="plus">+</div><div><span>Secrets found</span><b>' + U.money2(res.bonus) + '</b><em>' + res.secrets + ' × $25</em></div><div class="plus">=</div>' +
        '<div class="price-tag big-tag"><span>Peddler earns</span><b>' + U.money2(res.total) + '</b></div></div></div>' +
        '<div class="rv-side"><h3>Prospects</h3>' + r.prospects.map((id) => '<div class="rv-pro" data-key="rv-' + esc(id) + '">' + portrait(gr, id, 'sm') + '<div><span><b>' + esc(r.profiles[id].name) + '</b><span class="muted"> · ' + esc(player(id).name) + '</span></span>' +
          '<p class="rv-secret">' + (r.secrets[id] === 'confirmed' ? '<span class="ok">Found:</span> ' : '<span class="muted">Hidden:</span> ') + esc(gr.profiles[id].secret) + '</p>' +
          '<span class="stamp ' + (r.verdicts[id] === 'buy' ? 'buy' : 'pass') + '">' + (r.verdicts[id] === 'buy' ? 'Would buy' : r.verdicts[id] === 'pass' ? 'Pass' : 'Undecided') + '</span>' +
          '<span class="award">Role-play award ' + U.money2(res.prospectAwards[id]) + '</span></div></div>').join('') +
        '<h3>Session money</h3>' + leaderboard(v, 8) + '</div></section>';
    }

    function final(v) {
      const st = v.standings;
      const winners = st.filter((p) => p.winner);
      const pod = st.slice(0, 3);
      return '<section class="final"><div class="eyebrow">Session champion' + (winners.length > 1 ? 's' : '') + '</div>' +
        '<h2 class="champ">' + (winners.length ? winners.map((w) => esc(w.name)).join(' & ') : 'Nobody earned money yet') + '</h2>' +
        (winners.length > 1 ? '<p class="muted">A tie! Declare co-winners, or run a quick tiebreaker pitch.</p>' : '') +
        '<div class="podium">' + pod.map((p, i) => '<div class="pod pod-' + (i + 1) + '" data-key="pod-' + esc(p.id) + '">' + U.avatar(p, 'xl') + '<b>' + esc(p.name) + '</b><span class="price-tag"><b>' + U.money2(p.earned) + '</b></span><span class="pod-block">' + (i + 1) + '</span></div>').join('') + '</div>' +
        (st.length > 3 ? '<div class="side-board"><h3>Everyone</h3>' + leaderboard(v, 40) + '</div>' : '') +
        (v.history.length ? '<div class="hist"><h3>Tonight’s inventions</h3><div class="hist-grid">' + v.history.map((h) => '<div class="hist-card" data-key="hc-' + h.n + '">' +
          (h.sketch && game.assets[h.sketch.id] ? '<img alt="Sketch of ' + esc(h.name) + '" src="' + game.assets[h.sketch.id] + '">' : '') + '<b>' + esc(h.name) + '</b><span class="muted">' + esc(h.peddlerName) + ' · ' + U.money2(h.total) + '</span></div>').join('') + '</div></div>' : '') +
        '<div class="actions"><button class="btn ghost" data-act="hof">Hall of Fame</button><button class="btn gold big" data-act="newGame">Play again with these players</button></div></section>';
    }

    // ---------- overlays ----------
    function screwOverlay(v) {
      const r = v.round;
      if (!r || !r.activeScrew) return '';
      const a = r.activeScrew;
      return '<div class="overlay screw-ov" role="alert"><div class="screw-card"><div class="screw-word">SCREW!</div><p class="by">' + esc(r.profiles[a.by].name) + ' plays</p>' +
        '<h2>' + esc(a.card.t) + '</h2><p class="desc">' + esc(a.card.d) + '</p>' + U.timerHTML(v.timer.screw, recvAt, 'screw-timer', true) +
        '<p class="muted">Pitch clock paused. ' + esc(player(r.peddler).name) + ' has 15 seconds.</p>' + judgeBtns(a.by) + '</div></div>';
    }
    function daddyOverlay(v) {
      const r = v.round;
      if (!r || !r.daddy) return '';
      return '<div class="overlay daddy-ov" role="alert"><div class="daddy-card"><div class="eyebrow">NEPO BABY! · DADDY MADE A CALL</div><h2>' + esc(r.profiles[r.daddy.target] ? r.profiles[r.daddy.target].name : '') + '</h2>' +
        '<p class="desc">' + esc(r.daddy.text) + '</p><button class="btn gold big" data-act="daddyDone">Done</button></div></div>';
    }
    function manageOverlay(v) {
      if (!ui.manage) return '';
      const p = v.players.find((x) => x.id === ui.manage);
      if (!p) { ui.manage = null; return ''; }
      const inRoles = v.phase === 'roles';
      const elig = (r) => p.prefs[r] || p.volunteer === r;
      return '<div class="overlay" data-act="closeManage"><div class="sheet" data-stop="1"><div class="sheet-head">' + U.avatar(p, 'lg') + '<h3>' + esc(p.name) + '</h3><button class="btn ghost sm" data-act="closeManage">Close</button></div>' +
        (inRoles ? '<p class="muted">Role for the coming round</p><div class="seg wrap">' + ['peddler', 'prospect', 'phil', 'sitout'].map((r) => '<button data-act="setRole" data-pid="' + esc(p.id) + '" data-role="' + r + '"' +
          (r !== 'sitout' && (!elig(r) || p.excluded[r]) ? ' disabled title="Opted out"' : '') + '>' + U.roleName(r) + '</button>').join('') + '</div>' : '') +
        '<p class="muted">Roles this player may get (Host setting)</p><div class="elig">' + E.ROLES.map((r) => '<label class="set-row toggle"><span>' + U.roleName(r) + (p.prefs[r] ? '' : ' <em class="muted">(player opted out)</em>') + '</span>' +
          '<input type="checkbox" id="ex-' + r + '" data-act="exclude" data-pid="' + esc(p.id) + '" data-role="' + r + '"' + (!p.excluded[r] ? ' checked' : '') + '></label>').join('') + '</div>' +
        (ui.confirm === 'kick-' + p.id ? '<div class="confirm"><span>Remove ' + esc(p.name) + ' from the room?</span><button class="btn red" data-act="kick" data-pid="' + esc(p.id) + '">Remove</button><button class="btn ghost" data-act="cancelConfirm">Keep</button></div>'
          : '<button class="btn ghost red-text" data-act="askKick" data-pid="' + esc(p.id) + '">Remove from room</button>') + '</div></div>';
    }
    function rulingsOverlay(v) {
      if (!ui.rulings || !v.round) return '';
      const r = v.round, gr = game.s.round;
      return '<div class="overlay" data-act="rulings"><div class="sheet" data-stop="1"><div class="sheet-head"><h3>Host rulings: secrets</h3><button class="btn ghost sm" data-act="rulings">Close</button></div>' +
        '<p class="muted">Settle close calls. A random guess or a secret the Prospect blurted out does not count.</p>' +
        r.prospects.map((id) => '<div class="ruling" data-key="ru-' + esc(id) + '"><div><b>' + esc(r.profiles[id].name) + '</b> <span class="tag">' + esc(r.secrets[id]) + '</span>' +
          (ui.peek[id] ? '<p class="peek">' + esc(gr.profiles[id].secret) + '</p>' : ' <button class="btn ghost sm" data-act="peek" data-pid="' + esc(id) + '">Show secret</button>') + '</div>' +
          (v.phase === 'reveal' || v.phase === 'final' ? '' : '<div class="dispute-btns"><button class="btn mint sm" data-act="secret" data-pid="' + esc(id) + '" data-status="confirmed">Discovered</button><button class="btn ghost sm" data-act="secret" data-pid="' + esc(id) + '" data-status="hidden">Hidden</button></div>') + '</div>').join('') +
        '</div></div>';
    }
    function hofOverlay() {
      if (!ui.hof) return '';
      const list = U.store.get('pitch.hof', []);
      return '<div class="overlay" data-act="hof"><div class="sheet wide-sheet" data-stop="1"><div class="sheet-head"><h3>Hall of Fame</h3><button class="btn ghost sm" data-act="hof">Close</button></div>' +
        (list.length ? '<div class="hof-grid">' + list.map((e) => '<div class="hof-card">' + (e.image ? '<img alt="' + esc(e.name) + '" src="' + e.image + '">' : '') + '<span class="eyebrow">' + (e.kind === 'invention' ? 'Invention' : 'Prospect') + '</span><b>' + esc(e.name) + '</b>' +
          (e.slogan ? '<em>“' + esc(e.slogan) + '”</em>' : '') + '<span class="muted">by ' + esc(e.creator) + ' · ' + U.money2(e.earned) + '</span></div>').join('') + '</div>'
          : '<p class="muted">Nothing here yet. After a round, the Peddler and Prospects can opt in from their phones to feature their drawings.</p>') + '</div></div>';
    }
    function menuOverlay(v) {
      if (!ui.menu) return '';
      return '<div class="overlay" data-act="menu"><div class="sheet" data-stop="1"><div class="sheet-head"><h3>Host menu</h3><button class="btn ghost sm" data-act="menu">Close</button></div>' +
        '<div class="menu-list"><button class="btn ghost" data-act="settings">Game settings</button><button class="btn ghost" data-act="hof">Hall of Fame</button>' +
        (['reveal', 'roles', 'lobby'].indexOf(v.phase) >= 0 && v.roundNo ? '<button class="btn ghost" data-act="end">Final results</button>' : '') +
        (ui.confirm === 'close' ? '<div class="confirm"><span>' + (opts.practice ? 'Leave practice mode?' : 'Close the room for everyone?') + '</span><button class="btn red" data-act="closeRoom">' + (opts.practice ? 'Leave' : 'Close room') + '</button><button class="btn ghost" data-act="cancelConfirm">Stay</button></div>'
          : '<button class="btn ghost red-text" data-act="askClose">' + (opts.practice ? 'Leave practice mode' : 'Close room and exit') + '</button>') + '</div></div></div>';
    }

    function dock(v) {
      const timed = ['lab', 'fact', 'pitch', 'close'].indexOf(v.phase) >= 0;
      const nextLabel = { lab: 'Skip to Fact-Finding', fact: 'Start the PITCH!', pitch: 'End pitch', close: 'Open scoring' }[v.phase];
      return '<div class="dock">' +
        (timed ? (v.hostPaused ? '<button class="btn gold" data-act="resume">Resume</button>' : '<button class="btn ghost" data-act="pause">Pause</button>') +
          '<button class="btn ghost" data-act="addTime">+30s</button><button class="btn ghost" data-act="next">' + nextLabel + ' ›</button>' : '') +
        (v.round && ['fact', 'pitch', 'close', 'scoring'].indexOf(v.phase) >= 0 ? '<button class="btn ghost" data-act="rulings">Rulings</button>' : '') +
        (v.phase === 'scoring' ? '<button class="btn gold" data-act="reveal">Reveal the money</button>' : '') +
        (v.phase === 'reveal' ? (v.roundsDone ? '<button class="btn ghost" data-act="nextRound">One more round</button><button class="btn gold" data-act="end">Final results</button>'
          : '<button class="btn ghost" data-act="end">End game now</button><button class="btn gold" data-act="nextRound">Next round</button>') : '') +
        '<button class="btn ghost icon" data-act="mute" aria-label="' + (U.muted ? 'Turn sound on' : 'Mute') + '">' + (U.muted ? 'Sound off' : 'Sound on') + '</button>' +
        '<button class="btn ghost" data-act="menu">Menu</button></div>';
    }

    function strip(v) {
      if (v.phase === 'lobby') return '';
      return '<div class="strip">' + v.players.map((p) => '<div class="sp' + (p.connected ? '' : ' off') + (p.role ? ' role-' + p.role : '') + '" data-key="sp-' + esc(p.id) + '">' + U.avatar(p) +
        '<span class="sp-name">' + esc(p.name) + '</span><span class="sp-amt">' + U.money(p.earned) + '</span></div>').join('') + '</div>';
    }

    function render() {
      const v = view = game.publicView();
      recvAt = Date.now();
      const ph = v.phase;
      const body = { lobby, roles, lab, fact, pitch, close, scoring, reveal, final }[ph](v);
      const timer = v.timer.main && !v.round?.activeScrew ? U.timerHTML(v.timer.main, recvAt, 'main-timer', true) : (v.timer.main ? U.timerHTML(v.timer.main, recvAt, 'main-timer paused-by-screw') : '');
      const html = '<div class="tv phase-' + ph + '">' +
        '<header class="tv-top"><div class="logo" aria-label="PITCH!">PITCH<span>!</span></div>' +
        '<div class="tv-phase">' + (v.round && ph !== 'lobby' && ph !== 'final' && ph !== 'roles' ? '<span class="eyebrow">Round ' + v.round.n + '</span>' : '') + '<span class="ph-name">' + PHASE_TITLE[ph] + '</span>' + stepper(ph) + '</div>' +
        '<div class="tv-right">' + (v.hostPaused ? '<span class="tag red">Paused</span>' : '') + (v.expired && !v.settings.autoAdvance ? '<span class="tag red">Time!</span>' : '') + timer + '</div></header>' +
        '<main class="tv-stage" data-key="stage-' + ph + '">' + body + '</main>' +
        '<footer class="tv-bottom">' + strip(v) + dock(v) + '</footer>' +
        settingsPanel(v, false) + screwOverlay(v) + daddyOverlay(v) + manageOverlay(v) + rulingsOverlay(v) + hofOverlay() + menuOverlay(v) + '</div>';
      U.morph(root, html);
      effects(v);
    }

    function effects(v) {
      if (lastPhase !== v.phase) {
        if (lastPhase !== null) U.sound(v.phase === 'reveal' ? 'cash' : 'start');
        lastPhase = v.phase;
      }
      const sc = v.round && v.round.activeScrew ? v.round.activeScrew.by + v.round.activeScrew.card.t : null;
      if (sc && sc !== lastScrew) U.sound('buzz');
      lastScrew = sc;
      const maxId = v.feed.length ? v.feed[v.feed.length - 1].id : 0;
      if (lastFeed === null) lastFeed = maxId;
      v.feed.forEach((f) => {
        if (f.id <= lastFeed) return;
        if (f.kind === 'join') U.sound('join');
        if (f.kind === 'secret' && f.big) U.sound('ding');
        if (f.kind === 'time') U.sound('time');
        if (['screw', 'money', 'join', 'leave', 'round', 'shop'].indexOf(f.kind) < 0) U.toast(f.text, f.big ? 'big' : '');
      });
      lastFeed = Math.max(lastFeed, maxId);
    }

    // ---------- events ----------
    root.addEventListener('click', (e) => {
      const stop = e.target.closest('[data-stop]');
      const el = e.target.closest('[data-act]');
      if (!el || !root.contains(el)) return;
      if (stop && !stop.contains(el)) return;
      if (el.classList.contains('overlay') && e.target !== el) return; // only backdrop clicks close
      if (el.tagName === 'INPUT') return; // handled on change
      U.unlockAudio();
      const d = el.dataset, a = d.act;
      const simple = ['start', 'shuffle', 'begin', 'next', 'pause', 'resume', 'reveal', 'nextRound', 'end', 'newGame', 'daddyDone'];
      if (simple.indexOf(a) >= 0) { host(a); if (a === 'end' || a === 'newGame') ui.menu = false; }
      else if (a === 'addTime') host('addTime', { sec: 30 });
      else if (a === 'judge') host('screwJudge', { pid: d.pid, result: d.result });
      else if (a === 'secret') host('secret', { pid: d.pid, status: d.status });
      else if (a === 'setRole') { host('setRole', { pid: d.pid, role: d.role }); ui.manage = null; }
      else if (a === 'kick') { host('kick', { pid: d.pid }); ui.manage = null; ui.confirm = null; }
      else if (a === 'askKick') ui.confirm = 'kick-' + d.pid;
      else if (a === 'askClose') ui.confirm = 'close';
      else if (a === 'cancelConfirm') ui.confirm = null;
      else if (a === 'closeRoom') { ui.confirm = null; opts.onExit && opts.onExit(); return; }
      else if (a === 'manage') { ui.manage = d.pid; ui.confirm = null; }
      else if (a === 'closeManage') { ui.manage = null; ui.confirm = null; }
      else if (a === 'settings') { ui.settings = !ui.settings; ui.menu = false; }
      else if (a === 'rulings') ui.rulings = !ui.rulings;
      else if (a === 'menu') { ui.menu = !ui.menu; ui.confirm = null; }
      else if (a === 'hof') { ui.hof = !ui.hof; ui.menu = false; }
      else if (a === 'peek') ui.peek[d.pid] = true;
      else if (a === 'mute') { U.muted = !U.muted; U.store.set('pitch.muted', U.muted); }
      else if (a === 'setProspects') host('settings', { maxProspects: Number(d.n) });
      else if (a === 'setRounds') host('settings', { rounds: Number(d.n) });
      render();
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.act === 'exclude') { host('exclude', { pid: el.dataset.pid, role: el.dataset.role, excluded: !el.checked }); render(); return; }
      const k = el.dataset.set;
      if (!k) return;
      if (k === 'sound') { U.muted = !el.checked; U.store.set('pitch.muted', U.muted); }
      else if (k === 'autoAdvance') host('settings', { autoAdvance: el.checked });
      else if (k.indexOf('timers.') === 0) host('settings', { timers: { [k.slice(7)]: Number(el.value) } });
      render();
    });

    return { render };
  }

  P.tv = { create };
})(window.PITCH = window.PITCH || {});
