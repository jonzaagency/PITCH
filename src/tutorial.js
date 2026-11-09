/* P!TCH how-to-play walkthrough: a swipeable deck of picture cards, one idea per card.
 * Opens over any screen (home, TV lobby) with P.tutorial.open(). */
(function (P) {
  const U = P.ui, C = P.content;
  const esc = U.esc;

  // little pictures built from the game's own pieces
  const av = (name, color, role) => '<div class="tut-who"><span class="av av-lg" style="--c:' + color + '">' + esc(name[0]) + '</span><b>' + esc(name) + '</b><span class="role-badge rb-' + role + '">' + esc(U.roleName(role)) + '</span></div>';
  const phone = (inner) => '<div class="tut-phone"><div class="tut-notch"></div>' + inner + '</div>';
  const bubble = (who, text, side) => '<div class="tut-bubble ' + (side || '') + '"><b>' + esc(who) + '</b>' + esc(text) + '</div>';

  const SLIDES = [
    { title: 'Welcome to P!TCH', art: () => U.logo('tut-logo'),
      lines: ['One player is the <b>Peddler</b>. They invent a ridiculous product and try to sell it.', 'Everyone else plays along on their phone. <b>Most money at the end wins.</b>'] },
    { title: 'Who’s who', art: () => '<div class="tut-row">' + av('Peddler', '#f0c35a', 'peddler') + av('Prospect', '#8d98f2', 'prospect') + av('Investor', '#82d69c', 'phil') + '</div>',
      lines: ['<b>Peddler:</b> invents, asks questions, pitches.', '<b>Prospects (1–3):</b> play a character with a secret.', '<b>Investors (everyone else):</b> heckle, guess and score.'] },
    { title: '1 · Creation Lab', art: () => '<div class="tut-row tut-cards"><div class="deck deck-item"><span class="deck-k">Item</span><span class="deck-t">Hot tub</span></div><span class="tut-plus">+</span><div class="deck deck-func"><span class="deck-k">Function</span><span class="deck-t">Plays smooth jazz</span></div></div><p class="tut-result">= The Jazz-uzzi 3000</p>',
      lines: ['The Peddler picks an <b>Item</b> and a <b>Function</b>, names it and sketches it.', 'Prospects draw their character. Their <b>fun fact and secret are tied to the product</b>.'] },
    { title: '2 · Fact-Finding', art: () => '<div class="tut-chat">' + bubble('Prospect', 'I was a lifeguard, you know. Summer of ’94.', 'right') + bubble('Peddler', 'Why did you stop lifeguarding?') + bubble('Prospect', 'Oh, I just… rest my eyes near water.', 'right') + bubble('Peddler', 'I bet you napped on the job!') + '</div>' +
        phone('<div class="tut-btn mint">The Peddler guessed my secret!</div><div class="price-tag tut-tag"><span>Peddler</span><b>+$25</b></div>'),
      lines: ['Each Prospect starts with an <b>opening line</b>. Then the Peddler asks questions and <b>guesses secrets out loud</b>.', 'The Peddler only sees a first name and fun fact. Each hidden detail they find out (age, family, job, wants, worries) is ticked off: <b>+$5</b>.', 'Right secret guess? The Prospect taps it in: <b>+$25</b>.'] },
    { title: '3 · The PITCH!', art: () => '<div class="tut-row">' + U.screwIcon('tut-screw') + '<div class="tut-objection"><span class="eyebrow">The Investors object!</span>“I object! My dog would hate this.”</div></div>',
      lines: ['The Peddler sells it to each Prospect, using what they learned.', 'Each Prospect can <b>SCREW!</b> them once: 15 seconds to answer, then everyone votes.', 'Investors send funny <b>objections</b> for Prospects to act out.'] },
    { title: '4 · Objections + Close', art: () => '<div class="tut-chat">' + bubble('Prospect', 'I object! It’s way too loud.', 'right') + bubble('Peddler', 'It has a whisper mode. So, can I count you in today?') + '</div>',
      lines: ['Prospects raise one last objection.', 'The Peddler answers it and <b>asks for the sale</b>.'] },
    { title: 'How Investors score', art: () => '<div class="tut-anchors">' + C.scoreAnchors.map((a, k) =>
        '<div class="tut-anchor a' + k + '"><b>$' + a.min + '–$' + a.max + '</b><span><strong>' + esc(a.name) + '</strong> ' + esc(a.desc) + '</span></div>').join('') + '</div>',
      lines: ['Investors score <b>six categories</b>: Invention, Ingenuity, Fact-Finding, Overcoming Objections, Overall Pitch and The Close.', 'Use the same scale for each one. Your phone shows the band as you slide.'] },
    { title: '5 · Money Reveal', art: () => '<div class="tut-bars">' + ['Invention', 'Fact-Finding', 'The Close'].map((n, i) => '<div class="bar-row" style="--d:' + (0.2 * i) + 's"><span class="bar-name">' + n + '</span><span class="bar"><i style="--w:' + [80, 60, 90][i] + '%"></i></span></div>').join('') + '</div><div class="price-tag big-tag"><span>Peddler earns</span><b>$190</b></div>',
      lines: ['Investors score six categories, $0–$50 each.', 'The Peddler earns the average plus <b>$25 per secret</b>. Then a new Peddler steps up.'] },
    { title: 'Your phone shows the way', art: () => phone('<div class="tut-coach"><b>Fact-Finding game plan</b><ol><li>Talk to every Prospect</li><li>Ask follow-ups</li><li>Guess out loud</li></ol></div><div class="tut-btn gold">Start my PITCH! ›</div>'),
      lines: ['Every phone shows <b>your next step</b>.', 'The Peddler gets a game plan, paid <b>hints</b> (−$10) and a <b>Move on</b> button.', 'Want to practice first? Try <b>Practice mode</b> with bots.'] }
  ];

  let el = null, i = 0, startX = null;

  function render() {
    const s = SLIDES[i];
    el.innerHTML = '<div class="tut" role="dialog" aria-modal="true" aria-label="How to play P!TCH">' +
      '<button class="tut-x" data-tut="close" aria-label="Close">✕</button>' +
      '<div class="tut-step">' + (i + 1) + ' / ' + SLIDES.length + '</div>' +
      '<div class="tut-slide"><div class="tut-art">' + s.art() + '</div><h2>' + esc(s.title) + '</h2><ul class="tut-lines">' + s.lines.map((l) => '<li>' + l + '</li>').join('') + '</ul></div>' +
      '<div class="tut-dots">' + SLIDES.map((_, k) => '<button class="' + (k === i ? 'on' : '') + '" data-tut="go" data-k="' + k + '" aria-label="Card ' + (k + 1) + '"></button>').join('') + '</div>' +
      '<div class="tut-nav"><button class="btn ghost" data-tut="prev"' + (i === 0 ? ' disabled' : '') + '>‹ Back</button>' +
      (i < SLIDES.length - 1 ? '<button class="btn gold big" data-tut="next">Next ›</button>' : '<button class="btn gold big" data-tut="close">Let’s play!</button>') + '</div></div>';
  }
  function go(k) { i = Math.max(0, Math.min(SLIDES.length - 1, k)); render(); }
  function close() { if (el) { el.remove(); el = null; document.removeEventListener('keydown', onKey); } }
  function onKey(e) {
    if (e.key === 'ArrowRight') go(i + 1); else if (e.key === 'ArrowLeft') go(i - 1); else if (e.key === 'Escape') close();
  }

  P.tutorial = {
    open() {
      close();
      i = 0;
      el = document.createElement('div');
      el.className = 'overlay tut-ov';
      document.body.appendChild(el);
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-tut]');
        if (!b) { if (e.target === el) close(); return; }
        const a = b.dataset.tut;
        if (a === 'next') go(i + 1); else if (a === 'prev') go(i - 1); else if (a === 'go') go(Number(b.dataset.k)); else if (a === 'close') close();
      });
      // swipe left/right on phones
      el.addEventListener('pointerdown', (e) => { startX = e.clientX; });
      el.addEventListener('pointerup', (e) => { if (startX == null) return; const dx = e.clientX - startX; startX = null; if (Math.abs(dx) > 60) go(i + (dx < 0 ? 1 : -1)); });
      document.addEventListener('keydown', onKey);
      render();
    },
    close
  };
})(window.PITCH = window.PITCH || {});
