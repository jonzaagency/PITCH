/* P!TCH background music: looping tracks on the TV only, quietly, with a track per phase.
 * Files live in docs/music/ (copied there by build.js from src/music/).
 *   U.music.setMood(name)   pick the track for a phase (plays once audio is unlocked by a tap)
 *   U.music.duck(true)      drop to a whisper (SCREW!, paused game)
 *   U.music.setOn(bool), U.music.setVolume(0-100) */
(function (P) {
  const U = P.ui;

  // frames = the track's real length in samples, so the loop skips the encoder's silent padding
  const TRACKS = {
    saturday: { file: 'music/groovy-saturday.m4a', frames: 1671165 },
    party: { file: 'music/high-end-party.m4a', frames: 1881600 },
    booty: { file: 'music/groovy-booty.m4a', frames: 2451042 },
    // a fanfare: plays once, then hands over to the next track
    victory: { file: 'music/victory.m4a', frames: 352800, once: true, then: 'saturday' }
  };
  const PRIMING = 2112; // AAC encoder delay at the start of each file
  const PHASE_TRACK = {
    lobby: 'saturday', roles: 'saturday', brief: 'saturday',
    lab: 'party', // drawing and naming the product
    fact: 'booty', pitch: 'booty', close: 'booty', scoring: 'booty',
    reveal: 'victory', awards: 'saturday', final: 'saturday'
  };

  let ctx = null, out = null;
  let want = null;          // track that should be playing
  let asked = null;         // last track a phase asked for
  let playing = null;       // { name, src, gain }
  const buffers = {}, loading = {};
  let on = U.store.get('pitch.music', true) !== false;
  let volume = U.store.get('pitch.musicVol', 35);
  let ducked = false;
  const level = () => (on && !U.muted ? Math.pow(volume / 100, 1.5) * 0.6 * (ducked ? 0.3 : 1) : 0);

  function setup() {
    ctx = U.audioCtx();
    if (!ctx) return false;
    if (!out) { out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination); }
    return true;
  }
  function fade() { if (out) { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setTargetAtTime(level(), ctx.currentTime, 0.5); } }

  function load(name) {
    if (buffers[name] || loading[name]) return;
    loading[name] = fetch(TRACKS[name].file)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((data) => new Promise((ok, bad) => ctx.decodeAudioData(data, ok, bad)))
      .then((buf) => { buffers[name] = buf; loading[name] = null; sync(); })
      .catch(() => { loading[name] = null; /* offline copy or blocked: no music */ });
  }

  function startTrack(name) {
    const buf = buffers[name], t = TRACKS[name];
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = buf; src.loop = !t.once;
    if (t.once) {
      load(t.then); // have the next track ready
      src.onended = () => { if (playing && playing.src === src) { playing = null; if (want === name) { want = t.then; sync(); } } };
    }
    // if the decoder kept the encoder padding, loop only the real music so there is no gap
    if (!t.once && buf.length > t.frames) {
      const pad = buf.length - t.frames >= PRIMING ? PRIMING : 0;
      src.loopStart = pad / buf.sampleRate;
      src.loopEnd = (pad + t.frames) / buf.sampleRate;
    }
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + (t.once ? 0.05 : 1.2));
    src.connect(g); g.connect(out);
    src.start(ctx.currentTime, t.once ? 0 : src.loopStart || 0);
    return { name, src, g };
  }
  function stopTrack(p, secs) {
    if (!p) return;
    const now = ctx.currentTime;
    p.g.gain.cancelScheduledValues(now);
    p.g.gain.setValueAtTime(Math.max(0.0001, p.g.gain.value), now);
    p.g.gain.exponentialRampToValueAtTime(0.0001, now + secs);
    try { p.src.stop(now + secs + 0.05); } catch (e) { /* already stopped */ }
  }

  /** Make what is playing match what should be playing. */
  function sync() {
    if (!setup()) return;
    const active = on && !U.muted && want;
    if (!active) { fade(); return; }
    if (ctx.state === 'suspended') ctx.resume();
    if (playing && playing.name === want) { fade(); return; }
    if (!buffers[want]) { load(want); return; }
    stopTrack(playing, 1.5); // crossfade into the new track
    playing = startTrack(want);
    fade();
  }

  U.music = {
    moodFor: (phase) => PHASE_TRACK[phase] || 'saturday',
    setMood(name) {
      if (!TRACKS[name]) name = 'saturday';
      // same phase as before: just make sure something is playing (audio may have been locked until now)
      if (name === asked) { if (!playing) sync(); return; }
      asked = name;
      want = name;
      sync();
    },
    duck(v) { if (ducked !== !!v) { ducked = !!v; fade(); } },
    isOn: () => on,
    setOn(v) { on = !!v; U.store.set('pitch.music', on); sync(); },
    volume: () => volume,
    setVolume(v) { volume = Math.max(0, Math.min(100, Math.round(v))); U.store.set('pitch.musicVol', volume); fade(); },
    refresh() { sync(); }, // after the sound mute button
    stop() { want = null; asked = null; if (ctx && playing) { stopTrack(playing, 0.8); playing = null; } fade(); }
  };
})(window.PITCH = window.PITCH || {});
