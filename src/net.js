/* PITCH! networking.
 * Online play uses a free public MQTT broker over secure WebSockets (no accounts, no server to run).
 * The Host's browser is the game server: phones publish actions, the Host publishes views.
 * Practice mode swaps in an in-page broker with the exact same API, so both paths share code.
 *
 * Topics, all under  pitch-party-game/v1/<ROOM>/
 *   state          retained  public view (everyone, the TV)
 *   priv/<token>   retained  one player's private view (hand, secret, wallet)
 *   asset/<id>     retained  drawings as data URLs
 *   act            phones -> Host actions
 *   status         retained  "online" / "offline" (Host last will)
 *   beat           Host heartbeat every few seconds */
(function (P) {
  const N = (P.net = {});
  N.PREFIX = 'pitch-party-game/v1/';
  N.CODE_LETTERS = 'BCDFGHJKLMNPQRSTVWXZ';

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  N.randomId = function (n) {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let out = '';
    const buf = new Uint8Array(n);
    (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(buf) : buf.forEach((_, i) => { buf[i] = Math.random() * 256; });
    buf.forEach((b) => { out += chars[b % chars.length]; });
    return out;
  };
  N.randomCode = function () {
    let c = '';
    for (let i = 0; i < 4; i++) c += N.CODE_LETTERS[Math.floor(Math.random() * N.CODE_LETTERS.length)];
    return c;
  };
  N.topicMatches = function (filter, topic) {
    const f = filter.split('/'), t = topic.split('/');
    for (let i = 0; i < f.length; i++) {
      if (f[i] === '#') return true;
      if (i >= t.length) return false;
      if (f[i] !== '+' && f[i] !== t[i]) return false;
    }
    return f.length === t.length;
  };

  // ---------------------------------------------------------------------------
  // Minimal MQTT 3.1.1 client over WebSocket (QoS 0, retained messages, last will)
  // ---------------------------------------------------------------------------
  function varLen(n) {
    const out = [];
    do { let b = n % 128; n = Math.floor(n / 128); if (n > 0) b |= 128; out.push(b); } while (n > 0);
    return out;
  }
  function mqttStr(s) { const b = enc.encode(s); return [b.length >> 8, b.length & 255].concat(Array.from(b)); }
  function packet(first, body) {
    const len = varLen(body.length);
    const out = new Uint8Array(1 + len.length + body.length);
    out[0] = first; out.set(len, 1); out.set(body, 1 + len.length);
    return out;
  }

  class MqttClient {
    constructor(url, opts) {
      this.url = url;
      this.opts = Object.assign({ keepalive: 30 }, opts || {});
      this.handlers = { message: [], close: [] };
      this.buf = new Uint8Array(0);
      this.pid = 1;
      this.connected = false;
    }
    on(ev, fn) { this.handlers[ev].push(fn); }
    connect(timeoutMs) {
      return new Promise((resolve, reject) => {
        let done = false;
        const fail = (msg) => { if (!done) { done = true; try { this.ws && this.ws.close(); } catch (e) { /* ignore */ } reject(new Error(msg)); } };
        const timer = setTimeout(() => fail('timeout'), timeoutMs || 6000);
        let ws;
        try { ws = this.ws = new WebSocket(this.url, ['mqtt']); } catch (e) { clearTimeout(timer); fail('blocked'); return; }
        ws.binaryType = 'arraybuffer';
        ws.onopen = () => {
          const o = this.opts;
          let flags = 0x02; // clean session
          let payload = mqttStr(o.clientId);
          if (o.will) {
            flags |= 0x04 | (o.will.retain ? 0x20 : 0);
            const wm = enc.encode(o.will.payload);
            payload = payload.concat(mqttStr(o.will.topic), [wm.length >> 8, wm.length & 255], Array.from(wm));
          }
          const head = [0, 4, 77, 81, 84, 84, 4, flags, o.keepalive >> 8, o.keepalive & 255];
          ws.send(packet(0x10, head.concat(payload)));
        };
        ws.onmessage = (ev) => {
          const chunk = new Uint8Array(ev.data);
          const merged = new Uint8Array(this.buf.length + chunk.length);
          merged.set(this.buf); merged.set(chunk, this.buf.length);
          this.buf = merged;
          this.parse((type, body) => {
            if (type === 2) { // CONNACK
              clearTimeout(timer);
              if (body[1] === 0) {
                this.connected = true; done = true;
                this.pinger = setInterval(() => this.raw([0xc0, 0]), (this.opts.keepalive * 1000) / 2);
                resolve(this);
              } else fail('refused ' + body[1]);
            }
          });
        };
        ws.onerror = () => fail('error');
        ws.onclose = () => {
          clearTimeout(timer);
          const was = this.connected;
          this.connected = false;
          clearInterval(this.pinger);
          if (!done) fail('closed');
          else if (was) this.handlers.close.forEach((fn) => fn());
        };
      });
    }
    parse(onControl) {
      for (;;) {
        const b = this.buf;
        if (b.length < 2) return;
        let mult = 1, len = 0, i = 1, byte;
        do {
          if (i >= b.length) return;
          byte = b[i++]; len += (byte & 127) * mult; mult *= 128;
        } while (byte & 128);
        if (b.length < i + len) return;
        const first = b[0];
        const body = b.subarray(i, i + len);
        this.buf = b.slice(i + len);
        const type = first >> 4;
        if (type === 3) {
          const qos = (first >> 1) & 3;
          const tl = (body[0] << 8) | body[1];
          const topic = dec.decode(body.subarray(2, 2 + tl));
          let off = 2 + tl;
          if (qos > 0) { this.raw([0x40, 2, body[off], body[off + 1]]); off += 2; }
          const payload = dec.decode(body.subarray(off));
          this.handlers.message.forEach((fn) => { try { fn(topic, payload); } catch (e) { console.error(e); } });
        } else onControl(type, body);
      }
    }
    raw(bytes) { if (this.ws && this.ws.readyState === 1) this.ws.send(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)); }
    subscribe(filters) {
      const id = this.pid = (this.pid % 65000) + 1;
      let body = [id >> 8, id & 255];
      filters.forEach((f) => { body = body.concat(mqttStr(f), [0]); });
      this.raw(packet(0x82, body));
    }
    publish(topic, payload, retain) {
      const p = enc.encode(payload || '');
      const t = mqttStr(topic);
      const body = new Uint8Array(t.length + p.length);
      body.set(t); body.set(p, t.length);
      this.raw(packet(0x30 | (retain ? 1 : 0), body));
    }
    end() {
      this.connected = false;
      clearInterval(this.pinger);
      try { this.raw([0xe0, 0]); this.ws.close(); } catch (e) { /* ignore */ }
    }
  }
  N.MqttClient = MqttClient;

  // ---------------------------------------------------------------------------
  // In-page broker for Practice mode (same API as MqttClient)
  // ---------------------------------------------------------------------------
  class MemoryBroker {
    constructor() { this.clients = []; this.retained = {}; }
    client(opts) { const c = new MemoryClient(this, opts || {}); c.connect(); return c; }
    deliver(topic, payload, retain) {
      if (retain) { if (payload) this.retained[topic] = payload; else delete this.retained[topic]; }
      this.clients.forEach((c) => {
        if (c.connected && c.subs.some((f) => N.topicMatches(f, topic))) c.queue(topic, payload);
      });
    }
  }
  class MemoryClient {
    constructor(broker, opts) { this.broker = broker; this.opts = opts; this.subs = []; this.handlers = { message: [], close: [] }; this.connected = false; }
    on(ev, fn) { this.handlers[ev].push(fn); }
    connect() { this.connected = true; this.broker.clients.push(this); return Promise.resolve(this); }
    queue(topic, payload) {
      if (!payload) return;
      setTimeout(() => { if (this.connected) this.handlers.message.forEach((fn) => fn(topic, payload)); }, 0);
    }
    subscribe(filters) {
      filters.forEach((f) => {
        this.subs.push(f);
        Object.keys(this.broker.retained).forEach((t) => { if (N.topicMatches(f, t)) this.queue(t, this.broker.retained[t]); });
      });
    }
    publish(topic, payload, retain) { this.broker.deliver(topic, payload || '', retain); }
    end() { this.connected = false; this.broker.clients = this.broker.clients.filter((c) => c !== this); }
  }
  N.MemoryBroker = MemoryBroker;

  // ---------------------------------------------------------------------------
  // Broker selection
  // ---------------------------------------------------------------------------
  N.brokerList = function () {
    const q = new URLSearchParams(location.search).get('broker');
    return q ? [q] : P.config.brokers.slice();
  };

  /** Host: connect to the first broker that answers. */
  N.connectHost = async function (clientOpts) {
    let lastErr;
    for (const url of N.brokerList()) {
      const c = new MqttClient(url, clientOpts);
      try { await c.connect(6000); c.url = url; return c; } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('No broker');
  };

  /** Phone: try every broker at once and keep the one where this room exists. */
  N.findRoom = function (code, clientId) {
    const urls = N.brokerList();
    return new Promise((resolve, reject) => {
      let settled = false, pending = urls.length;
      const clients = [];
      const finish = (winner) => {
        if (settled) return;
        settled = true;
        clients.forEach((c) => { if (c !== winner) c.end(); });
        if (winner) resolve(winner); else reject(new Error('notfound'));
      };
      setTimeout(() => finish(null), 9000);
      urls.forEach((url, i) => {
        const c = new MqttClient(url, { clientId: clientId + '-' + i });
        clients.push(c);
        c.on('message', (topic, payload) => {
          if (topic === N.PREFIX + code + '/status' && payload === 'online') finish(c);
        });
        c.connect(6000).then(() => {
          c.url = url;
          if (settled) { c.end(); return; }
          c.subscribe([N.PREFIX + code + '/status']);
          setTimeout(() => { if (--pending === 0) finish(null); }, 3500);
        }).catch(() => { if (--pending === 0) finish(null); });
      });
    });
  };

  // ---------------------------------------------------------------------------
  // Host link: runs the engine and keeps every screen in sync
  // ---------------------------------------------------------------------------
  class HostLink {
    constructor(game, client, opts) {
      this.game = game;
      this.client = client;
      this.opts = opts || {};
      this.base = N.PREFIX + game.s.code + '/';
      this.lastPub = '';
      this.lastPriv = {};
      this.pendingPub = null;
      this.listeners = [];
    }
    onUpdate(fn) { this.listeners.push(fn); }
    start() {
      const g = this.game;
      g.on('change', () => this.schedule());
      g.on('asset', (id, data) => this.client.publish(this.base + 'asset/' + id, data, true));
      this.attach(this.client);
      this.ticker = setInterval(() => g.tick(), 250);
      this.beater = setInterval(() => this.beat(), 4000);
      this.publishNow();
    }
    attach(c) {
      this.client = c;
      c.on('message', (topic, payload) => { if (c === this.client) this.onAct(topic, payload); });
      c.on('close', () => { if (c === this.client) this.reconnect(); });
      c.subscribe([this.base + 'act']);
      c.publish(this.base + 'status', 'online', true);
      Object.keys(this.game.assets).forEach((id) => c.publish(this.base + 'asset/' + id, this.game.assets[id], true));
      this.lastPub = ''; this.lastPriv = {};
      this.schedule();
    }
    onAct(topic, payload) {
      const g = this.game, c = this.client;
      if (topic !== this.base + 'act') return;
      let m; try { m = JSON.parse(payload); } catch (e) { return; }
      if (!m || typeof m.pid !== 'string' || !m.a || typeof m.a.type !== 'string') return;
      const p = g.s.players[m.pid];
      if (p && m.a.type !== 'join' && p.token && p.token !== m.token) return;
      if (!p && m.a.type !== 'join') {
        // a phone we don't know (Host restarted?) - ask it to rejoin
        if (m.token) c.publish(this.base + 'priv/' + m.token, JSON.stringify({ rejoin: true }), false);
        return;
      }
      const wasConnected = p ? p.connected : false;
      const res = g.act(m.pid, Object.assign({}, m.a, { token: m.token }));
      const pl = g.s.players[m.pid];
      if (pl && !res.ok) pl.lastError = { seq: m.a.seq || 0, error: res.error || 'That did not work.', at: Date.now() };
      if (m.a.type === 'join' && !res.ok && m.token) {
        c.publish(this.base + 'priv/' + m.token, JSON.stringify({ removed: true, error: res.error }), false);
      }
      if (m.a.type === 'join') this.lastPriv[m.pid] = '';
      if (!res.quiet || (pl && pl.connected !== wasConnected)) g.changed();
    }
    async reconnect() {
      if (this.closed || !this.opts.reconnect) return;
      this.listeners.forEach((fn) => fn({ connection: 'reconnecting' }));
      for (let i = 0; !this.closed; i++) {
        await new Promise((r) => setTimeout(r, Math.min(8000, 1000 * (i + 1))));
        try { const c = await this.opts.reconnect(); if (this.closed) { c.end(); return; } this.attach(c); break; } catch (e) { /* keep trying */ }
      }
      this.listeners.forEach((fn) => fn({ connection: 'online' }));
    }
    beat() {
      const g = this.game, now = Date.now();
      this.client.publish(this.base + 'beat', String(now), false);
      let changed = false;
      Object.values(g.s.players).forEach((p) => {
        if (p.connected && now - p.lastSeen > 22000 && !p.bot) { g.disconnect(p.id); changed = true; }
      });
      const t = g.s.timer;
      if (changed || (t.main && t.main.endsAt) || (t.screw && t.screw.endsAt)) this.schedule();
    }
    schedule() {
      if (this.pendingPub) return;
      this.pendingPub = setTimeout(() => { this.pendingPub = null; this.publishNow(); }, 60);
    }
    publishNow() {
      if (this.closed) return;
      const g = this.game;
      const pub = g.publicView();
      const s = JSON.stringify(pub);
      if (s !== this.lastPub) { this.lastPub = s; this.client.publish(this.base + 'state', s, true); }
      Object.values(g.s.players).forEach((p) => {
        if (!p.token) return;
        const v = JSON.stringify(g.privateView(p.id));
        if (v !== this.lastPriv[p.id]) { this.lastPriv[p.id] = v; this.client.publish(this.base + 'priv/' + p.token, v, true); }
      });
      this.listeners.forEach((fn) => fn({ view: pub }));
      if (this.opts.save) this.opts.save(g);
    }
    /** Clear retained messages so the broker forgets this room. */
    close() {
      this.closed = true;
      clearInterval(this.ticker); clearInterval(this.beater); clearTimeout(this.pendingPub);
      const c = this.client, b = this.base;
      c.publish(b + 'state', '', true);
      c.publish(b + 'status', 'offline', true);
      c.publish(b + 'status', '', true);
      Object.values(this.game.s.players).forEach((p) => { if (p.token) c.publish(b + 'priv/' + p.token, '', true); });
      Object.keys(this.game.assets).forEach((id) => c.publish(b + 'asset/' + id, '', true));
      setTimeout(() => c.end(), 300);
    }
  }
  N.HostLink = HostLink;

  // ---------------------------------------------------------------------------
  // Player link: one phone
  // ---------------------------------------------------------------------------
  class PlayerLink {
    constructor(client, code, ident, handlers) {
      this.client = client;
      this.code = code;
      this.ident = ident; // {pid, token, seq}
      this.h = handlers;   // {public, private, asset, host}
      this.base = N.PREFIX + code + '/';
      this.pending = [];
      this.ackSeq = 0;
      this.lastBeat = Date.now();
      this.hostOnline = true;
    }
    start(joinAction) {
      this.joinAction = joinAction;
      this.attach(this.client);
      this.pinger = setInterval(() => {
        this.raw({ type: 'ping' });
        const hostAlive = Date.now() - this.lastBeat < 15000;
        if (hostAlive !== this.hostOnline) { this.hostOnline = hostAlive; this.h.host && this.h.host(hostAlive); }
      }, 7000);
      this.resender = setInterval(() => this.flush(), 2500);
    }
    attach(c) {
      this.client = c;
      c.on('message', (topic, payload) => { if (c === this.client) this.onMessage(topic, payload); });
      c.on('close', () => { if (c === this.client) this.reconnect(); });
      c.subscribe([this.base + 'state', this.base + 'priv/' + this.ident.token, this.base + 'asset/+', this.base + 'status', this.base + 'beat']);
      this.joinedOnce = false;
      this.raw(this.joinAction);
    }
    async reconnect() {
      if (this.left || !this.h.reconnect) return;
      this.h.connection && this.h.connection('reconnecting');
      for (let i = 0; !this.left; i++) {
        await new Promise((r) => setTimeout(r, Math.min(6000, 800 * (i + 1))));
        try { const c = await this.h.reconnect(); if (this.left) { c.end(); return; } this.attach(c); break; } catch (e) { /* retry */ }
      }
      this.h.connection && this.h.connection('online');
    }
    onMessage(topic, payload) {
      if (!payload) return;
      const rest = topic.slice(this.base.length);
      if (rest === 'beat') { this.lastBeat = Date.now(); if (!this.hostOnline) { this.hostOnline = true; this.h.host && this.h.host(true); } return; }
      if (rest === 'status') { if (payload === 'offline') { this.hostOnline = false; this.h.host && this.h.host(false); } return; }
      if (rest.indexOf('asset/') === 0) { this.h.asset && this.h.asset(rest.slice(6), payload); return; }
      let v; try { v = JSON.parse(payload); } catch (e) { return; }
      if (rest === 'state') { this.lastBeat = Date.now(); this.h.public && this.h.public(v, Date.now()); }
      else if (rest.indexOf('priv/') === 0) {
        if (v.ackSeq) { this.ackSeq = v.ackSeq; this.pending = this.pending.filter((a) => a.seq > v.ackSeq); }
        if (v.rejoin) { this.joinedOnce = false; this.raw(this.joinAction); return; }
        if (!v.removed && !v.pid) return;
        this.h.private && this.h.private(v);
        if (!v.removed && !this.joinedOnce) this.joinedOnce = true;
      }
    }
    raw(a) { this.client.publish(this.base + 'act', JSON.stringify({ pid: this.ident.pid, token: this.ident.token, a }), false); }
    /** Send an action. Retries until the Host confirms it. */
    send(a) {
      this.ident.seq = Math.max((this.ident.seq || 0) + 1, Date.now());
      const act = Object.assign({}, a, { seq: this.ident.seq });
      if (this.h.saveIdent) this.h.saveIdent(this.ident);
      // newer invention/drawing updates replace older unsent ones
      if (a.type === 'invention' || a.type === 'drawing') this.pending = this.pending.filter((x) => x.type !== a.type);
      this.pending.push(act);
      this.raw(act);
      return act.seq;
    }
    flush() {
      if (!this.joinedOnce) { this.raw(this.joinAction); return; }
      this.pending.filter((a) => a.seq > this.ackSeq).forEach((a) => this.raw(a));
    }
    leave() {
      this.left = true;
      clearInterval(this.pinger); clearInterval(this.resender);
      this.raw({ type: 'bye' });
      setTimeout(() => this.client.end(), 200);
    }
  }
  N.PlayerLink = PlayerLink;
})(window.PITCH = window.PITCH || {});
