/* P!TCH game engine.
 * Runs only on the Host (TV) device. Phones send actions; the engine applies the
 * rulebook, then publishes a public view (everyone) and a private view (one player).
 * Nothing in here touches the DOM, so it can be tested in Node. */
(function (P) {
  const C = P.content;
  const E = (P.engine = {});

  E.ROLES = ['peddler', 'prospect', 'phil'];
  E.ROLE_NAMES = { peddler: 'Peddler', prospect: 'Prospect', phil: 'Philanthropist', sitout: 'Sitting out' };
  E.DEFAULT_SETTINGS = {
    timers: { brief: 45, lab: 120, fact: 150, pitch: 90, close: 45, screw: 15 }, // seconds (rulebook section 5; brief = role briefing)
    maxProspects: 3,  // Host may reduce to 1 or 2
    rounds: 0,        // 0 = keep going until everyone who wants to has pitched once
    autoAdvance: true, // move on automatically when a timer runs out or everyone is done
    sleuth: true,     // Secret Sleuth: Philanthropists pick hidden secrets for bonus money
    trimOutliers: true, // set aside a scorecard that is dramatically out of line (4+ scorecards)
    briefing: true,     // Role briefing at the start of each round (veterans can turn it off)
    awards: true        // End-of-night awards vote before the final results
  };
  E.SECRET_BONUS = 25;
  E.SLEUTH_BONUS = 10; // Secret Sleuth: per hidden secret a Philanthropist picks correctly
  E.SLEUTH_OPTIONS = 4; // the real secret plus 3 decoys
  E.CATEGORY_MAX = 50;
  E.PROSPECT_AWARD_MAX = 25;
  E.SCREW_LOCKOUT_MS = 10000; // no SCREW! in the final 10 seconds of the pitch
  E.MIN_PLAYERS = 3;
  E.COLORS = ['#F2B544', '#5EC8F2', '#7EE08A', '#FF7A6B', '#C99BFF', '#FF9F43', '#4FD1C5', '#F78FB3',
    '#A3E048', '#6C9BFF', '#FFD166', '#E07AFF', '#3DDC97', '#FF6F91', '#8FD3FF', '#FFB4A2',
    '#B8F2E6', '#F9C80E', '#9EE493', '#FFA69E'];

  const TIMED_PHASES = { brief: 'brief', lab: 'lab', fact: 'fact', pitch: 'pitch', close: 'close' };
  const NEXT_PHASE = { brief: 'lab', lab: 'fact', fact: 'pitch', pitch: 'close', close: 'scoring' };

  const round2 = (x) => Math.round(x * 100) / 100;
  const clampInt = (v, lo, hi) => { v = Math.round(Number(v) || 0); return Math.max(lo, Math.min(hi, v)); };
  const str = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  /** Rulebook section 9 + 10. Pure function, unit-tested.
   *  scorecards: [{cats:{invention:..}, prospects:{pid: amount}}]
   *  Returns base (average scorecard total), bonus ($25 per confirmed secret), total, per-category averages,
   *  and each Prospect's role-play award (average of the Philanthropists' awards). */
  /** House rule: with 4+ scorecards, set aside the lowest and/or highest scorecard if it is DRAMATICALLY
   *  out of line: more than $100 (a third of the $300 maximum) away from the middle (median) scorecard.
   *  At most one low and one high card are set aside. Returns indexes into `totals`. */
  E.OUTLIER_MIN_CARDS = 4;
  E.OUTLIER_GAP = 100;
  E.findOutliers = function (totals) {
    const out = { low: null, high: null, median: null };
    if (totals.length < E.OUTLIER_MIN_CARDS) return out;
    const sorted = totals.slice().sort((a, b) => a - b);
    const m = sorted.length;
    const median = m % 2 ? sorted[(m - 1) / 2] : (sorted[m / 2 - 1] + sorted[m / 2]) / 2;
    out.median = median;
    const lo = Math.min.apply(null, totals), hi = Math.max.apply(null, totals);
    if (median - lo > E.OUTLIER_GAP) out.low = totals.indexOf(lo);
    if (hi - median > E.OUTLIER_GAP) out.high = totals.indexOf(hi);
    return out;
  };

  /** Rulebook section 9 + 10. Pure function, unit-tested.
   *  scorecards: [{cats:{invention:..}, prospects:{pid: amount}}]
   *  Returns base (average scorecard total), bonus ($25 per confirmed secret), total, per-category averages,
   *  and each Prospect's role-play award (average of the Philanthropists' awards).
   *  opts.trim: set aside dramatic outliers (see findOutliers); the averages use the remaining scorecards. */
  E.computeEarnings = function (scorecards, secretsConfirmed, prospectIds, opts) {
    const totalOf = (sc) => C.categories.reduce((s, c) => s + clampInt(sc.cats[c.id], 0, E.CATEGORY_MAX), 0);
    const allTotals = scorecards.map(totalOf);
    const setAside = [];
    let kept = scorecards;
    if (opts && opts.trim) {
      const o = E.findOutliers(allTotals);
      const drop = [o.low, o.high].filter((i) => i !== null);
      if (drop.length) {
        kept = scorecards.filter((_, i) => drop.indexOf(i) < 0);
        if (o.low !== null) setAside.push({ side: 'low', total: allTotals[o.low] });
        if (o.high !== null) setAside.push({ side: 'high', total: allTotals[o.high] });
      }
    }
    const n = kept.length;
    const catAvg = {};
    C.categories.forEach((c) => {
      catAvg[c.id] = n ? round2(kept.reduce((s, sc) => s + clampInt(sc.cats[c.id], 0, E.CATEGORY_MAX), 0) / n) : 0;
    });
    const totals = kept.map(totalOf);
    const base = n ? round2(totals.reduce((a, b) => a + b, 0) / n) : 0;
    const bonus = E.SECRET_BONUS * secretsConfirmed;
    const prospectAwards = {};
    (prospectIds || []).forEach((pid) => {
      prospectAwards[pid] = n ? round2(kept.reduce((s, sc) => s + clampInt((sc.prospects || {})[pid], 0, E.PROSPECT_AWARD_MAX), 0) / n) : 0;
    });
    return { scorecards: n, submitted: scorecards.length, setAside, totals, catAvg, base, bonus, secrets: secretsConfirmed, total: round2(base + bonus), prospectAwards };
  };

  /** Default Prospect count from the rulebook table: 3 players -> 1, 4 -> 2, 5+ -> 3. */
  E.defaultProspects = (n) => (n <= 3 ? 1 : n === 4 ? 2 : 3);

  function emptyWallet() { return { career: 0, cash: 0, inventory: { notToday: 0, knowPeople: 0, daddy: 0, insider: 0 } }; }
  function cleanWallet(w) {
    const out = emptyWallet();
    if (!w || typeof w !== 'object') return out;
    out.career = Math.max(0, round2(Number(w.career) || 0));
    out.cash = Math.max(0, Math.min(out.career, round2(Number(w.cash) || 0)));
    const inv = w.inventory || {};
    Object.keys(out.inventory).forEach((k) => { out.inventory[k] = clampInt(inv[k], 0, 99); });
    return out;
  }

  class Game {
    constructor(opts) {
      opts = opts || {};
      this.now = opts.now || (() => Date.now());
      this.rand = opts.rand || Math.random;
      this.listeners = { change: [], asset: [] };
      this.assets = {}; // id -> data URL
      if (opts.saved) {
        this.s = opts.saved.state;
        this.assets = opts.saved.assets || {};
        if (this.s.settings.sleuth === undefined) this.s.settings.sleuth = true;
        if (this.s.settings.trimOutliers === undefined) this.s.settings.trimOutliers = true;
        if (this.s.settings.briefing === undefined) this.s.settings.briefing = true;
        if (this.s.settings.awards === undefined) this.s.settings.awards = true;
        if (this.s.settings.timers.brief === undefined) this.s.settings.timers.brief = 45;
        // timers were frozen when saved; leave them paused so the Host can resume
        this.s.hostPaused = this.s.timer && this.s.timer.main ? true : this.s.hostPaused;
        Object.values(this.s.players).forEach((p) => { p.connected = false; });
      } else {
        this.s = {
          v: 1,
          code: opts.code || 'TEST',
          createdAt: this.now(),
          settings: clone(Object.assign({}, E.DEFAULT_SETTINGS, opts.settings || {})),
          players: {},
          order: [],
          banned: {},
          phase: 'lobby',
          proposal: null,
          need: null,
          round: null,
          roundNo: 0,
          timer: { main: null, screw: null },
          hostPaused: false,
          expired: false,
          history: [],
          feed: [],
          feedSeq: 0,
          used: { items: [], functions: [], secrets: [], screws: [] }
        };
      }
    }

    on(ev, fn) { this.listeners[ev].push(fn); }
    emit(ev, ...args) { this.listeners[ev].forEach((fn) => fn(...args)); }
    changed() { this.emit('change'); }
    serialize() { return { state: this.freezeTimersCopy(), assets: this.assets }; }
    freezeTimersCopy() {
      const s = clone(this.s);
      ['main', 'screw'].forEach((k) => {
        const t = s.timer[k];
        if (t && t.endsAt) { t.remaining = Math.max(0, t.endsAt - this.now()); t.endsAt = null; }
      });
      return s;
    }

    log(kind, text, extra) {
      this.s.feedSeq += 1;
      this.s.feed.push(Object.assign({ id: this.s.feedSeq, at: this.now(), kind, text }, extra || {}));
      if (this.s.feed.length > 25) this.s.feed.shift();
    }

    // ---------- randomness helpers ----------
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    pick(arr) { return arr[Math.floor(this.rand() * arr.length)]; }
    /** Draw n distinct entries from a deck, avoiding ones used earlier in this session until the deck runs low. */
    draw(deckName, deck, n, key) {
      key = key || ((x) => (typeof x === 'string' ? x : x.t));
      let used = this.s.used[deckName];
      let pool = deck.filter((c) => used.indexOf(key(c)) < 0);
      if (pool.length < n) { used = this.s.used[deckName] = []; pool = deck.slice(); }
      const out = this.shuffle(pool).slice(0, n);
      out.forEach((c) => used.push(key(c)));
      return out;
    }

    // ---------- timers ----------
    remaining(t) { if (!t) return 0; return t.endsAt ? Math.max(0, t.endsAt - this.now()) : t.remaining; }
    pauseT(t) { if (t && t.endsAt) { t.remaining = Math.max(0, t.endsAt - this.now()); t.endsAt = null; } }
    startT(t) { if (t && !t.endsAt && t.remaining > 0) t.endsAt = this.now() + t.remaining; }
    newTimer(sec) { const ms = Math.max(5, sec) * 1000; return { total: ms, remaining: ms, endsAt: this.s.hostPaused ? null : this.now() + ms }; }

    /** Call a few times per second. Returns true if anything changed. */
    tick() {
      const s = this.s;
      if (s.hostPaused) return false;
      const sc = s.timer.screw;
      if (sc && this.remaining(sc) <= 0) { this.endScrew(null); this.changed(); return true; }
      const m = s.timer.main;
      if (m && m.endsAt && this.remaining(m) <= 0 && !s.expired && !sc) {
        s.expired = true;
        m.remaining = 0; m.endsAt = null;
        this.log('time', "Time's up!");
        if (s.settings.autoAdvance) this.advance();
        this.changed();
        return true;
      }
      return false;
    }

    // ---------- players ----------
    activePlayers() { return this.s.order.map((id) => this.s.players[id]).filter((p) => p && p.connected); }
    eligible(p, role) { return !!p && !p.excluded[role] && (!!p.prefs[role] || p.volunteer === role); }
    roleOf(pid) {
      const r = this.s.round;
      if (!r) return null;
      if (r.peddler === pid) return 'peddler';
      if (r.prospects.indexOf(pid) >= 0) return 'prospect';
      if (r.phils.indexOf(pid) >= 0) return 'phil';
      if (this.s.players[pid]) return 'sitout';
      return null;
    }

    join(a) {
      const s = this.s;
      const pid = str(a.pid, 40);
      if (!pid || s.banned[pid]) return { ok: false, error: 'You were removed from this room.' };
      let p = s.players[pid];
      if (p) {
        if (p.token && a.token && p.token !== a.token) return { ok: false, error: 'That player slot is taken.' };
        p.connected = true; p.lastSeen = this.now();
        if (!p.wasHere) { p.wasHere = true; }
        this.log('join', p.name + ' is back.');
      } else {
        if (Object.keys(s.players).length >= 40) return { ok: false, error: 'This room is full (40 players).' };
        let name = str(a.name, 16) || 'Player';
        const taken = (n) => Object.values(s.players).some((q) => q.name.toLowerCase() === n.toLowerCase());
        if (taken(name)) { let i = 2; while (taken(name + ' ' + i)) i++; name = name + ' ' + i; }
        const used = Object.values(s.players).map((q) => q.color);
        const color = E.COLORS.find((c) => used.indexOf(c) < 0) || this.pick(E.COLORS);
        p = s.players[pid] = {
          id: pid, token: str(a.token, 64), name, color,
          prefs: { peddler: true, prospect: true, phil: true },
          excluded: { peddler: false, prospect: false, phil: false },
          connected: true, lastSeen: this.now(), joinedAt: this.now(), volunteer: null,
          wallet: cleanWallet(a.wallet),
          session: { earned: 0, peddler: 0, prospect: 0, phil: 0 },
          ackSeq: 0, hof: {}
        };
        s.order.push(pid);
        this.log('join', name + ' joined.');
      }
      if (a.prefs) this.setPrefs(p, a.prefs);
      if (s.phase === 'roles') this.ensureProposal();
      return { ok: true };
    }

    setPrefs(p, prefs) {
      E.ROLES.forEach((r) => { if (typeof prefs[r] === 'boolean') p.prefs[r] = prefs[r]; });
    }

    disconnect(pid) {
      const p = this.s.players[pid];
      if (!p || !p.connected) return;
      p.connected = false;
      this.log('leave', p.name + ' disconnected.');
      if (this.s.phase === 'roles') this.ensureProposal();
      this.checkAllDone();
    }

    // ---------- role assignment (rulebook section 3) ----------
    /** Fair randomizer: whoever has pitched least goes next; Prospect turns rotate the same way.
     *  Never assigns a role a player opted out of. If no valid round exists, asks for a volunteer. */
    proposeRoles() {
      const s = this.s;
      s.need = null;
      const active = this.activePlayers();
      if (active.length < E.MIN_PLAYERS) { s.proposal = null; s.need = { role: 'players', count: E.MIN_PLAYERS - active.length }; return; }
      const byLeast = (arr, field) => this.shuffle(arr).sort((a, b) => a.session[field] - b.session[field]);
      const peddlers = byLeast(active.filter((p) => this.eligible(p, 'peddler')), 'peddler');
      // Prefer someone who can be the Peddler while still leaving a valid table.
      let chosen = null;
      for (const cand of peddlers) {
        const rest = active.filter((p) => p !== cand);
        const phils = rest.filter((p) => this.eligible(p, 'phil'));
        const pros = rest.filter((p) => this.eligible(p, 'prospect'));
        if (phils.length >= 1 && pros.length >= 1 && (phils.length + pros.length > 1 || phils[0] !== pros[0]) && this.canSplit(rest)) { chosen = cand; break; }
      }
      if (!peddlers.length) { s.proposal = null; s.need = { role: 'peddler' }; return; }
      if (!chosen) {
        const rest = active.filter((p) => p !== peddlers[0]);
        const anyPhil = rest.some((p) => this.eligible(p, 'phil'));
        s.proposal = null; s.need = { role: anyPhil ? 'prospect' : 'phil' };
        return;
      }
      const rest = active.filter((p) => p !== chosen);
      const want = Math.min(E.defaultProspects(active.length), s.settings.maxProspects, rest.length - 1);
      const prospects = [];
      let philLeft = rest.filter((p) => this.eligible(p, 'phil')).length;
      for (const cand of byLeast(rest.filter((p) => this.eligible(p, 'prospect')), 'prospect')) {
        if (prospects.length >= want) break;
        const isPhil = this.eligible(cand, 'phil');
        if (isPhil && philLeft <= 1) continue; // keep at least one Philanthropist
        prospects.push(cand);
        if (isPhil) philLeft -= 1;
      }
      const left = rest.filter((p) => prospects.indexOf(p) < 0);
      s.proposal = {
        peddler: chosen.id,
        prospects: prospects.map((p) => p.id),
        phils: left.filter((p) => this.eligible(p, 'phil')).map((p) => p.id),
        sitOut: left.filter((p) => !this.eligible(p, 'phil')).map((p) => p.id)
      };
    }
    canSplit(rest) {
      // need >=1 prospect and >=1 phil drawn from different people
      const pros = rest.filter((p) => this.eligible(p, 'prospect'));
      const phils = rest.filter((p) => this.eligible(p, 'phil'));
      for (const a of pros) for (const b of phils) if (a !== b) return true;
      return false;
    }
    validateProposal(pr) {
      const s = this.s;
      if (!pr) return 'Not enough eligible players yet.';
      const live = (id) => s.players[id] && s.players[id].connected;
      if (!live(pr.peddler) || !this.eligible(s.players[pr.peddler], 'peddler')) return 'Choose a Peddler.';
      if (pr.prospects.length < 1 || pr.prospects.length > 3) return 'You need 1 to 3 Prospects.';
      if (pr.prospects.some((id) => !live(id) || !this.eligible(s.players[id], 'prospect'))) return 'A Prospect is not available.';
      if (pr.phils.filter(live).length < 1) return 'You need at least one Philanthropist.';
      return null;
    }
    ensureProposal() {
      const s = this.s;
      if (s.phase !== 'roles') return;
      // keep the Host's arrangement if it is still valid; add newcomers as Philanthropists
      if (s.proposal && !this.validateProposal(s.proposal)) {
        const pr = s.proposal;
        const placed = [pr.peddler].concat(pr.prospects, pr.phils, pr.sitOut);
        this.activePlayers().forEach((p) => {
          if (placed.indexOf(p.id) < 0) (this.eligible(p, 'phil') ? pr.phils : pr.sitOut).push(p.id);
        });
        pr.phils = pr.phils.filter((id) => s.players[id] && s.players[id].connected && this.eligible(s.players[id], 'phil'));
        pr.sitOut = this.activePlayers().map((p) => p.id).filter((id) => id !== pr.peddler && pr.prospects.indexOf(id) < 0 && pr.phils.indexOf(id) < 0);
        s.need = null;
        return;
      }
      this.proposeRoles();
    }
    /** Host taps a player to move them to a different role for the coming round. */
    setRole(pid, role) {
      const s = this.s;
      const p = s.players[pid];
      if (!p || !p.connected) return { ok: false, error: 'That player is not connected.' };
      if (role !== 'sitout' && !this.eligible(p, role)) return { ok: false, error: p.name + ' opted out of being a ' + E.ROLE_NAMES[role] + '.' };
      let pr = s.proposal;
      if (!pr) pr = s.proposal = { peddler: null, prospects: [], phils: [], sitOut: this.activePlayers().map((q) => q.id) };
      const strip = (id) => {
        if (pr.peddler === id) pr.peddler = null;
        pr.prospects = pr.prospects.filter((x) => x !== id);
        pr.phils = pr.phils.filter((x) => x !== id);
        pr.sitOut = pr.sitOut.filter((x) => x !== id);
      };
      strip(pid);
      if (role === 'peddler') {
        const old = pr.peddler;
        if (old) { strip(old); (this.eligible(s.players[old], 'phil') ? pr.phils : pr.sitOut).push(old); }
        pr.peddler = pid;
      } else if (role === 'prospect') {
        if (pr.prospects.length >= 3) { const bump = pr.prospects.shift(); (this.eligible(s.players[bump], 'phil') ? pr.phils : pr.sitOut).push(bump); }
        pr.prospects.push(pid);
      } else if (role === 'phil') pr.phils.push(pid);
      else pr.sitOut.push(pid);
      s.need = null;
      return { ok: true };
    }

    // ---------- round lifecycle ----------
    /** One fun fact + secret, never repeating a fun fact already used by another Prospect this round,
     *  and avoiding secrets used earlier in the session until the pool runs low. */
    drawSecret(takenTopics) {
      const used = this.s.used.secrets;
      let pool = C.secrets.filter((x) => used.indexOf(x.text) < 0 && takenTopics.indexOf(x.topic) < 0);
      if (!pool.length) { this.s.used.secrets = []; pool = C.secrets.filter((x) => takenTopics.indexOf(x.topic) < 0); }
      if (!pool.length) pool = C.secrets.slice();
      const pick = this.pick(pool);
      this.s.used.secrets.push(pick.text);
      takenTopics.push(pick.topic);
      return pick;
    }

    makeProfile(takenNames, takenTopics) {
      let name;
      for (let i = 0; i < 20; i++) {
        name = this.pick(C.firstNames) + ' ' + this.pick(C.lastNames);
        if (takenNames.indexOf(name) < 0) break;
      }
      takenNames.push(name);
      const sec = this.drawSecret(takenTopics || []);
      const marital = this.pick(C.marital);
      return {
        name,
        age: 21 + Math.floor(this.rand() * 64),
        marital,
        kids: Math.floor(this.rand() * this.rand() * 6),
        job: this.pick(C.occupations),
        background: sec.fact,
        secret: sec.text,
        secretTopic: sec.topic,
        secretHints: sec.hints
      };
    }

    beginRound() {
      const s = this.s;
      const err = this.validateProposal(s.proposal);
      if (err) return { ok: false, error: err };
      const pr = s.proposal;
      s.roundNo += 1;
      const hand = {
        items: this.draw('items', C.items, 3),
        functions: this.draw('functions', C.functions, 3)
      };
      const taken = [], takenTopics = [];
      const profiles = {}, screwHands = {}, secrets = {};
      pr.prospects.forEach((id) => {
        profiles[id] = this.makeProfile(taken, takenTopics);
        screwHands[id] = this.draw('screws', C.screws, 3);
        secrets[id] = 'hidden';
      });
      s.round = {
        n: s.roundNo,
        peddler: pr.peddler,
        prospects: pr.prospects.slice(),
        phils: pr.phils.filter((id) => s.players[id] && s.players[id].connected),
        sitOut: this.activePlayers().map((p) => p.id).filter((id) => id !== pr.peddler && pr.prospects.indexOf(id) < 0 && pr.phils.indexOf(id) < 0),
        hand,
        invention: { item: null, func: null, name: '', slogan: '', sketch: null },
        profiles, screwHands, secrets,
        claims: {},
        portraits: {},
        labDone: {},
        briefed: {},
        screwPlayed: {},
        screwVotes: {},
        activeScrew: null,
        objections: {},
        verdicts: {},
        nepoUsed: null,
        daddy: null,
        scorecards: {},
        results: null,
        hof: {}
      };
      s.players[pr.peddler].session.peddler += 1;
      pr.prospects.forEach((id) => { s.players[id].session.prospect += 1; });
      s.round.phils.forEach((id) => { s.players[id].session.phil += 1; });
      s.proposal = null;
      s.need = null;
      this.log('round', 'Round ' + s.roundNo + ': ' + s.players[pr.peddler].name + ' is the Peddler!');
      this.enterPhase(s.settings.briefing ? 'brief' : 'lab');
      return { ok: true };
    }

    enterPhase(phase) {
      const s = this.s;
      s.phase = phase;
      s.expired = false;
      s.timer.screw = null;
      if (s.round) { s.round.activeScrew = null; if (phase !== 'fact' && phase !== 'pitch' && phase !== 'close') s.round.daddy = null; }
      if (s.round && phase !== 'pitch') this.closeScrewVotes();
      s.timer.main = TIMED_PHASES[phase] ? this.newTimer(s.settings.timers[TIMED_PHASES[phase]]) : null;
      if (phase === 'fact') { this.finalizeInvention(); this.setupSleuth(); }
      if (phase === 'scoring') this.checkAllDone();
    }

    /** Secret Sleuth (house rule): during Fact-Finding, each Philanthropist sees 4 possible secrets
     *  for every Prospect and picks one while listening. A pick locks once that secret is uncovered. */
    setupSleuth() {
      const s = this.s, r = s.round;
      if (!r) return;
      r.sleuth = null;
      r.sleuthPicks = {};
      r.insider = null;
      if (!s.settings.sleuth) return;
      const targets = r.prospects.slice();
      const roundSecrets = r.prospects.map((id) => r.profiles[id].secret);
      const options = {}, answer = {};
      targets.forEach((id) => {
        const real = r.profiles[id].secret;
        // two decoys from the same fun fact (rewards listening to the details) + one from another fun fact
        const topic = r.profiles[id].secretTopic;
        const free = C.secrets.filter((x) => roundSecrets.indexOf(x.text) < 0 && x.text !== real);
        const same = this.shuffle(free.filter((x) => x.topic === topic)).slice(0, 2);
        const other = this.shuffle(free.filter((x) => x.topic !== topic && same.indexOf(x) < 0));
        const decoys = same.concat(other).slice(0, E.SLEUTH_OPTIONS - 1).map((x) => x.text);
        options[id] = this.shuffle([real].concat(decoys));
        answer[id] = options[id].indexOf(real);
      });
      r.sleuth = { targets, options, answer };
    }

    finalizeInvention() {
      const r = this.s.round;
      const inv = r.invention;
      if (inv.item == null) inv.item = 0;
      if (inv.func == null) inv.func = 0;
      if (!inv.name) inv.name = 'The ' + r.hand.items[inv.item] + '-Matic';
    }

    /** Move to the next phase (Host "Next" button, auto-advance, or everyone done). */
    advance() {
      const s = this.s;
      if (s.timer.screw) this.endScrew(null);
      const nxt = NEXT_PHASE[s.phase];
      if (nxt) { this.enterPhase(nxt); return { ok: true }; }
      if (s.phase === 'scoring') return this.reveal();
      return { ok: false, error: 'Nothing to advance.' };
    }

    checkAllDone() {
      const s = this.s, r = s.round;
      if (!r || !s.settings.autoAdvance) return;
      if (s.phase === 'brief') {
        const need = [r.peddler].concat(r.prospects, r.phils).filter((id) => s.players[id] && s.players[id].connected);
        if (need.length && need.every((id) => r.briefed[id])) { this.log('info', 'Everyone is ready. Creation Lab!'); this.enterPhase('lab'); }
      } else if (s.phase === 'lab') {
        const need = [r.peddler].concat(r.prospects).filter((id) => s.players[id].connected);
        if (need.length && need.every((id) => r.labDone[id])) { this.log('info', 'Everyone is ready.'); this.enterPhase('fact'); }
      } else if (s.phase === 'scoring') {
        const need = r.phils.filter((id) => s.players[id] && s.players[id].connected);
        if (need.length && need.every((id) => r.scorecards[id])) this.reveal();
      }
    }

    reveal() {
      const s = this.s, r = s.round;
      if (!r || s.phase !== 'scoring') return { ok: false, error: 'Scoring is not open.' };
      const cards = r.phils.map((id) => r.scorecards[id]).filter(Boolean);
      const confirmed = r.prospects.filter((id) => r.secrets[id] === 'confirmed').length;
      const res = E.computeEarnings(cards, confirmed, r.prospects, { trim: s.settings.trimOutliers });
      r.results = res;
      const pay = (pid, amt) => {
        const p = s.players[pid];
        if (!p) return;
        p.session.earned = round2(p.session.earned + amt);
        p.wallet.career = round2(p.wallet.career + amt);
        p.wallet.cash = round2(p.wallet.cash + amt);
      };
      pay(r.peddler, res.total);
      r.prospects.forEach((id) => pay(id, res.prospectAwards[id]));
      // Secret Sleuth payouts: every pick made during Fact-Finding counts, even if the Peddler found that secret later.
      if (r.sleuth) {
        const targets = r.sleuth.targets;
        const byPhil = {}, byTarget = {};
        targets.forEach((id) => { byTarget[id] = { right: 0, of: 0 }; });
        r.phils.forEach((pid) => {
          const picks = (r.sleuthPicks || {})[pid];
          if (!picks) return;
          let correct = 0;
          targets.forEach((id) => {
            const pick = picks[id];
            if (pick === undefined) return;
            byTarget[id].of += 1;
            if (pick === r.sleuth.answer[id]) { correct += 1; byTarget[id].right += 1; }
          });
          byPhil[pid] = { correct, of: targets.length, amount: correct * E.SLEUTH_BONUS };
          pay(pid, byPhil[pid].amount);
        });
        res.sleuth = { targets, byPhil, byTarget, bonus: E.SLEUTH_BONUS };
      }
      const inv = r.invention;
      s.history.push({
        n: r.n, peddler: r.peddler, peddlerName: s.players[r.peddler].name,
        name: inv.name, slogan: inv.slogan,
        item: r.hand.items[inv.item], func: r.hand.functions[inv.func],
        total: res.total, base: res.base, bonus: res.bonus, sketch: inv.sketch,
        buys: r.prospects.filter((id) => r.verdicts[id] === 'buy').length, prospects: r.prospects.length,
        // for the end-of-night awards
        cast: r.prospects.map((id) => ({ pid: id, name: r.profiles[id].name, playerName: (s.players[id] || {}).name || '', portrait: r.portraits[id] || null })),
        screws: Object.keys(r.screwPlayed).filter((by) => r.screwPlayed[by].result !== 'cancelled')
          .map((by) => ({ by, t: r.screwPlayed[by].card.t, d: r.screwPlayed[by].card.d, result: r.screwPlayed[by].result })),
        hof: {}
      });
      s.phase = 'reveal';
      s.timer.main = null; s.timer.screw = null;
      this.log('money', s.players[r.peddler].name + ' earned $' + res.total.toFixed(2) + '!');
      return { ok: true };
    }

    nextRound() {
      const s = this.s;
      if (s.phase !== 'reveal' && s.phase !== 'lobby') return { ok: false, error: 'Finish this round first.' };
      Object.values(s.players).forEach((p) => { p.volunteer = null; });
      s.phase = 'roles';
      s.timer.main = null;
      this.proposeRoles();
      return { ok: true };
    }

    standings() {
      const list = this.s.order.map((id) => this.s.players[id]).filter(Boolean)
        .map((p) => ({ id: p.id, name: p.name, color: p.color, earned: p.session.earned, connected: p.connected }))
        .sort((a, b) => b.earned - a.earned);
      const top = list.length ? list[0].earned : 0;
      list.forEach((x) => { x.winner = top > 0 && x.earned === top; });
      return list;
    }

    everyonePitched() {
      const s = this.s;
      const can = this.activePlayers().filter((p) => this.eligible(p, 'peddler'));
      return can.length > 0 && can.every((p) => p.session.peddler > 0);
    }
    roundsDone() {
      const s = this.s;
      return s.settings.rounds > 0 ? s.roundNo >= s.settings.rounds : this.everyonePitched();
    }

    // ---------- SCREW! (rulebook section 8) ----------
    endScrew(result) {
      const s = this.s, r = s.round;
      if (!r || !r.activeScrew) { s.timer.screw = null; return; }
      const by = r.activeScrew.by;
      if (result && r.screwPlayed[by] && !r.screwPlayed[by].result) r.screwPlayed[by].result = result;
      if (result === 'cancelled') delete r.screwVotes[by]; // NOT TODAY! means nothing to vote on
      r.activeScrew = null;
      s.timer.screw = null;
      if (!s.hostPaused) this.startT(s.timer.main);
      this.tallyScrew(by);
    }

    /** Everyone at the table except the Peddler and the Prospect who played it votes on each SCREW!. */
    screwVoters(by) {
      const r = this.s.round;
      return r.phils.concat(r.prospects).filter((id) => id !== by && this.s.players[id] && this.s.players[id].connected);
    }
    /** Settles a SCREW! vote once everyone has voted (or, with force, when the pitch ends). Majority wins. */
    tallyScrew(by, force) {
      const r = this.s.round, sv = r && r.screwVotes[by];
      if (!sv || !sv.open || (r.activeScrew && r.activeScrew.by === by)) return;
      const cast = Object.keys(sv.votes).filter((id) => sv.voters.indexOf(id) >= 0);
      if (!force && cast.length < sv.voters.length) return;
      const done = cast.filter((id) => sv.votes[id] === 'done').length, missed = cast.length - done;
      sv.open = false;
      sv.tally = { done, missed };
      if (!cast.length) return;
      const result = done > missed ? 'done' : missed > done ? 'missed' : 'split';
      r.screwPlayed[by].result = result;
      r.screwPlayed[by].tally = sv.tally;
      this.log('screw', 'The table voted: ' + this.s.players[r.peddler].name + ' ' + { done: 'NAILED IT', missed: 'MISSED IT', split: 'split the room' }[result] + ' (' + done + '–' + missed + ').', { big: true });
    }
    closeScrewVotes() {
      const r = this.s.round;
      Object.keys(r.screwVotes || {}).forEach((by) => this.tallyScrew(by, true));
    }

    // ---------- player actions ----------
    /** Entry point for everything a phone sends. */
    act(pid, a) {
      const s = this.s;
      if (!a || typeof a.type !== 'string') return { ok: false, error: 'Bad message.' };
      if (a.type === 'join') return this.join(Object.assign({}, a, { pid }));
      const p = s.players[pid];
      if (!p) return { ok: false, error: 'Join the room first.' };
      if (s.banned[pid]) return { ok: false, error: 'Removed.' };
      p.lastSeen = this.now();
      if (!p.connected) { p.connected = true; this.log('join', p.name + ' is back.'); }
      if (typeof a.seq === 'number') {
        if (a.seq <= p.ackSeq) return { ok: true, dup: true, quiet: true }; // a resend we already handled
        p.ackSeq = a.seq;
      }
      const fn = this['a_' + a.type];
      if (!fn) return { ok: false, error: 'Unknown action ' + a.type };
      const res = fn.call(this, p, a) || { ok: true };
      return res;
    }

    a_ping() { return { ok: true, quiet: true }; }
    a_bye(p) { this.disconnect(p.id); return { ok: true }; }

    a_prefs(p, a) {
      if (a.prefs) this.setPrefs(p, a.prefs);
      if (this.s.phase === 'roles') this.ensureProposal();
      return { ok: true };
    }

    a_volunteer(p, a) {
      const s = this.s;
      if (!s.need || s.need.role !== a.role) return { ok: false, error: 'No volunteer needed right now.' };
      if (p.excluded[a.role]) return { ok: false, error: 'The Host excluded you from that role.' };
      p.volunteer = a.role;
      this.log('info', p.name + ' volunteered as ' + E.ROLE_NAMES[a.role] + '.');
      if (s.phase === 'roles') this.proposeRoles();
      return { ok: true };
    }

    a_wallet(p, a) {
      // sent once at join by returning players so their saved profile carries over
      if (this.s.phase === 'lobby' && p.session.earned === 0) p.wallet = cleanWallet(a.wallet);
      return { ok: true };
    }

    a_invention(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.peddler !== p.id) return { ok: false, error: 'Only the Peddler builds the invention.' };
      if (s.phase !== 'lab') return { ok: false, error: 'The Creation Lab is closed.' };
      const inv = r.invention;
      const idx = (v) => (v === null || v === undefined ? null : clampInt(v, 0, 2));
      if ('item' in a) inv.item = idx(a.item);
      if ('func' in a) inv.func = idx(a.func);
      if ('name' in a) inv.name = str(a.name, 40);
      if ('slogan' in a) inv.slogan = str(a.slogan, 90);
      return { ok: true };
    }

    a_drawing(p, a) {
      const s = this.s, r = s.round;
      if (!r) return { ok: false, error: 'No round in play.' };
      const data = String(a.data || '');
      if (!/^data:image\/(png|jpeg|webp);base64,/.test(data) || data.length > 600000) return { ok: false, error: 'Drawing could not be saved.' };
      // accept drawings during the lab and a few seconds after it closes (late auto-submits)
      const late = s.phase === 'fact' && s.timer.main && (s.timer.main.total - this.remaining(s.timer.main)) < 8000;
      if (s.phase !== 'lab' && !late) return { ok: false, error: 'The Creation Lab is closed.' };
      let id;
      if (r.peddler === p.id) {
        id = 'r' + r.n + '-sketch';
        r.invention.sketch = { id, v: ((r.invention.sketch && r.invention.sketch.v) || 0) + 1 };
      } else if (r.prospects.indexOf(p.id) >= 0) {
        id = 'r' + r.n + '-portrait-' + p.id;
        r.portraits[p.id] = { id, v: ((r.portraits[p.id] && r.portraits[p.id].v) || 0) + 1 };
      } else return { ok: false, error: 'Only the Peddler and Prospects draw.' };
      this.assets[id] = data;
      this.emit('asset', id, data);
      return { ok: true };
    }

    a_labDone(p, a) {
      const s = this.s, r = s.round;
      if (!r || s.phase !== 'lab') return { ok: false, error: 'The Creation Lab is closed.' };
      if (r.peddler === p.id) {
        const inv = r.invention;
        if (inv.item == null || inv.func == null) return { ok: false, error: 'Pick one Item and one Function.' };
        if (!inv.name) return { ok: false, error: 'Give your invention a name.' };
      } else if (r.prospects.indexOf(p.id) < 0) return { ok: false, error: 'Nothing to submit.' };
      r.labDone[p.id] = a.done !== false;
      this.checkAllDone();
      return { ok: true };
    }

    a_briefed(p) {
      const s = this.s, r = s.round;
      if (!r || s.phase !== 'brief') return { ok: false, error: 'The briefing is over.' };
      if (this.roleOf(p.id) === 'sitout') return { ok: true };
      r.briefed[p.id] = true;
      this.checkAllDone();
      return { ok: true };
    }

    secretPhase() { return ['fact', 'pitch', 'close'].indexOf(this.s.phase) >= 0; }

    a_secretClaim(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.peddler !== p.id) return { ok: false, error: 'Only the Peddler can claim a secret.' };
      if (!this.secretPhase()) return { ok: false, error: 'Claim secrets during fact-finding.' };
      const t = a.target;
      if (r.prospects.indexOf(t) < 0) return { ok: false, error: 'Pick a Prospect.' };
      if (r.secrets[t] === 'confirmed') return { ok: false, error: 'Already discovered.' };
      r.secrets[t] = 'claimed';
      r.claims[t] = str(a.guess, 100);
      this.log('secret', p.name + ' thinks they found ' + r.profiles[t].name + "'s secret...");
      return { ok: true };
    }

    a_secretAnswer(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.prospects.indexOf(p.id) < 0) return { ok: false, error: 'Only Prospects answer this.' };
      if (!this.secretPhase() && s.phase !== 'scoring') return { ok: false, error: 'Too late to change this.' };
      const prof = r.profiles[p.id];
      if (a.yes) {
        r.secrets[p.id] = 'confirmed';
        this.log('secret', 'SECRET UNLOCKED! ' + prof.name + ': ' + prof.secret, { big: true });
      } else if (r.secrets[p.id] === 'claimed') {
        r.secrets[p.id] = 'denied';
        this.log('secret', prof.name + ' says that was not their secret. The Host can settle it.');
      }
      return { ok: true };
    }

    a_screw(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.prospects.indexOf(p.id) < 0) return { ok: false, error: 'Only Prospects play SCREW! cards.' };
      if (s.phase !== 'pitch') return { ok: false, error: 'SCREW! cards are played during the pitch.' };
      if (r.screwPlayed[p.id]) return { ok: false, error: 'You already played your SCREW! card.' };
      if (r.activeScrew) return { ok: false, error: 'Another SCREW! is in progress.' };
      if (s.hostPaused) return { ok: false, error: 'The game is paused.' };
      if (this.remaining(s.timer.main) <= E.SCREW_LOCKOUT_MS) return { ok: false, error: 'Too late: no SCREW! in the last 10 seconds.' };
      const idx = clampInt(a.idx, 0, 2);
      const card = r.screwHands[p.id][idx];
      r.screwPlayed[p.id] = { idx, card, result: null, at: this.now() };
      r.screwVotes[p.id] = { open: true, voters: this.screwVoters(p.id), votes: {} };
      r.activeScrew = { by: p.id, card };
      this.pauseT(s.timer.main);
      s.timer.screw = this.newTimer(s.settings.timers.screw);
      this.log('screw', 'SCREW! ' + r.profiles[p.id].name + ' plays ' + card.t, { big: true });
      return { ok: true };
    }

    a_screwVote(p, a) {
      const r = this.s.round;
      const sv = r && r.screwVotes[a.by];
      if (!sv || !sv.open) return { ok: false, error: 'That vote is closed.' };
      if (sv.voters.indexOf(p.id) < 0) return { ok: false, error: 'You don’t vote on this SCREW!.' };
      if (r.activeScrew && r.activeScrew.by === a.by) return { ok: false, error: 'Wait until the Peddler finishes responding.' };
      sv.votes[p.id] = a.result === 'done' ? 'done' : 'missed';
      this.tallyScrew(a.by);
      return { ok: true };
    }

    a_screwDone(p) {
      const r = this.s.round;
      if (!r || r.peddler !== p.id || !r.activeScrew) return { ok: false, error: 'No SCREW! to finish.' };
      this.endScrew(null);
      return { ok: true };
    }

    a_pitchDone(p) {
      const s = this.s, r = s.round;
      if (!r || r.peddler !== p.id || s.phase !== 'pitch') return { ok: false, error: 'Not pitching right now.' };
      if (r.activeScrew) return { ok: false, error: 'Finish the SCREW! first.' };
      this.log('info', p.name + ' finished the pitch.');
      this.enterPhase('close');
      return { ok: true };
    }

    a_objection(p) {
      const s = this.s, r = s.round;
      if (!r || r.prospects.indexOf(p.id) < 0) return { ok: false, error: 'Only Prospects raise objections.' };
      if (s.phase !== 'close') return { ok: false, error: 'Objections come after the pitch.' };
      if (r.objections[p.id]) return { ok: false, error: 'You already raised your objection.' };
      r.objections[p.id] = this.now();
      this.log('objection', r.profiles[p.id].name + ' has an objection!');
      return { ok: true };
    }

    a_verdict(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.prospects.indexOf(p.id) < 0) return { ok: false, error: 'Only Prospects decide to buy.' };
      if (['close', 'scoring'].indexOf(s.phase) < 0) return { ok: false, error: 'Decide after the pitch.' };
      r.verdicts[p.id] = a.buy ? 'buy' : 'pass';
      return { ok: true };
    }

    a_scorecard(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.phils.indexOf(p.id) < 0) return { ok: false, error: 'Only Philanthropists score.' };
      if (s.phase !== 'scoring') return { ok: false, error: 'Scoring opens after the close.' };
      const cats = {}, pros = {};
      C.categories.forEach((c) => { cats[c.id] = clampInt((a.cats || {})[c.id], 0, E.CATEGORY_MAX); });
      r.prospects.forEach((id) => { pros[id] = clampInt((a.prospects || {})[id], 0, E.PROSPECT_AWARD_MAX); });
      r.scorecards[p.id] = { cats, prospects: pros };
      this.checkAllDone();
      return { ok: true };
    }

    a_sleuthPick(p, a) {
      const s = this.s, r = s.round;
      if (!r || r.phils.indexOf(p.id) < 0) return { ok: false, error: 'Only Philanthropists play Secret Sleuth.' };
      if (!r.sleuth || s.phase !== 'fact') return { ok: false, error: 'Secret Sleuth guesses close when Fact-Finding ends.' };
      if (r.sleuth.targets.indexOf(a.target) < 0) return { ok: false, error: 'Pick a Prospect.' };
      if (r.secrets[a.target] === 'confirmed') return { ok: false, error: 'That secret is already out.' };
      (r.sleuthPicks[p.id] = r.sleuthPicks[p.id] || {})[a.target] = clampInt(a.idx, 0, E.SLEUTH_OPTIONS - 1);
      return { ok: true };
    }

    a_nepo(p, a) {
      const s = this.s, r = s.round;
      const card = C.nepo[a.card];
      if (!card) return { ok: false, error: 'Unknown card.' };
      if (!r || r.peddler !== p.id) return { ok: false, error: 'Power Cards are used by the Peddler during their pitch round.' };
      if (r.nepoUsed) return { ok: false, error: 'Only one NEPO BABY! card per pitch.' };
      if (!p.wallet.inventory[card.id]) return { ok: false, error: "You don't own " + card.name + '.' };
      if (card.id === 'notToday') {
        if (s.phase !== 'pitch' || !r.activeScrew) return { ok: false, error: 'Use NOT TODAY! while a SCREW! is active.' };
        r.nepoUsed = { card: card.id, target: r.activeScrew.by };
        this.endScrew('cancelled');
        this.log('nepo', 'NOT TODAY! ' + p.name + ' cancels the SCREW!', { big: true });
      } else if (card.id === 'knowPeople') {
        if (s.phase !== 'lab') return { ok: false, error: 'I KNOW PEOPLE is used before fact-finding.' };
        const out = a.target, inn = a.replacement;
        const idx = r.prospects.indexOf(out);
        const np = s.players[inn];
        if (idx < 0) return { ok: false, error: 'Pick a Prospect to replace.' };
        if (!np || !np.connected || inn === p.id || r.prospects.indexOf(inn) >= 0) return { ok: false, error: 'Pick an available player.' };
        if (!this.eligible(np, 'prospect')) return { ok: false, error: np.name + ' opted out of being a Prospect.' };
        r.prospects[idx] = inn;
        r.phils = r.phils.filter((x) => x !== inn);
        r.sitOut = r.sitOut.filter((x) => x !== inn);
        if (this.eligible(s.players[out], 'phil')) r.phils.push(out); else r.sitOut.push(out);
        if (r.phils.length < 1) { // undo: the table needs a Philanthropist
          r.prospects[idx] = out;
          r.phils = r.phils.filter((x) => x !== out); r.sitOut = r.sitOut.filter((x) => x !== out);
          r.phils.push(inn);
          return { ok: false, error: 'That would leave no Philanthropists.' };
        }
        ['profiles', 'screwHands', 'secrets'].forEach((k) => { r[k][inn] = r[k][out]; delete r[k][out]; });
        delete r.portraits[out]; delete r.labDone[out];
        s.players[out].session.prospect -= 1; np.session.prospect += 1;
        if (r.phils.indexOf(out) >= 0) s.players[out].session.phil += 1;
        if (np.session.phil > 0) np.session.phil -= 1;
        r.nepoUsed = { card: card.id, target: out, replacement: inn };
        this.log('nepo', 'I KNOW PEOPLE! ' + np.name + ' replaces ' + s.players[out].name + ' as ' + r.profiles[inn].name + '.', { big: true });
      } else if (card.id === 'daddy') {
        if (['fact', 'pitch', 'close'].indexOf(s.phase) < 0) return { ok: false, error: 'Use DADDY MADE A CALL between fact-finding and the close.' };
        if (r.prospects.indexOf(a.target) < 0) return { ok: false, error: 'Pick a Prospect.' };
        r.daddy = { target: a.target, text: this.pick(C.daddyChallenges), at: this.now() };
        r.nepoUsed = { card: card.id, target: a.target };
        this.log('nepo', 'DADDY MADE A CALL! ' + r.profiles[a.target].name + ': ' + r.daddy.text, { big: true });
      } else if (card.id === 'insider') {
        if (s.phase !== 'fact') return { ok: false, error: 'Use INSIDE TRADING during Fact-Finding.' };
        if (!r.sleuth) return { ok: false, error: 'Secret Sleuth is turned off this game.' };
        if (r.phils.indexOf(a.phil) < 0 || r.prospects.indexOf(a.target) < 0) return { ok: false, error: 'Pick a Philanthropist and a Prospect.' };
        const pick = (r.sleuthPicks[a.phil] || {})[a.target];
        if (pick === undefined) return { ok: false, error: s.players[a.phil].name + ' has not guessed ' + r.profiles[a.target].name + '’s secret yet. Try again soon.' };
        r.insider = { phil: a.phil, target: a.target, text: r.sleuth.options[a.target][pick] };
        r.nepoUsed = { card: card.id, target: a.phil };
        this.log('nepo', 'INSIDE TRADING! ' + p.name + ' peeks at ' + s.players[a.phil].name + '’s Secret Sleuth notes.', { big: true });
      }
      p.wallet.inventory[card.id] -= 1;
      return { ok: true };
    }

    a_buy(p, a) {
      const s = this.s;
      const card = C.nepo[a.card];
      if (!card) return { ok: false, error: 'Unknown card.' };
      if (['lobby', 'roles', 'reveal', 'final'].indexOf(s.phase) < 0) return { ok: false, error: 'The shop opens between rounds.' };
      if (p.wallet.cash < card.price) return { ok: false, error: 'Not enough cash.' };
      p.wallet.cash = round2(p.wallet.cash - card.price);
      p.wallet.inventory[card.id] += 1;
      this.log('shop', p.name + ' bought ' + card.name + '.');
      return { ok: true };
    }

    a_hof(p, a) {
      const r = this.s.round;
      if (!r || (r.peddler !== p.id && r.prospects.indexOf(p.id) < 0)) return { ok: false, error: 'Nothing to feature.' };
      r.hof[p.id] = !!a.yes;
      const h = this.s.history[this.s.history.length - 1];
      if (h && h.n === r.n) { h.hof = h.hof || {}; h.hof[p.id] = !!a.yes; }
      return { ok: true };
    }

    // ---------- End-of-night awards ----------
    /** Everyone votes, from their phone, on tonight's Funniest Invention, Best Prospect and Best
     *  Recovery (best answer to a SCREW!). No voting for yourself. Honorary: no money changes hands. */
    awardCandidates() {
      const s = this.s;
      const inv = [], pros = [], recs = [];
      s.history.forEach((h) => {
        inv.push({ key: 'inv-' + h.n, label: h.name, sub: 'by ' + h.peddlerName, owner: h.peddler, image: h.sketch || null, n: h.n });
        (h.cast || []).forEach((c) => pros.push({ key: 'pro-' + h.n + '-' + c.pid, label: c.name, sub: 'played by ' + c.playerName, owner: c.pid, image: c.portrait || null, n: h.n }));
        (h.screws || []).forEach((x) => recs.push({ key: 'rec-' + h.n + '-' + x.by, label: h.peddlerName + ' vs. “' + x.t + '”', sub: x.d, owner: h.peddler, image: null, n: h.n }));
      });
      return [
        { id: 'funniest', title: 'Funniest Invention', candidates: inv },
        { id: 'prospect', title: 'Best Prospect', candidates: pros },
        { id: 'recovery', title: 'Best Recovery', candidates: recs }
      ].filter((c) => c.candidates.length >= 2);
    }
    startAwards() {
      const s = this.s;
      const cats = this.awardCandidates();
      if (!cats.length) return false;
      s.awards = { cats, votes: {}, results: null };
      s.phase = 'awards';
      s.timer.main = null; s.timer.screw = null;
      this.log('awards', 'End-of-night awards! Vote on your phone.');
      return true;
    }
    a_vote(p, a) {
      const s = this.s, aw = s.awards;
      if (s.phase !== 'awards' || !aw) return { ok: false, error: 'Voting is closed.' };
      const cat = aw.cats.find((c) => c.id === a.cat);
      const cand = cat && cat.candidates.find((c) => c.key === a.key);
      if (!cand) return { ok: false, error: 'Pick one of the nominees.' };
      if (cand.owner === p.id) return { ok: false, error: "You can't vote for yourself." };
      aw.votes[p.id] = Object.assign({}, aw.votes[p.id], { [cat.id]: cand.key });
      this.checkAwardsDone();
      return { ok: true };
    }
    checkAwardsDone() {
      const s = this.s, aw = s.awards;
      if (!aw || !s.settings.autoAdvance) return;
      const voters = this.activePlayers();
      const done = voters.length && voters.every((p) => aw.cats.every((c) =>
        !c.candidates.some((x) => x.owner !== p.id) || (aw.votes[p.id] && aw.votes[p.id][c.id])));
      if (done) this.finishAwards();
    }
    finishAwards() {
      const s = this.s, aw = s.awards;
      if (!aw || s.phase !== 'awards') return { ok: false, error: 'No awards vote running.' };
      aw.results = aw.cats.map((c) => {
        const count = {};
        Object.values(aw.votes).forEach((v) => { if (v[c.id]) count[v[c.id]] = (count[v[c.id]] || 0) + 1; });
        const max = Math.max(0, ...Object.values(count));
        return { id: c.id, title: c.title, votes: max, winners: max ? c.candidates.filter((x) => count[x.key] === max) : [] };
      });
      s.phase = 'final';
      this.log('final', 'And the winners are...');
      return { ok: true };
    }
    /** Hall of Fame entries for award winners whose creators opted in to being featured. */
    awardHofEntries() {
      const s = this.s, aw = s.awards;
      if (!aw || !aw.results) return [];
      const out = [];
      aw.results.forEach((res) => res.winners.forEach((w) => {
        const h = s.history.find((x) => x.n === w.n);
        if (!h || !(h.hof || {})[w.owner]) return;
        out.push({
          kind: 'award', award: res.title, key: s.createdAt + '-award-' + res.id + '-' + w.key, name: w.label, slogan: w.sub,
          creator: (s.players[w.owner] || {}).name || '', earned: null, date: this.now(), image: w.image ? this.assets[w.image.id] || null : null
        });
      }));
      return out;
    }

    // ---------- Host commands ----------
    host(cmd, a) {
      a = a || {};
      const fn = this['h_' + cmd];
      if (!fn) return { ok: false, error: 'Unknown command.' };
      const res = fn.call(this, a) || { ok: true };
      this.changed();
      return res;
    }
    h_settings(a) {
      const st = this.s.settings;
      if (a.timers) Object.keys(st.timers).forEach((k) => { if (a.timers[k] != null) st.timers[k] = clampInt(a.timers[k], 5, 900); });
      if (a.maxProspects != null) st.maxProspects = clampInt(a.maxProspects, 1, 3);
      if (a.rounds != null) st.rounds = clampInt(a.rounds, 0, 50);
      if (a.autoAdvance != null) st.autoAdvance = !!a.autoAdvance;
      if (a.sleuth != null) st.sleuth = !!a.sleuth;
      if (a.trimOutliers != null) st.trimOutliers = !!a.trimOutliers;
      if (a.briefing != null) st.briefing = !!a.briefing;
      if (a.awards != null) st.awards = !!a.awards;
      if (this.s.phase === 'roles' && a.maxProspects != null) this.proposeRoles();
      return { ok: true };
    }
    h_start() {
      if (this.s.phase !== 'lobby') return { ok: false, error: 'Already started.' };
      if (this.activePlayers().length < E.MIN_PLAYERS) return { ok: false, error: 'You need at least 3 players.' };
      return this.nextRound();
    }
    h_shuffle() { if (this.s.phase === 'roles') this.proposeRoles(); return { ok: true }; }
    h_setRole(a) { if (this.s.phase !== 'roles') return { ok: false, error: 'Roles are set between rounds.' }; return this.setRole(a.pid, a.role); }
    h_exclude(a) {
      const p = this.s.players[a.pid];
      if (!p || E.ROLES.indexOf(a.role) < 0) return { ok: false, error: 'Unknown player.' };
      p.excluded[a.role] = !!a.excluded;
      if (this.s.phase === 'roles') this.ensureProposal();
      return { ok: true };
    }
    h_kick(a) {
      const s = this.s, p = s.players[a.pid];
      if (!p) return { ok: false };
      if (s.round && (s.round.peddler === p.id || s.round.prospects.indexOf(p.id) >= 0) && ['lobby', 'roles', 'reveal', 'awards', 'final'].indexOf(s.phase) < 0)
        return { ok: false, error: "Can't remove the Peddler or a Prospect mid-round." };
      s.banned[p.id] = true;
      delete s.players[p.id];
      s.order = s.order.filter((x) => x !== p.id);
      if (s.round) s.round.phils = s.round.phils.filter((x) => x !== p.id);
      this.log('leave', p.name + ' was removed.');
      if (s.phase === 'roles') this.ensureProposal();
      return { ok: true };
    }
    h_begin() { return this.beginRound(); }
    h_next() { return this.advance(); }
    h_pause() {
      const s = this.s;
      if (s.hostPaused) return { ok: true };
      s.hostPaused = true; this.pauseT(s.timer.main); this.pauseT(s.timer.screw);
      return { ok: true };
    }
    h_resume() {
      const s = this.s;
      if (!s.hostPaused) return { ok: true };
      s.hostPaused = false;
      if (s.timer.screw) this.startT(s.timer.screw); else this.startT(s.timer.main);
      return { ok: true };
    }
    h_addTime(a) {
      const t = this.s.timer.main;
      if (!t) return { ok: false };
      const ms = clampInt(a.sec || 30, 5, 600) * 1000;
      if (t.endsAt) t.endsAt += ms; else t.remaining += ms;
      t.total += ms;
      this.s.expired = false;
      if (!t.endsAt && !this.s.hostPaused && !this.s.timer.screw) this.startT(t);
      return { ok: true };
    }
    h_screwEnd() { this.endScrew(null); return { ok: true }; }
    h_secret(a) {
      const r = this.s.round;
      if (!r || r.prospects.indexOf(a.pid) < 0 || this.s.phase === 'reveal') return { ok: false, error: 'Secrets are settled before the reveal.' };
      r.secrets[a.pid] = a.status === 'confirmed' ? 'confirmed' : 'hidden';
      if (a.status === 'confirmed') this.log('secret', 'Host ruling: SECRET UNLOCKED! ' + r.profiles[a.pid].name + ': ' + r.profiles[a.pid].secret, { big: true });
      else this.log('secret', 'Host ruling: ' + r.profiles[a.pid].name + "'s secret is still hidden.");
      return { ok: true };
    }
    h_daddyDone() { if (this.s.round) this.s.round.daddy = null; return { ok: true }; }
    h_reveal() { return this.reveal(); }
    h_finishAwards() { return this.finishAwards(); }
    h_nextRound() { return this.nextRound(); }
    h_end() {
      const s = this.s;
      if (s.round && ['brief', 'lab', 'fact', 'pitch', 'close', 'scoring'].indexOf(s.phase) >= 0) return { ok: false, error: 'Finish the round (or reveal the money) first.' };
      if (s.phase === 'final') return { ok: true };
      s.timer.main = null; s.timer.screw = null;
      if (s.phase !== 'awards' && s.settings.awards && this.startAwards()) return { ok: true };
      if (s.phase === 'awards') return this.finishAwards();
      s.phase = 'final';
      this.log('final', 'Final results!');
      return { ok: true };
    }
    h_newGame() {
      const s = this.s;
      Object.values(s.players).forEach((p) => { p.session = { earned: 0, peddler: 0, prospect: 0, phil: 0 }; p.volunteer = null; });
      s.phase = 'lobby'; s.round = null; s.roundNo = 0; s.history = []; s.proposal = null; s.need = null; s.awards = null;
      s.timer = { main: null, screw: null }; s.hostPaused = false;
      return { ok: true };
    }

    // ---------- views ----------
    timerView(t) { return t ? { total: t.total, remaining: this.remaining(t), running: !!t.endsAt } : null; }

    /** What everyone (and the TV) may see. Never includes secrets that have not been discovered. */
    publicView() {
      const s = this.s, r = s.round;
      const players = s.order.map((id) => s.players[id]).filter(Boolean).map((p) => ({
        id: p.id, name: p.name, color: p.color, connected: p.connected, earned: p.session.earned,
        role: this.roleOf(p.id), turns: { peddler: p.session.peddler, prospect: p.session.prospect },
        prefs: p.prefs, excluded: p.excluded, volunteer: p.volunteer
      }));
      let round = null;
      if (r) {
        const showInvention = ['pitch', 'close', 'scoring', 'reveal', 'final'].indexOf(s.phase) >= 0;
        const profiles = {};
        r.prospects.forEach((id) => {
          const pr = r.profiles[id];
          profiles[id] = { name: pr.name, age: pr.age, marital: pr.marital, kids: pr.kids, job: pr.job, background: pr.background };
          if (r.secrets[id] === 'confirmed' || s.phase === 'reveal') profiles[id].secret = pr.secret;
        });
        const inv = r.invention;
        round = {
          n: r.n, peddler: r.peddler, prospects: r.prospects, phils: r.phils, sitOut: r.sitOut,
          profiles, portraits: r.portraits, labDone: r.labDone, briefed: r.briefed || {}, secrets: r.secrets,
          disputes: Object.keys(r.secrets).filter((id) => r.secrets[id] === 'denied').map((id) => ({ pid: id, guess: r.claims[id] || '' })),
          invention: showInvention ? {
            name: inv.name, slogan: inv.slogan, sketch: inv.sketch,
            item: r.hand.items[inv.item], func: r.hand.functions[inv.func]
          } : { started: !!inv.name, sketch: inv.sketch ? { id: inv.sketch.id, v: inv.sketch.v, hidden: true } : null },
          screwPlayed: r.screwPlayed, activeScrew: r.activeScrew,
          screwVotes: Object.keys(r.screwVotes || {}).reduce((o, by) => { const sv = r.screwVotes[by]; o[by] = { open: sv.open, n: Object.keys(sv.votes).length, of: sv.voters.length }; return o; }, {}),
          objections: r.objections,
          verdicts: s.phase === 'reveal' ? r.verdicts : Object.keys(r.verdicts).reduce((o, k) => { o[k] = 'decided'; return o; }, {}),
          nepoUsed: r.nepoUsed, daddy: r.daddy,
          scorecardsIn: Object.keys(r.scorecards),
          results: s.phase === 'reveal' || s.phase === 'final' ? r.results : null,
          hof: r.hof
        };
      }
      return {
        code: s.code, phase: s.phase, settings: s.settings, hostPaused: s.hostPaused, expired: s.expired,
        timer: { main: this.timerView(s.timer.main), screw: this.timerView(s.timer.screw) },
        players, proposal: s.phase === 'roles' ? s.proposal : null, need: s.need,
        proposalError: s.phase === 'roles' ? this.validateProposal(s.proposal) : null,
        round, roundNo: s.roundNo, history: s.history.map((h) => Object.assign({}, h)),
        standings: this.standings(), roundsDone: s.round ? this.roundsDone() : false,
        awards: s.awards ? {
          cats: s.awards.cats, results: s.awards.results,
          voted: Object.keys(s.awards.votes)
        } : null,
        feed: s.feed.slice(-12)
      };
    }

    /** What one phone may see: its own hand, profile, secret, SCREW! cards and wallet. */
    privateView(pid) {
      const s = this.s, p = s.players[pid];
      if (!p) return { removed: !!s.banned[pid] };
      const r = s.round;
      const role = r && ['lobby', 'roles'].indexOf(s.phase) < 0 ? this.roleOf(pid) : null;
      const out = {
        pid, name: p.name, color: p.color, ackSeq: p.ackSeq, wallet: p.wallet, prefs: p.prefs,
        excluded: p.excluded, volunteer: p.volunteer, role, earned: p.session.earned,
        lastError: p.lastError || null,
        votes: s.awards && s.awards.votes[pid] ? s.awards.votes[pid] : {}
      };
      if (s.phase === 'roles' && s.proposal) {
        const pr = s.proposal;
        out.nextRole = pr.peddler === pid ? 'peddler' : pr.prospects.indexOf(pid) >= 0 ? 'prospect' : pr.phils.indexOf(pid) >= 0 ? 'phil' : 'sitout';
      }
      if (r && role === 'peddler') {
        out.hand = r.hand;
        out.invention = r.invention;
        out.labDone = !!r.labDone[pid];
        out.claims = r.claims;
        out.insider = r.insider || null;
      }
      if (r && role === 'prospect') {
        out.profile = r.profiles[pid];
        out.screws = r.screwHands[pid];
        out.screwPlayed = r.screwPlayed[pid] || null;
        out.secretStatus = r.secrets[pid];
        out.claimGuess = r.secrets[pid] === 'claimed' ? r.claims[pid] || '' : null;
        out.labDone = !!r.labDone[pid];
        out.verdict = r.verdicts[pid] || null;
      }
      if (r && (role === 'phil' || role === 'prospect')) {
        out.screwVotes = Object.keys(r.screwVotes || {}).filter((by) => r.screwVotes[by].open && r.screwVotes[by].voters.indexOf(pid) >= 0)
          .map((by) => ({ by, name: r.profiles[by].name, card: r.screwPlayed[by].card, mine: r.screwVotes[by].votes[pid] || null }));
      }
      if (r && role === 'phil') {
        out.scorecard = r.scorecards[pid] || null;
        if (r.sleuth && ['fact', 'pitch', 'close', 'scoring', 'reveal'].indexOf(s.phase) >= 0) {
          out.sleuth = r.sleuth.targets.map((id) => ({ pid: id, name: r.profiles[id].name, options: r.sleuth.options[id], locked: s.phase !== 'fact' || r.secrets[id] === 'confirmed' }));
          out.sleuthPicks = r.sleuthPicks[pid] || {};
          if (s.phase === 'reveal') {
            out.sleuthAnswers = r.sleuth.answer;
            out.sleuthResult = (r.results.sleuth && r.results.sleuth.byPhil[pid]) || null;
          }
        }
      }
      if (r && (s.phase === 'reveal')) {
        out.hofChoice = r.hof[pid];
        if (role === 'peddler') out.myEarnings = r.results.total;
        if (role === 'prospect') out.myEarnings = r.results.prospectAwards[pid];
        if (role === 'phil' && r.results.sleuth && r.results.sleuth.targets.length) out.myEarnings = out.sleuthResult ? out.sleuthResult.amount : 0;
      }
      return out;
    }

    /** Hall of Fame entries players opted into this round (saved on the Host device). */
    hofEntries() {
      const s = this.s, r = s.round;
      if (!r || !r.results) return [];
      const out = [];
      const inv = r.invention;
      if (r.hof[r.peddler] && s.players[r.peddler]) {
        out.push({
          kind: 'invention', key: s.createdAt + '-' + r.n, name: inv.name, slogan: inv.slogan,
          item: r.hand.items[inv.item], func: r.hand.functions[inv.func],
          creator: s.players[r.peddler].name, earned: r.results.total, date: this.now(),
          image: inv.sketch ? this.assets[inv.sketch.id] || null : null
        });
      }
      r.prospects.forEach((id) => {
        if (r.hof[id] && s.players[id]) {
          out.push({
            kind: 'portrait', key: s.createdAt + '-' + r.n + '-' + id, name: r.profiles[id].name,
            creator: s.players[id].name, earned: r.results.prospectAwards[id], date: this.now(),
            image: r.portraits[id] ? this.assets[r.portraits[id].id] || null : null
          });
        }
      });
      return out;
    }
  }

  E.Game = Game;
})(window.PITCH = window.PITCH || {});
