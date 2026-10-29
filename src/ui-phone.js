/* PITCH! the phone controller. One per player. Sends actions, renders the private view. */
(function (P) {
  const U = P.ui, E = P.engine, C = P.content;
  const esc = U.esc;

  function create(root, opts) {
    // opts: send(action), profile, onProfile(profile), onLeave(), practice
    const st = { pub: null, priv: null, recvAt: Date.now(), assets: {}, drafts: {}, pads: {}, confirm: null, host: true, conn: 'online', lastErr: 0, sent: {}, tab: null, chooser: null };
    const send = (a) => opts.send(a);
    const draft = (k, d) => (k in st.drafts ? st.drafts[k] : d);

    // ---------- drawing pads (kept alive across re-renders) ----------
    function pad(key, kind) {
      if (!st.pads[key]) {
        let tmr = null;
        st.pads[key] = new U.DrawPad({
          onChange: (p) => { clearTimeout(tmr); tmr = setTimeout(() => sendDrawing(key), 2500); }
        });
        st.pads[key].kind = kind;
      }
      return st.pads[key];
    }
    function sendDrawing(key) {
      const p = st.pads[key];
      if (!p || !p.dirty) return;
      p.dirty = false;
      send({ type: 'drawing', data: p.export() });
    }
    function mountPads() {
      root.querySelectorAll('[data-pad]').forEach((host) => {
        const p = st.pads[host.getAttribute('data-pad')];
        if (p && p.el.parentNode !== host) { host.innerHTML = ''; host.appendChild(p.el); }
      });
    }

    // ---------- small pieces ----------
    const roleBadge = (r) => r ? '<span class="role-badge rb-' + r + '">' + esc(U.roleName(r)) + '</span>' : '';
    function header() {
      const p = st.priv, v = st.pub;
      const t = v && v.timer ? (v.timer.screw || v.timer.main) : null;
      return '<header class="ph-top">' + (p ? U.avatar(p) + '<span class="ph-name">' + esc(p.name) + '</span>' + roleBadge(p.role) : '<span class="ph-name">PITCH!</span>') +
        '<span class="grow"></span>' + (t ? U.timerHTML(t, st.recvAt, 'ph-timer') : '') +
        (p ? '<span class="cash" title="Available cash">' + U.money(p.wallet.cash) + '</span>' : '') + '</header>';
    }
    function banners() {
      let b = '';
      if (st.conn !== 'online') b += '<div class="banner warn">Reconnecting…</div>';
      else if (!st.host) b += '<div class="banner warn">Waiting for the Host’s screen to come back…</div>';
      if (st.pub && st.pub.hostPaused) b += '<div class="banner">Paused by the Host</div>';
      return b;
    }
    function card(kind, label, text, act, idx, on) {
      return '<button class="deck deck-' + kind + (on ? ' on' : '') + '" data-act="' + act + '" data-deck="' + kind + '" data-idx="' + idx + '"><span class="deck-k">' + label + '</span><span class="deck-t">' + esc(text) + '</span>' + (on ? '<span class="pick">Picked</span>' : '') + '</button>';
    }
    function profileCard(pr, withSecret) {
      return '<div class="profile"><div class="eyebrow">Your character</div><h3>' + esc(pr.name) + '</h3><ul class="facts"><li><b>Age</b> ' + esc(pr.age) + '</li><li><b>Status</b> ' + esc(pr.marital) +
        '</li><li><b>Kids</b> ' + esc(pr.kids) + '</li><li><b>Job</b> ' + esc(pr.job) + '</li></ul><p class="bg">' + esc(pr.background) + '</p>' +
        (withSecret ? '<div class="top-secret"><span class="lbl">Top secret: only you can see this</span>' + esc(pr.secret) + '</div><p class="hint">Answer in character. Reveal the secret only if the Peddler genuinely uncovers it with good questions.</p>' : '') + '</div>';
    }
    function confirmBtn(key, label, act, data, cls) {
      const attrs = Object.keys(data || {}).map((k) => ' data-' + k + '="' + esc(data[k]) + '"').join('');
      if (st.confirm === key) return '<div class="confirm"><button class="btn ' + (cls || 'gold') + '" data-act="' + act + '"' + attrs + '>Yes, ' + esc(label.toLowerCase()) + '</button><button class="btn ghost" data-act="cancel">Cancel</button></div>';
      return '<button class="btn ' + (cls || 'gold') + '" data-act="ask" data-ck="' + esc(key) + '">' + esc(label) + '</button>';
    }
    function nepoCards() {
      const inv = st.priv.wallet.inventory;
      return Object.values(C.nepo).filter((c) => inv[c.id] > 0);
    }

    // ---------- shop + profile (between rounds) ----------
    function shop() {
      const w = st.priv.wallet;
      return '<section class="shop"><div class="sec-head"><h3>NEPO BABY! shop</h3><span class="muted">Available cash <b>' + U.money2(w.cash) + '</b></span></div>' +
        Object.values(C.nepo).map((c) => '<div class="nepo" data-key="nepo-' + c.id + '"><div><b>' + esc(c.name) + '</b><span class="price">' + U.money(c.price) + '</span><p>' + esc(c.effect) + '</p><p class="muted">Use: ' + esc(c.when) + ' · You own ' + w.inventory[c.id] + '</p></div>' +
          (w.cash >= c.price ? confirmBtn('buy-' + c.id, 'Buy', 'buy', { card: c.id }, 'violet') : '<button class="btn ghost" disabled>Need ' + U.money(c.price - w.cash) + ' more</button>') + '</div>').join('') +
        '<p class="hint">Power Cards are used when you are the Peddler, one per pitch. They never force a score or a sale.</p></section>';
    }
    function prefs() {
      const p = st.priv;
      return '<section><div class="sec-head"><h3>Roles I’m up for</h3></div><div class="prefs">' + E.ROLES.map((r) => '<label class="set-row toggle' + (p.excluded[r] ? ' dim' : '') + '"><span>' + U.roleName(r) +
        (p.excluded[r] ? ' <em class="muted">(Host turned off)</em>' : '') + '</span><input type="checkbox" id="pref-' + r + '" data-act="pref" data-role="' + r + '"' + (p.prefs[r] ? ' checked' : '') + '></label>').join('') + '</div></section>';
    }
    function wallet() {
      const w = st.priv.wallet, prof = opts.profile;
      return '<section class="wallet"><div class="sec-head"><h3>My wallet</h3></div><div class="w-grid"><div><span>Tonight</span><b>' + U.money2(st.priv.earned) + '</b></div><div><span>Available cash</span><b>' + U.money2(w.cash) +
        '</b></div><div><span>Career earnings</span><b>' + U.money2(w.career) + '</b></div></div>' +
        (prof && prof.inventions.length ? '<details><summary>My invention collection (' + prof.inventions.length + ')</summary><div class="coll">' + prof.inventions.map((x) => '<div class="coll-i">' + (x.image ? '<img alt="" src="' + x.image + '">' : '') + '<b>' + esc(x.name) + '</b><span class="muted">' + esc([x.item, x.func, x.spokes].join(' + ')) + ' · ' + U.money2(x.earned) + '</span></div>').join('') + '</div></details>' : '') + '</section>';
    }

    // ---------- screens ----------
    function lobbyScreen() {
      return '<section class="hello"><h2>You’re in!</h2><p>Watch the big screen. The Host starts the game when everyone has joined.</p></section>' + prefs() + shop() + wallet();
    }
    function rolesScreen() {
      const v = st.pub, p = st.priv;
      let top = '';
      if (v.need && v.need.role !== 'players' && !p.excluded[v.need.role] && p.volunteer !== v.need.role) {
        top = '<section class="vol"><h3>Volunteer needed</h3><p>Nobody available opted in as <b>' + esc(U.roleName(v.need.role)) + '</b>. Want to play it this round?</p><button class="btn gold" data-act="volunteer" data-role="' + v.need.role + '">Volunteer as ' + esc(U.roleName(v.need.role)) + '</button></section>';
      }
      const nr = p.nextRole;
      return top + (nr ? '<section class="next-role rb-bg-' + nr + '"><span class="eyebrow">Next round you are</span><h2>' + (nr === 'sitout' ? 'Sitting out' : 'the ' + esc(U.roleName(nr))) + '</h2><p class="muted">The Host can still change this.</p></section>' : '') + shop() + prefs() + wallet();
    }

    function peddlerLab() {
      const p = st.priv, inv = p.invention, h = p.hand;
      const k = 'r' + st.pub.round.n;
      const name = draft(k + '-name', inv.name || ''), slogan = draft(k + '-slogan', inv.slogan || '');
      pad(k + '-sketch', 'sketch');
      let nepo = '';
      if (p.wallet.inventory.knowPeople > 0 && !st.pub.round.nepoUsed) {
        const r = st.pub.round;
        const pool = st.pub.players.filter((x) => x.connected && x.id !== p.pid && r.prospects.indexOf(x.id) < 0 && x.prefs.prospect && !x.excluded.prospect);
        nepo = '<section class="nepo-use"><h3>I KNOW PEOPLE</h3><p class="muted">Before fact-finding, swap one Prospect for another player.</p>' +
          (st.chooser === 'know' ? '<label class="field"><span>Replace</span><select id="kp-out" data-draft="kp-out">' + r.prospects.map((id) => '<option value="' + esc(id) + '"' + (draft('kp-out', r.prospects[0]) === id ? ' selected' : '') + '>' + esc(r.profiles[id] ? r.profiles[id].name : '') + ' (' + esc(st.pub.players.find((x) => x.id === id).name) + ')</option>').join('') + '</select></label>' +
            '<label class="field"><span>With</span><select id="kp-in" data-draft="kp-in">' + pool.map((x) => '<option value="' + esc(x.id) + '"' + (draft('kp-in', pool[0] && pool[0].id) === x.id ? ' selected' : '') + '>' + esc(x.name) + '</option>').join('') + '</select></label>' +
            (pool.length ? '<button class="btn violet" data-act="knowGo">Make the call</button>' : '<p class="muted">Nobody else has opted in as a Prospect.</p>') + ' <button class="btn ghost" data-act="chooser" data-c="">Cancel</button>'
            : '<button class="btn violet" data-act="chooser" data-c="know">Use I KNOW PEOPLE</button>') + '</section>';
      }
      return '<section class="lab-steps"><h2>Creation Lab</h2><p class="muted">Pick one card from each deck, name it, and sketch how it works.</p>' +
        '<h4>1. Item</h4><div class="hand">' + h.items.map((t, i) => card('item', 'Item', t, 'pick', i, inv.item === i)).join('') + '</div>' +
        '<h4>2. Function</h4><div class="hand">' + h.functions.map((t, i) => card('func', 'Function', t, 'pick', i, inv.func === i)).join('') + '</div>' +
        '<h4>3. Spokesperson</h4><div class="hand">' + h.spokespeople.map((t, i) => card('spokes', 'Spokesperson', t, 'pick', i, inv.spokes === i)).join('') + '</div>' +
        '<h4>4. Name it</h4><label class="field"><span>Product name</span><input id="inv-name" maxlength="40" data-draft="' + k + '-name" data-sync="name" value="' + esc(name) + '" placeholder="The Toast-o-Tron 3000" autocomplete="off"></label>' +
        '<label class="field"><span>Slogan (optional)</span><input id="inv-slogan" maxlength="90" data-draft="' + k + '-slogan" data-sync="slogan" value="' + esc(slogan) + '" placeholder="Breakfast, but smarter." autocomplete="off"></label>' +
        '<h4>5. Sketch it</h4><p class="muted">Show how it works. Talent is not judged; using the drawing in your pitch is.</p><div class="pad-host" data-keep="' + k + '-sketch" data-pad="' + k + '-sketch"></div>' +
        (p.labDone ? '<p class="ok center">Ready ✓ Waiting for the others…</p><button class="btn ghost" data-act="unready">Keep editing</button>' : '<button class="btn gold big" data-act="labDone">I’m ready</button>') + '</section>' + nepo;
    }

    function prospectLab() {
      const p = st.priv;
      const k = 'r' + st.pub.round.n;
      pad(k + '-portrait', 'portrait');
      return profileCard(p.profile, true) +
        '<section><h3>Draw your character</h3><p class="muted">A playful portrait. It goes on the big screen.</p><div class="pad-host" data-keep="' + k + '-portrait" data-pad="' + k + '-portrait"></div>' +
        (p.labDone ? '<p class="ok center">Ready ✓</p>' : '<button class="btn gold big" data-act="labDone">I’m ready</button>') + '</section>' +
        '<section><h3>Your SCREW! cards</h3><p class="muted">During the pitch you may play one of these. Choose wisely.</p><div class="screws">' + p.screws.map((c) => '<div class="screw-c"><b>' + esc(c.t) + '</b><p>' + esc(c.d) + '</p></div>').join('') + '</div></section>';
    }

    function philWait(text) {
      return '<section class="hello"><h2>' + text + '</h2><p>Watch the big screen. You’ll score the Peddler in six categories, $0–$50 each, and can reward each Prospect’s role-play up to $25.</p></section>' + scorecard(false);
    }

    function peddlerFact() {
      const v = st.pub, r = v.round, p = st.priv;
      return '<section><h2>Fact-Finding</h2><p class="muted">Ask every Prospect at least one meaningful question. Uncover a secret for <b>$25</b>.</p></section>' +
        r.prospects.map((id) => {
          const pr = r.profiles[id], s = r.secrets[id];
          return '<section class="pros-card" data-key="pf-' + esc(id) + '"><h3>' + esc(pr.name) + '</h3><ul class="facts"><li><b>Age</b> ' + esc(pr.age) + '</li><li><b>Status</b> ' + esc(pr.marital) + '</li><li><b>Kids</b> ' + esc(pr.kids) + '</li><li><b>Job</b> ' + esc(pr.job) + '</li></ul><p class="bg">' + esc(pr.background) + '</p>' +
            (s === 'confirmed' ? '<div class="secret unlocked"><span class="lbl">Secret unlocked +$25</span>' + esc(pr.secret || '') + '</div>'
              : s === 'claimed' ? '<p class="muted">Waiting for them to confirm…</p>'
                : '<label class="field"><span>' + (s === 'denied' ? 'They said no. The Host may settle it, or try again:' : 'I think their secret is…') + '</span><input id="guess-' + esc(id) + '" maxlength="100" data-draft="guess-' + esc(id) + '" value="' + esc(draft('guess-' + id, '')) + '" autocomplete="off"></label><button class="btn mint" data-act="claim" data-target="' + esc(id) + '">I found their secret</button>') +
            '</section>';
        }).join('') + daddyUse() + notes();
    }
    function notes() {
      return '<section><h3>My notes</h3><textarea id="notes" rows="4" data-draft="notes" placeholder="Things you learned. Only you can see this.">' + esc(draft('notes', '')) + '</textarea></section>';
    }
    function daddyUse() {
      const r = st.pub.round, p = st.priv;
      if (!(p.wallet.inventory.daddy > 0) || r.nepoUsed) return '';
      if (st.chooser !== 'daddy') return '<section class="nepo-use"><h3>DADDY MADE A CALL</h3><p class="muted">Make a Prospect do a brief, funny challenge.</p><button class="btn violet" data-act="chooser" data-c="daddy">Use it</button></section>';
      return '<section class="nepo-use"><h3>DADDY MADE A CALL</h3><p>Who gets the call?</p><div class="btn-col">' + r.prospects.map((id) => '<button class="btn violet" data-act="daddy" data-target="' + esc(id) + '">' + esc(r.profiles[id].name) + '</button>').join('') + '<button class="btn ghost" data-act="chooser" data-c="">Cancel</button></div></section>';
    }

    function prospectFact() {
      const p = st.priv;
      let claim = '';
      if (p.secretStatus === 'claimed') {
        claim = '<section class="claim"><h3>The Peddler says they found your secret</h3><p class="guess">“' + esc(p.claimGuess || '(they said it out loud)') + '”</p><p>Did they genuinely uncover it?</p>' +
          '<div class="btn-row"><button class="btn mint" data-act="answer" data-yes="1">Yes, they found it</button><button class="btn ghost" data-act="answer" data-yes="0">No</button></div></section>';
      }
      const found = p.secretStatus === 'confirmed';
      return claim + profileCard(p.profile, true) +
        '<section class="btn-col">' + (p.asked ? '<p class="ok">You confirmed you were questioned ✓</p>' : '<button class="btn ghost" data-act="asked">The Peddler asked me a real question</button>') +
        (found ? '<p class="ok">Your secret was discovered. The Peddler earns $25.</p>' : confirmBtn('reveal', 'They uncovered my secret', 'selfReveal', {}, 'mint')) + '</section>';
    }

    function peddlerPitch() {
      const v = st.pub, r = v.round, p = st.priv, inv = r.invention;
      let screw = '';
      if (r.activeScrew) {
        screw = '<section class="screw-live"><div class="screw-word">SCREW!</div><h3>' + esc(r.activeScrew.card.t) + '</h3><p>' + esc(r.activeScrew.card.d) + '</p><p class="muted">You have 15 seconds. The pitch clock is paused.</p>' +
          (p.wallet.inventory.notToday > 0 && !r.nepoUsed ? '<button class="btn violet big" data-act="notToday">Play NOT TODAY!</button>' : '') + '</section>';
      }
      return screw + '<section><h2>' + esc(inv.name) + '</h2>' + (inv.slogan ? '<p class="slogan">“' + esc(inv.slogan) + '”</p>' : '') +
        '<div class="hand">' + '<div class="deck deck-item"><span class="deck-k">Item</span><span class="deck-t">' + esc(inv.item) + '</span></div><div class="deck deck-func"><span class="deck-k">Function</span><span class="deck-t">' + esc(inv.func) + '</span></div><div class="deck deck-spokes"><span class="deck-k">Spokesperson</span><span class="deck-t">' + esc(inv.spokes) + '</span></div></div>' +
        '<p class="hint">Show the drawing on the big screen, connect benefits to what you learned, and make the spokesperson part of the pitch.</p>' +
        (!r.activeScrew ? confirmBtn('pdone', 'I’m done pitching', 'pitchDone', {}, 'ghost') : '') + '</section>' + daddyUse() + notes();
    }

    function prospectPitch() {
      const v = st.pub, r = v.round, p = st.priv;
      const t = v.timer.main;
      const remaining = t ? (t.running ? t.remaining - (Date.now() - st.recvAt) : t.remaining) : 0;
      if (p.screwPlayed) {
        return '<section class="screw-live"><div class="screw-word">SCREW!</div><h3>You played ' + esc(p.screwPlayed.card.t) + '</h3><p>' + esc(p.screwPlayed.card.d) + '</p>' +
          (p.screwPlayed.result ? '<p class="muted">Result: ' + esc({ done: 'nailed it', missed: 'missed it', cancelled: 'cancelled with NOT TODAY!' }[p.screwPlayed.result]) + '</p>' : '') + '</section>' + profileCard(p.profile, true);
      }
      let why = '';
      if (r.activeScrew) why = 'Another SCREW! is in progress.';
      else if (v.hostPaused) why = 'The game is paused.';
      else if (remaining <= E.SCREW_LOCKOUT_MS) why = 'Too late: no SCREW! in the final 10 seconds.';
      return '<section><h2>Your SCREW! cards</h2><p class="muted">Interrupt the pitch once with one of these. The other two are discarded.</p>' + (why ? '<p class="warn-text">' + esc(why) + '</p>' : '') +
        '<div class="screws">' + p.screws.map((c, i) => '<div class="screw-c" data-key="sc-' + i + '"><b>' + esc(c.t) + '</b><p>' + esc(c.d) + '</p>' +
          (why ? '' : confirmBtn('screw-' + i, 'Play this SCREW!', 'screw', { idx: i }, 'red')) + '</div>').join('') + '</div></section>' + profileCard(p.profile, true);
    }

    function prospectClose() {
      const p = st.priv, r = st.pub.round;
      const raised = !!r.objections[p.pid];
      return '<section><h2>Objections + Close</h2>' + (raised ? '<p class="ok">You raised your objection ✓</p>' : '<p class="muted">Raise one final objection. The Peddler has to address it and ask for the sale.</p><button class="btn red big" data-act="objection">I have an objection!</button>') + '</section>' + verdictBlock() + profileCard(p.profile, true);
    }
    function verdictBlock() {
      const p = st.priv;
      return '<section><h3>Would your character buy it?</h3><p class="muted">Revealed with the money. It doesn’t change the score.</p><div class="btn-row">' +
        '<button class="btn ' + (p.verdict === 'buy' ? 'mint' : 'ghost') + '" data-act="verdict" data-buy="1">Buy</button><button class="btn ' + (p.verdict === 'pass' ? 'red' : 'ghost') + '" data-act="verdict" data-buy="0">Pass</button></div></section>';
    }

    function scorecard(canSubmit) {
      const v = st.pub, r = v.round, p = st.priv;
      if (!r) return '';
      const k = 'sc-r' + r.n;
      const base = p.scorecard || { cats: {}, prospects: {} };
      const sc = st.drafts[k] || (st.drafts[k] = { cats: Object.assign(C.categories.reduce((o, c) => { o[c.id] = 25; return o; }, {}), base.cats), prospects: Object.assign({}, base.prospects) });
      const total = C.categories.reduce((s, c) => s + Number(sc.cats[c.id] || 0), 0);
      return '<section class="scorecard"><div class="sec-head"><h3>' + (canSubmit ? 'Your scorecard' : 'Scorecard (submit opens after the close)') + '</h3><span class="sc-total">' + U.money(total) + '<em>/ $300</em></span></div>' +
        C.categories.map((c) => '<label class="slider" data-key="sl-' + c.id + '"><span class="sl-top"><b>' + esc(c.name) + '</b><span class="sl-val">' + U.money(sc.cats[c.id]) + '</span></span><span class="muted sl-hint">' + esc(c.hint) + '</span>' +
          '<input type="range" min="0" max="50" step="5" id="sc-' + c.id + '" data-score="cats.' + c.id + '" value="' + Number(sc.cats[c.id]) + '"></label>').join('') +
        '<h4>Prospect role-play awards (optional)</h4>' + r.prospects.map((id) => '<label class="slider" data-key="slp-' + esc(id) + '"><span class="sl-top"><b>' + esc(r.profiles[id].name) + '</b><span class="sl-val">' + U.money(sc.prospects[id] || 0) + '</span></span><span class="muted sl-hint">Stayed in character, believable, answered fairly, added fun.</span>' +
          '<input type="range" min="0" max="25" step="5" id="scp-' + esc(id) + '" data-score="prospects.' + esc(id) + '" value="' + Number(sc.prospects[id] || 0) + '"></label>').join('') +
        (canSubmit ? '<button class="btn gold big" data-act="submitScore">' + (p.scorecard ? 'Update my scorecard' : 'Submit scorecard') + '</button>' + (p.scorecard ? '<p class="ok center">Submitted ✓ You can change it until the reveal.</p>' : '') : '') + '</section>';
    }

    function revealScreen() {
      const v = st.pub, p = st.priv, r = v.round;
      const mine = p.myEarnings;
      let hof = '';
      if (p.role === 'peddler' || p.role === 'prospect') {
        hof = '<section><h3>Hall of Fame</h3><p class="muted">Feature your ' + (p.role === 'peddler' ? 'invention and sketch' : 'character portrait') + ' in the Host’s Hall of Fame?</p><div class="btn-row">' +
          '<button class="btn ' + (p.hofChoice === true ? 'mint' : 'ghost') + '" data-act="hof" data-yes="1">Yes, feature it</button><button class="btn ' + (p.hofChoice === false ? 'red' : 'ghost') + '" data-act="hof" data-yes="0">No thanks</button></div></section>';
      }
      return '<section class="hello">' + (mine != null ? '<span class="eyebrow">You earned this round</span><div class="price-tag big-tag"><b>' + U.money2(mine) + '</b></div>' : '<h2>Money reveal</h2>') +
        '<p>Tonight so far: <b>' + U.money2(p.earned) + '</b></p></section>' + hof + shop() + wallet();
    }

    function finalScreen() {
      const v = st.pub, p = st.priv;
      const rank = v.standings.findIndex((x) => x.id === p.pid) + 1;
      const me = v.standings.find((x) => x.id === p.pid);
      return '<section class="hello"><span class="eyebrow">Final results</span><h2>' + (me && me.winner ? 'You’re the session champion!' : 'You finished #' + rank) + '</h2><div class="price-tag big-tag"><b>' + U.money2(p.earned) + '</b></div><p class="muted">Your cash and Power Cards are saved on this device for next time.</p></section>' + shop() + wallet();
    }

    function body() {
      const v = st.pub, p = st.priv;
      if (!v || !p) return '<section class="hello"><h2>Connecting…</h2></section>';
      if (p.removed) return '<section class="hello"><h2>You’re not in this game</h2><p>' + esc(p.error || 'The Host removed you from the room.') + '</p><button class="btn gold" data-act="leave">Back</button></section>';
      const ph = v.phase, role = p.role;
      if (ph === 'lobby') return lobbyScreen();
      if (ph === 'roles') return rolesScreen();
      if (ph === 'reveal') return revealScreen();
      if (ph === 'final') return finalScreen();
      if (role === 'sitout' || !role) return '<section class="hello"><h2>Sitting out this round</h2><p>Enjoy the show. You’ll be in the next one.</p></section>';
      if (ph === 'lab') return role === 'peddler' ? peddlerLab() : role === 'prospect' ? prospectLab() : philWait(esc((st.pub.players.find((x) => x.id === st.pub.round.peddler) || { name: 'The Peddler' }).name) + ' is inventing…');
      if (ph === 'fact') return role === 'peddler' ? peddlerFact() : role === 'prospect' ? prospectFact() : philWait('Fact-Finding');
      if (ph === 'pitch') return role === 'peddler' ? peddlerPitch() : role === 'prospect' ? prospectPitch() : philWait('PITCH!');
      if (ph === 'close') return role === 'peddler' ? '<section class="hello"><h2>Objections + Close</h2><p>Answer every objection directly, then clearly <b>ask for the sale</b>.</p></section>' + notes()
        : role === 'prospect' ? prospectClose() : philWait('Objections + Close');
      if (ph === 'scoring') return role === 'phil' ? scorecard(true) : role === 'prospect' ? '<section class="hello"><h2>The Philanthropists are scoring</h2></section>' + (p.verdict ? '' : verdictBlock())
        : '<section class="hello"><h2>The Philanthropists are deciding your fate</h2><p>Sit tight.</p></section>';
      return '';
    }

    function render() {
      U.morph(root, '<div class="phone">' + header() + banners() + '<main class="ph-body" data-key="pb-' + (st.pub ? st.pub.phase + '-' + (st.priv && st.priv.role) : 'x') + '">' + body() + '</main></div>');
      mountPads();
    }

    // ---------- updates from the Host ----------
    function onPublic(v, at) {
      const prev = st.pub;
      st.pub = v; st.recvAt = at || Date.now();
      if (prev && prev.phase !== v.phase) {
        // leaving the lab: send any unsent drawing right away
        if (prev.phase === 'lab') Object.keys(st.pads).forEach(sendDrawing);
        st.confirm = null; st.chooser = null;
        if (st.priv && st.priv.role && v.phase !== 'scoring') U.vibrate(60);
      }
      const sc = v.round && v.round.activeScrew;
      if (sc && !(prev && prev.round && prev.round.activeScrew) && st.priv && st.priv.role === 'peddler') U.vibrate([80, 60, 80]);
      render();
    }
    function onPrivate(p) {
      const prev = st.priv;
      st.priv = p;
      if (p.lastError && p.lastError.at !== st.lastErr) {
        if (st.lastErr) U.toast(p.lastError.error, 'warn');
        st.lastErr = p.lastError.at;
      }
      if (opts.profile && p.wallet && !p.removed) {
        opts.profile.wallet = p.wallet; opts.profile.name = p.name;
        // save this round's invention to the player's own collection
        if (st.pub && st.pub.phase === 'reveal' && p.role === 'peddler' && st.pub.round && st.pub.round.invention && !st.sent['coll-' + st.pub.round.n]) {
          const inv = st.pub.round.invention, pd = st.pads['r' + st.pub.round.n + '-sketch'];
          st.sent['coll-' + st.pub.round.n] = true;
          opts.profile.inventions.unshift({ name: inv.name, slogan: inv.slogan, item: inv.item, func: inv.func, spokes: inv.spokes, earned: p.myEarnings || 0, date: Date.now(), image: pd && !pd.isEmpty() ? pd.export() : null });
          opts.profile.inventions = opts.profile.inventions.slice(0, 30);
        }
        opts.onProfile && opts.onProfile(opts.profile);
      }
      if (prev && !prev.role && p.role) U.vibrate(80);
      render();
    }

    // ---------- events ----------
    let syncTimer = null;
    root.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.score) {
        const k = 'sc-r' + st.pub.round.n;
        const [grp, id] = el.dataset.score.split('.');
        st.drafts[k][grp][id] = Number(el.value);
        render();
        return;
      }
      if (el.dataset.draft) st.drafts[el.dataset.draft] = el.value;
      if (el.dataset.sync) {
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
          const k = 'r' + st.pub.round.n;
          send({ type: 'invention', name: draft(k + '-name', ''), slogan: draft(k + '-slogan', '') });
        }, 500);
      }
    });
    root.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.draft) st.drafts[el.dataset.draft] = el.value;
      if (el.dataset.act === 'pref') {
        const prefs = Object.assign({}, st.priv.prefs, { [el.dataset.role]: el.checked });
        if (opts.profile) { opts.profile.prefs = prefs; opts.onProfile && opts.onProfile(opts.profile); }
        send({ type: 'prefs', prefs });
      }
    });
    root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-act]');
      if (!el || !root.contains(el) || el.tagName === 'INPUT') return;
      const d = el.dataset, a = d.act;
      const r = st.pub && st.pub.round;
      if (a === 'ask') st.confirm = d.ck;
      else if (a === 'cancel') st.confirm = null;
      else if (a === 'chooser') st.chooser = d.c || null;
      else if (a === 'pick') {
        const field = { item: 'item', func: 'func', spokes: 'spokes' }[d.deck];
        st.priv.invention[field] = Number(d.idx); // optimistic
        send({ type: 'invention', [field]: Number(d.idx) });
      } else if (a === 'labDone') {
        Object.keys(st.pads).forEach((k) => { if (st.pads[k].dirty) sendDrawing(k); });
        if (st.priv.role === 'peddler') {
          const k = 'r' + r.n;
          send({ type: 'invention', name: draft(k + '-name', st.priv.invention.name || ''), slogan: draft(k + '-slogan', st.priv.invention.slogan || '') });
        }
        send({ type: 'labDone' });
      } else if (a === 'unready') send({ type: 'labDone', done: false });
      else if (a === 'knowGo') { send({ type: 'nepo', card: 'knowPeople', target: draft('kp-out', r.prospects[0]), replacement: draft('kp-in', (root.querySelector('#kp-in') || {}).value) }); st.chooser = null; }
      else if (a === 'daddy') { send({ type: 'nepo', card: 'daddy', target: d.target }); st.chooser = null; }
      else if (a === 'notToday') send({ type: 'nepo', card: 'notToday' });
      else if (a === 'claim') send({ type: 'secretClaim', target: d.target, guess: draft('guess-' + d.target, '') });
      else if (a === 'answer') send({ type: 'secretAnswer', yes: d.yes === '1' });
      else if (a === 'selfReveal') { send({ type: 'secretAnswer', yes: true }); st.confirm = null; }
      else if (a === 'asked') send({ type: 'asked' });
      else if (a === 'screw') { send({ type: 'screw', idx: Number(d.idx) }); st.confirm = null; U.vibrate(100); }
      else if (a === 'pitchDone') { send({ type: 'pitchDone' }); st.confirm = null; }
      else if (a === 'objection') send({ type: 'objection' });
      else if (a === 'verdict') { st.priv.verdict = d.buy === '1' ? 'buy' : 'pass'; send({ type: 'verdict', buy: d.buy === '1' }); }
      else if (a === 'submitScore') { const k = 'sc-r' + r.n; send({ type: 'scorecard', cats: st.drafts[k].cats, prospects: st.drafts[k].prospects }); U.toast('Scorecard sent'); }
      else if (a === 'hof') send({ type: 'hof', yes: d.yes === '1' });
      else if (a === 'volunteer') send({ type: 'volunteer', role: d.role });
      else if (a === 'buy') { send({ type: 'buy', card: d.card }); st.confirm = null; }
      else if (a === 'leave') { opts.onLeave && opts.onLeave(); return; }
      render();
    });

    return {
      public: onPublic, private: onPrivate,
      asset: (id, data) => { st.assets[id] = data; },
      host: (on) => { st.host = on; render(); },
      connection: (c) => { st.conn = c; render(); },
      render,
      state: st
    };
  }

  P.phone = { create };
})(window.PITCH = window.PITCH || {});
