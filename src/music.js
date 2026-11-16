/* P!TCH background music: a small generative band built with Web Audio (no files, nothing to license).
 * Plays on the TV only, quietly, and changes mood with each phase of the round.
 *   U.music.setMood('pitch')   pick the mood for a phase (starts playing once audio is unlocked)
 *   U.music.duck(true)         drop to a whisper (SCREW!, paused game)
 *   U.music.setOn(bool), U.music.setVolume(0-100) */
(function (P) {
  const U = P.ui;

  // ---------- the moods ----------
  // chords: one per bar, [root MIDI note, quality]. Patterns are 16 steps (16th notes) per bar.
  const Q = { maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], dom7: [0, 4, 7, 10], m9: [0, 3, 7, 10, 14], maj9: [0, 4, 7, 11, 14], six: [0, 4, 7, 9], sus: [0, 5, 7, 10] };
  const x = (s) => s.split('').map((c) => (c === '.' ? 0 : c === 'x' ? 1 : c === 'o' ? 0.55 : 0));
  const MOODS = {
    // lobby, roles, briefing: easy lounge
    lounge: { bpm: 86, swing: 0.16, chords: [[53, 'maj9'], [52, 'm7'], [50, 'm9'], [55, 'dom7']],
      kick: x('x.......x.o.....'), snare: x('....o.......o...'), hat: x('o.o.o.o.o.o.o.o.'),
      bass: [0, null, null, null, null, null, 7, null, 0, null, null, null, 12, null, 7, null], comp: x('x.....o.....o...'), mel: 0.12 },
    // Creation Lab: bouncy and curious
    lab: { bpm: 98, swing: 0.1, chords: [[48, 'maj7'], [45, 'dom7'], [50, 'm7'], [43, 'dom7']],
      kick: x('x.....x...x.....'), snare: x('....x.......x...'), hat: x('..o...o...o...o.'),
      bass: [0, null, null, 12, null, null, 7, null, null, 12, 0, null, 7, null, 10, null], comp: x('..x...x...x...x.'), mel: 0.3, pluck: true },
    // Fact-Finding: sneaky detective
    fact: { bpm: 84, swing: 0.18, chords: [[45, 'm9'], [45, 'm7'], [41, 'maj7'], [40, 'dom7']],
      kick: x('x.......x.......'), snare: x('......o.......o.'), hat: x('o...o...o...o.o.'),
      bass: [0, null, null, null, 3, null, null, null, 7, null, null, null, 10, null, 7, null], comp: x('x.......o.......'), mel: 0.18, pluck: true },
    // The pitch: upbeat showtime
    pitch: { bpm: 112, swing: 0.06, chords: [[48, 'six'], [45, 'm7'], [41, 'maj9'], [43, 'dom7']],
      kick: x('x...x...x...x...'), snare: x('....x.......x...'), hat: x('o.x.o.x.o.x.o.x.'),
      bass: [0, null, 12, null, 0, null, 12, null, 0, null, 12, null, 7, null, 12, null], comp: x('..x...x...x...x.'), mel: 0.22 },
    // Objections + Close: a bit of tension
    close: { bpm: 104, swing: 0.04, chords: [[50, 'm7'], [46, 'maj7'], [43, 'm7'], [45, 'sus']],
      kick: x('x.....x.x.......'), snare: x('....x.......x..o'), hat: x('xoxoxoxoxoxoxoxo'),
      bass: [0, null, 0, null, 0, null, 0, null, 0, null, 0, null, 3, null, 5, null], comp: x('x.......x.......'), mel: 0.1 },
    // Scoring: thinking music
    scoring: { bpm: 76, swing: 0.12, chords: [[51, 'maj9'], [48, 'm9'], [44, 'maj7'], [46, 'sus']],
      kick: x('x...............'), snare: x('................'), hat: x('....o.......o...'),
      bass: [0, null, null, null, null, null, null, null, 7, null, null, null, null, null, null, null], comp: x('x...............'), mel: 0.08 },
    // Money Reveal, awards, final results: celebration
    party: { bpm: 108, swing: 0.08, chords: [[53, 'maj7'], [55, 'six'], [52, 'm7'], [57, 'm7']],
      kick: x('x...x...x...x...'), snare: x('....x.......x...'), hat: x('ooxoooxoooxoooxo'),
      bass: [0, null, null, 7, null, null, 12, null, 0, null, null, 7, null, 10, 12, null], comp: x('x..x..x...x..x..'), mel: 0.3, pluck: true }
  };
  const PHASE_MOOD = { lobby: 'lounge', roles: 'lounge', brief: 'lounge', lab: 'lab', fact: 'fact', pitch: 'pitch', close: 'close', scoring: 'scoring', reveal: 'party', awards: 'party', final: 'party' };

  // ---------- state ----------
  let ctx = null, out = null, keysBus = null, noise = null;
  let mood = null, nextMood = null, timer = null, nextAt = 0, step = 0, bar = 0;
  let on = U.store.get('pitch.music', true) !== false;
  let volume = U.store.get('pitch.musicVol', 35);
  let ducked = false;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const level = () => (on && !U.muted ? (volume / 100) * 0.16 * (ducked ? 0.3 : 1) : 0);

  function build() {
    ctx = U.audioCtx();
    if (!ctx || out) return !!out;
    out = ctx.createGain(); out.gain.value = 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 4200;
    out.connect(tone); tone.connect(comp); comp.connect(ctx.destination);
    // keys get a soft echo for some room sound
    keysBus = ctx.createGain(); keysBus.connect(out);
    const dly = ctx.createDelay(1); dly.delayTime.value = 0.33;
    const fb = ctx.createGain(); fb.gain.value = 0.28;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    keysBus.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(out);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function fade() { if (out) { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setTargetAtTime(level(), ctx.currentTime, 0.6); } }

  // ---------- instruments ----------
  function env(g, t, peak, a, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function keys(notes, t, dur, vel) {
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1600; f.connect(keysBus);
    notes.forEach((m, i) => {
      [['sine', 0], ['triangle', 4]].forEach(([type, cents]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = mtof(m); o.detune.value = cents;
        env(g, t + i * 0.012, 0.05 * vel, 0.03, dur);
        o.connect(g); g.connect(f); o.start(t); o.stop(t + dur + 0.05);
      });
    });
  }
  function bass(m, t, dur) {
    const o = ctx.createOscillator(), s = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'triangle'; s.type = 'sine'; o.frequency.value = mtof(m); s.frequency.value = mtof(m - 12);
    f.type = 'lowpass'; f.frequency.value = 700;
    env(g, t, 0.22, 0.01, dur);
    o.connect(f); s.connect(f); f.connect(g); g.connect(out);
    o.start(t); s.start(t); o.stop(t + dur + 0.05); s.stop(t + dur + 0.05);
  }
  function lead(m, t, dur, pluck) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = pluck ? 'square' : 'sine'; o.frequency.value = mtof(m);
    f.type = 'lowpass'; f.frequency.value = pluck ? 1400 : 2400;
    env(g, t, pluck ? 0.035 : 0.05, 0.01, pluck ? Math.min(dur, 0.25) : dur);
    o.connect(f); f.connect(g); g.connect(keysBus); o.start(t); o.stop(t + dur + 0.05);
  }
  function kick(t, v) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    env(g, t, 0.5 * v, 0.004, 0.22);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.25);
  }
  function hiss(t, v, type, freq, dur, peak) {
    const n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noise; f.type = type; f.frequency.value = freq;
    env(g, t, peak * v, 0.002, dur);
    n.connect(f); f.connect(g); g.connect(out); n.start(t, Math.random() * 0.5); n.stop(t + dur + 0.02);
  }

  // ---------- sequencer ----------
  function playStep(t) {
    const M = MOODS[mood];
    const sixteenth = 60 / M.bpm / 4;
    const [root, q] = M.chords[bar % M.chords.length];
    const chord = Q[q].map((iv) => root + 12 + iv);
    const i = step;
    if (M.kick[i]) kick(t, M.kick[i]);
    if (M.snare[i]) hiss(t, M.snare[i], 'bandpass', 1800, 0.14, 0.12);
    if (M.hat[i]) hiss(t, M.hat[i], 'highpass', 7500, M.hat[i] < 1 ? 0.04 : 0.07, 0.05);
    if (M.bass[i] != null) bass(root - 12 + M.bass[i], t, sixteenth * 1.8);
    if (M.comp[i]) keys(chord, t, sixteenth * (i === 0 ? 7 : 3), M.comp[i]);
    // a light, random melody over the chord, mostly on 8th notes
    if (i % 2 === 0 && Math.random() < M.mel) {
      const pool = chord.concat(chord.map((n) => n + 12));
      lead(pool[Math.floor(Math.random() * pool.length)] + 12, t, sixteenth * (Math.random() < 0.3 ? 4 : 2), M.pluck);
    }
  }
  function schedule() {
    if (!ctx || !mood) return;
    if (ctx.state !== 'running') { nextAt = ctx.currentTime + 0.1; return; }
    const ahead = document.hidden ? 1.5 : 0.3; // background tabs only wake about once a second
    if (nextAt < ctx.currentTime) nextAt = ctx.currentTime + 0.05;
    while (nextAt < ctx.currentTime + ahead) {
      const M = MOODS[mood];
      const sixteenth = 60 / M.bpm / 4;
      playStep(nextAt + (step % 2 ? M.swing * sixteenth : 0));
      nextAt += sixteenth;
      step = (step + 1) % 16;
      if (step === 0) {
        bar += 1;
        if (nextMood && nextMood !== mood) { mood = nextMood; bar = 0; } // change mood on the bar line
      }
    }
  }
  function run() {
    if (!build() || timer) return;
    nextAt = ctx.currentTime + 0.1; step = 0; bar = 0;
    timer = setInterval(schedule, 80);
    fade();
  }
  function halt() { if (timer) { clearInterval(timer); timer = null; } fade(); }

  U.music = {
    moodFor: (phase) => PHASE_MOOD[phase] || 'lounge',
    setMood(name) {
      if (!MOODS[name]) name = 'lounge';
      if (!mood) mood = name;
      nextMood = name;
      if (on && !U.muted) run();
    },
    duck(v) { if (ducked !== !!v) { ducked = !!v; fade(); } },
    isOn: () => on,
    setOn(v) {
      on = !!v; U.store.set('pitch.music', on);
      if (on && mood) run(); else halt();
    },
    volume: () => volume,
    setVolume(v) { volume = Math.max(0, Math.min(100, Math.round(v))); U.store.set('pitch.musicVol', volume); fade(); },
    refresh() { if (on && !U.muted && mood) run(); else halt(); }, // after the sound mute button
    stop() { halt(); mood = null; nextMood = null; }
  };
})(window.PITCH = window.PITCH || {});
