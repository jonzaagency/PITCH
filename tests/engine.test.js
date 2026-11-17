// P!TCH engine tests: drives the game rules directly, no browser needed.
//   node tests/engine.test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

global.window = global;
global.PITCH = {};
for (const f of ['config.js', 'content.js', 'engine.js']) {
  vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8'), { filename: f });
}
const C = PITCH.content, E = PITCH.engine;

let passed = 0, failed = 0;
const ok = (cond, msg) => { if (cond) passed++; else { failed++; console.log('FAIL ' + msg); } };
const section = (name) => console.log('- ' + name);

/** A started game with n players, advanced to the given phase. */
function game(n, phase, setup) {
  const g = new E.Game({ code: 'TEST' }), s = g.s;
  for (let i = 0; i < n; i++) g.act('p' + i, { type: 'join', name: 'N' + i });
  if (setup) setup(g);
  g.host('start'); g.host('begin');
  let guard = 0;
  while (s.phase !== phase && guard++ < 20) g.host('next');
  return g;
}

section('Peddler hand');
{
  let boringCounts = new Set(), bad = 0;
  for (let t = 0; t < 40; t++) {
    const g = game(6, 'lab'), h = g.s.round.hand;
    const boring = h.functions.filter((f) => C.boringFunctions.indexOf(f) >= 0).length;
    boringCounts.add(boring);
    if (h.items.length !== E.HAND_SIZE || h.functions.length !== E.HAND_SIZE || boring < 1 || boring > 2 || new Set(h.functions).size !== E.HAND_SIZE) bad++;
  }
  ok(bad === 0, 'every hand has ' + E.HAND_SIZE + ' Items and ' + E.HAND_SIZE + ' Functions, with 1-2 boring Functions');
  ok(boringCounts.has(1) && boringCounts.has(2), 'some hands get 1 boring Function, some get 2');
  const g = game(6, 'lab'), r = g.s.round;
  ok(g.act(r.peddler, { type: 'invention', item: 5, func: 5 }).ok && r.invention.item === 5 && r.invention.func === 5, 'the 6th card can be picked');
}

section('Product-tied stories');
{
  const g = game(7, 'lab'), s = g.s, r = s.round;
  ok(r.prospects.every((id) => !r.profiles[id].secret), 'no story before the Peddler picks an Item');
  g.act(r.peddler, { type: 'invention', item: 0 });
  const mine = (item, pr) => C.storiesFor(item).some((t) => t.secret === pr.secret && t.fact === pr.background);
  const first = r.prospects.map((id) => r.profiles[id].secret);
  ok(first.every(Boolean) && new Set(first).size === first.length, 'picking an Item gives every Prospect a different story');
  ok(r.prospects.every((id) => mine(r.hand.items[0], r.profiles[id])), 'every story belongs to that exact Item');
  g.act(r.peddler, { type: 'invention', item: 1 });
  ok(r.prospects.every((id) => mine(r.hand.items[1], r.profiles[id])), 'switching the Item re-deals that Item’s stories');
  ok(C.items.every((i) => C.storiesFor(i).length === 3), 'every Item has 3 stories of its own');
  ok(C.items.every((i) => C.themes.filter((t) => t.items.indexOf(i) >= 0).length === 1), 'every Item belongs to exactly one category');
  const secrets = C.items.reduce((all, i) => all.concat(C.storiesFor(i).map((t) => t.secret)), []);
  ok(new Set(secrets).size === secrets.length, 'no two stories share a secret');
  let bad = 0, sleuthBad = 0;
  for (let t = 0; t < 30; t++) {
    const g2 = game(7, 'lab'), r2 = g2.s.round;
    if (t % 2) g2.act(r2.peddler, { type: 'invention', item: 2 }); // half the time the Peddler never picks
    g2.host('next');
    const item = r2.hand.items[r2.invention.item], theme = C.themeOf(item);
    const similar = theme.items.filter((x) => x !== item).reduce((all, x) => all.concat(C.storiesFor(x).map((st) => st.secret)), []);
    r2.prospects.forEach((id) => {
      const pr = r2.profiles[id];
      if (!mine(item, pr) || !pr.opener || !pr.ask || pr.secretHints.length !== 3) bad++;
      const opts = r2.sleuth.options[id];
      const same = opts.filter((o) => o !== pr.secret && similar.indexOf(o) >= 0).length;
      if (!(opts.length === 4 && opts.indexOf(pr.secret) >= 0 && new Set(opts).size === 4 && same === 2)) sleuthBad++;
    });
  }
  ok(bad === 0, 'every Prospect’s story comes from the final product');
  ok(sleuthBad === 0, 'Secret Sleuth: real secret + 2 from similar products + 1 other');
}

section('One Prospect, everyone else invests');
{
  [3, 4, 6, 10, 20].forEach((n) => {
    const g = game(n, 'lab'), r = g.s.round;
    ok(r.prospects.length === 1 && r.phils.length === n - 2, n + ' players: 1 Peddler, 1 Prospect, ' + (n - 2) + ' Investors');
  });
  const g = new E.Game({ code: 'TEST' });
  for (let i = 0; i < 6; i++) g.act('p' + i, { type: 'join', name: 'N' + i });
  g.host('start');
  const pr = g.s.proposal, extra = pr.phils[0];
  g.host('setRole', { pid: extra, role: 'prospect' });
  ok(g.s.proposal.prospects.length === 1 && g.s.proposal.prospects[0] === extra, 'making someone the Prospect swaps out the old one');
  ok(!g.validateProposal(g.s.proposal), 'the table is still valid');
}

section('Fact-Finding is part of the pitch');
{
  const g = game(5, 'lab'), s = g.s;
  g.host('next');
  ok(s.phase === 'pitch' && s.timer.main.total === 300000, 'the Creation Lab goes straight to a 5-minute pitch');
  g.host('next');
  ok(s.phase === 'close', 'then Objections + Close');
  const sv = JSON.parse(JSON.stringify(game(5, 'lab').s));
  sv.settings.timers.fact = 150; sv.settings.timers.pitch = 90; sv.settings.maxProspects = 3; sv.phase = 'fact';
  const g2 = new E.Game({ saved: { state: sv, assets: {} } });
  ok(g2.s.phase === 'pitch' && g2.s.settings.timers.pitch === 300 && g2.s.settings.timers.fact === undefined && g2.s.settings.maxProspects === 1, 'an older saved game moves to the new pitch');
}

section('Relationship status variety');
{
  const g = new E.Game({ code: 'TEST' }), seen = [];
  for (let i = 0; i < C.marital.length; i++) seen.push(g.makeProfile([]).marital);
  ok(new Set(seen).size === C.marital.length, 'no repeats until every status has been dealt (' + C.marital.length + ')');
  ok(!C.marital.some((m) => /third/i.test(m)) && C.marital.indexOf('Engaged') >= 0 && C.marital.indexOf('Recently divorced') >= 0 && C.marital.indexOf('Second marriage') >= 0, 'married, engaged, recently divorced, second marriage…');
}

section('Secret Sleuth + INSIDE TRADING');
{
  const g = new E.Game({ code: 'TEST' }), s = g.s;
  for (let i = 0; i < 6; i++) g.act('p' + i, { type: 'join', name: 'N' + i });
  s.players.p0.wallet.cash = 500;
  g.host('start');
  ok(g.act('p0', { type: 'buy', card: 'insider' }).ok, 'buy INSIDE TRADING');
  let guard = 0; while (s.proposal.peddler !== 'p0' && guard++ < 200) g.host('shuffle');
  g.host('begin'); while (s.phase !== 'lab') g.host('next');
  const r = s.round, phil = r.phils[0], phil2 = r.phils[1], pro = r.prospects[0];
  ok(!g.act(phil, { type: 'sleuthPick', target: pro, idx: 0 }).ok, 'no guessing during the Creation Lab');
  g.host('next');
  ok(s.phase === 'pitch' && g.privateView(phil).sleuth.length === 1, 'Investors see the options during the pitch');
  ok(!g.privateView('p0').sleuth && !g.privateView(pro).sleuth, 'Peddler and Prospect do not see the options');
  ok(!g.act('p0', { type: 'nepo', card: 'insider', phil, target: pro }).ok && s.players.p0.wallet.inventory.insider === 1, 'peek fails before a guess, card kept');
  const right = r.sleuth.answer[pro];
  g.act(phil, { type: 'sleuthPick', target: pro, idx: (right + 1) % 4 });
  ok(g.act(phil, { type: 'sleuthPick', target: pro, idx: right }).ok, 'a guess can be changed');
  ok(g.act('p0', { type: 'nepo', card: 'insider', phil, target: pro }).ok && g.privateView('p0').insider.text === r.profiles[pro].secret, 'INSIDE TRADING shows the guess to the Peddler');
  g.act(pro, { type: 'secretAnswer', yes: true });
  ok(!g.act(phil2, { type: 'sleuthPick', target: pro, idx: 0 }).ok, 'no guessing a secret that is already out');
  g.host('next');
  ok(!g.act(phil, { type: 'sleuthPick', target: pro, idx: 0 }).ok, 'guesses lock when the pitch ends');
  while (s.phase !== 'scoring') g.host('next');
  const before = s.players[phil].session.earned;
  r.phils.forEach((id) => g.act(id, { type: 'scorecard', cats: {}, prospects: {} }));
  if (s.phase === 'scoring') g.host('reveal');
  ok(s.players[phil].session.earned - before === E.SLEUTH_BONUS, 'a correct guess pays $' + E.SLEUTH_BONUS);
}

section('Prospects award their own secret');
{
  const g = game(6, 'pitch'), r = g.s.round, pro = r.prospects[0];
  ok(g.act(pro, { type: 'secretAnswer', yes: true }).ok && r.secrets[pro] === 'confirmed', 'a Prospect can award their secret during the pitch');
}

section('Hidden Prospect details');
{
  const g = game(6, 'pitch'), s = g.s, r = s.round, pro = r.prospects[0], pr = r.profiles[pro], inv = r.phils[0];
  const pub = () => g.publicView().round.profiles[pro];
  ok(pub().name === pr.name.split(' ')[0] && pub().background === pr.background, 'public: first name and general situation');
  ok(C.detailFields.every((f) => pub()[f.id] === undefined), 'public: age, status, family, job, motivation, objection all hidden');
  ok(pr.motive && pr.concern, 'every Prospect has a buying motivation and an objection');
  ok(!g.act(r.peddler, { type: 'learned', field: 'age' }).ok && !g.act(pro, { type: 'learned', field: 'age' }).ok, 'the Peddler and the Prospect cannot award details');
  const file = g.privateView(inv).prospectFiles;
  ok(file && file.length === 1 && file[0].details.length === C.detailFields.length && file[0].details.find((d) => d.id === 'age').text === String(pr.age), 'Investors see the Prospect’s hidden facts');
  ok(JSON.stringify(file).indexOf(pr.secret) < 0, '…but not the secret');
  ok(!g.privateView(r.peddler).prospectFiles && !g.privateView(pro).prospectFiles, 'the Peddler and the Prospect do not get the file');
  ok(g.act(inv, { type: 'learned', target: pro, field: 'age' }).ok && pub().age === pr.age && pub().learned === 1, 'an Investor awards a detail and it shows on screen');
  g.act(r.phils[1], { type: 'learned', target: pro, field: 'age' });
  ok(pub().learned === 1, 'two Investors tapping the same fact count it once');
  g.act(inv, { type: 'learned', target: pro, field: 'job' }); g.act(inv, { type: 'learned', target: pro, field: 'motive' });
  g.act(inv, { type: 'learned', target: pro, field: 'motive', on: false });
  ok(pub().motive === undefined && pub().learned === 2, 'a mis-tap can be taken back');
  ok(g.privateView(pro).learned.age && g.privateView(pro).learned.job, 'the Prospect sees what the Peddler has learned');
  ok(!g.act(inv, { type: 'learned', target: pro, field: 'shoeSize' }).ok, 'unknown details are rejected');
  while (s.phase !== 'scoring') g.host('next');
  const before = s.players[r.peddler].session.earned;
  r.phils.forEach((id) => g.act(id, { type: 'scorecard', cats: {}, prospects: {} }));
  if (s.phase === 'scoring') g.host('reveal');
  ok(r.results.details === 2 && r.results.detailBonus === 2 * E.DETAIL_BONUS, '2 details learned = $' + 2 * E.DETAIL_BONUS);
  ok(Math.abs(s.players[r.peddler].session.earned - before - r.results.total) < 0.001 && r.results.total === Math.round((r.results.base + r.results.bonus + r.results.detailBonus) * 100) / 100, 'the detail bonus is paid to the Peddler');
  ok(g.publicView().round.profiles[pro].concern === pr.concern, 'everything is revealed at the Money Reveal');
}

section('Paid hints');
{
  const g = game(6, 'pitch'), s = g.s, r = s.round, [a] = r.prospects;
  const pub = (id) => g.publicView().round.profiles[id];
  ok(pub(a).ask === undefined && !pub(a).hinted, 'the hint question is hidden until bought');
  ok(!g.act(a, { type: 'hint', target: a }).ok, 'only the Peddler can buy hints');
  ok(g.act(r.peddler, { type: 'hint', target: a }).ok && pub(a).ask === r.profiles[a].ask && pub(a).hinted, 'buying a hint reveals that Prospect’s question');
  g.act(r.peddler, { type: 'hint', target: a });
  g.act(r.phils[0], { type: 'learned', target: a, field: 'age' });
  while (s.phase !== 'scoring') g.host('next');
  r.phils.forEach((id) => g.act(id, { type: 'scorecard', cats: { invention: 40, ingenuity: 40, factFinding: 40, objections: 40, pitch: 40, close: 40 }, prospects: {} }));
  if (s.phase === 'scoring') g.host('reveal');
  ok(r.results.hints === 1 && r.results.hintCost === E.HINT_COST, 'one hint (bought twice) costs $' + E.HINT_COST + ' once');
  ok(r.results.total === Math.round((r.results.base + r.results.bonus + r.results.detailBonus - r.results.hintCost) * 100) / 100, 'the hint comes off the Peddler’s total');
  const g2 = game(6, 'pitch'), r2 = g2.s.round;
  r2.prospects.forEach((id) => g2.act(r2.peddler, { type: 'hint', target: id }));
  while (g2.s.phase !== 'scoring') g2.host('next');
  g2.host('reveal');
  ok(r2.results.total === 0 && r2.results.hintCost === 0, 'hints never push earnings below $0');
}

section('SCREW! voting');
{
  const g = game(7, 'pitch'), s = g.s, r = s.round;
  const [a] = r.prospects;
  ok(g.act(a, { type: 'screw', idx: 0 }).ok, 'the Prospect plays a SCREW!');
  ok(!g.act(a, { type: 'screw', idx: 1 }).ok, 'only one SCREW! per round');
  const voters = r.phils;
  ok(voters.every((id) => (g.privateView(id).screwVotes || []).some((x) => x.by === a)), 'the Investors get the vote');
  ok(!(g.privateView(a).screwVotes || []).length && !g.privateView(r.peddler).screwVotes, 'the Prospect and the Peddler do not vote');
  ok(!g.act(voters[0], { type: 'screwVote', by: a, result: 'done' }).ok, 'no voting while the Peddler responds');
  ok(g.act(r.peddler, { type: 'screwDone' }).ok && !r.activeScrew, 'the Peddler can end the response early');
  voters.forEach((id, i) => g.act(id, { type: 'screwVote', by: a, result: i === 0 ? 'missed' : 'done' }));
  ok(r.screwPlayed[a].result === 'done' && r.screwPlayed[a].tally.done === voters.length - 1, 'majority decides');
  ok(!g.publicView().round.screwVotes[a].votes, 'the TV sees counts, not who voted what');
  const g2 = game(7, 'pitch'), r2 = g2.s.round, [b] = r2.prospects;
  g2.s.players[r2.peddler].wallet.inventory.notToday = 1;
  g2.act(b, { type: 'screw', idx: 0 });
  ok(g2.act(r2.peddler, { type: 'nepo', card: 'notToday' }).ok && r2.screwPlayed[b].result === 'cancelled' && !r2.screwVotes[b], 'NOT TODAY! cancels the vote');
  const g3 = game(7, 'pitch'), r3 = g3.s.round, [c] = r3.prospects;
  g3.act(c, { type: 'screw', idx: 0 }); g3.host('screwEnd');
  g3.host('next');
  ok(!r3.screwVotes[c].open, 'open votes close when the pitch ends');
}

section('Peddler moves the round on');
{
  const g = game(6, 'brief'), s = g.s, r = s.round;
  ok(!g.act(r.prospects[0], { type: 'peddlerNext' }).ok, 'a Prospect cannot advance');
  ['lab', 'pitch', 'close', 'scoring'].forEach((want) => ok(g.act(r.peddler, { type: 'peddlerNext' }).ok && s.phase === want, 'Peddler advances to ' + want));
  ok(!g.act(r.peddler, { type: 'peddlerNext' }).ok, 'the Peddler cannot reveal the money');
}

section('Investor objections');
if (typeof E.Game.prototype.a_objectVote === 'function') {
  const gp = game(8, 'pitch');
  ok(!gp.privateView(gp.s.round.phils[0]).objectBoard && !gp.act(gp.s.round.phils[0], { type: 'objectVote', idx: 0 }).ok, 'no Investor objections during the PITCH!');
  const g = game(8, 'close'), s = g.s, r = s.round;
  const inv = r.phils;
  ok(inv.length >= 2, 'enough Investors for the test (' + inv.length + ')');
  const pv = g.privateView(inv[0]).objectBoard;
  ok(pv && pv.options.length === 3, 'Investors see 3 objection options');
  ok(!g.act(r.prospects[0], { type: 'objectVote', idx: 0 }).ok, 'Prospects cannot vote objections');
  inv.forEach((id) => g.act(id, { type: 'objectVote', idx: 1 }));
  const sent = r.investorObjections[r.investorObjections.length - 1];
  ok(sent && sent.text === pv.options[1], 'the top-voted objection is sent');
  ok(g.privateView(sent.to).investorObjection && g.privateView(sent.to).investorObjection.text === sent.text, 'the Prospect gets it on their phone');
  ok(g.act(sent.to, { type: 'objectionDone' }).ok && !g.privateView(sent.to).investorObjection, 'the Prospect can mark it done');
  ok(!g.act(inv[0], { type: 'objectVote', idx: 0 }).ok, 'a short wait is enforced between objections');
  let clock = Date.now();
  g.now = () => clock;
  for (let k = 0; k < 4; k++) { clock += E.OBJECT_COOLDOWN_MS + 1; inv.forEach((id) => g.act(id, { type: 'objectVote', idx: 0 })); }
  ok(r.investorObjections.length === E.OBJECT_MAX, 'at most ' + E.OBJECT_MAX + ' objections per round');
  const counts = r.prospects.map((id) => r.investorObjections.filter((o) => o.to === id).length);
  ok(Math.max.apply(null, counts) - Math.min.apply(null, counts) <= 1, 'objections are spread across the Prospects');
} else console.log('  (not built yet)');

section('Next round starts by itself');
if (E.AUTO_NEXT_SEC) {
  const toReveal = (g) => {
    const s = g.s;
    while (s.phase !== 'scoring') g.host('next');
    s.round.phils.forEach((id) => g.act(id, { type: 'scorecard', cats: { invention: 30, ingenuity: 30, factFinding: 30, objections: 30, pitch: 30, close: 30 }, prospects: {} }));
    if (s.phase === 'scoring') g.host('reveal');
  };
  let clock = Date.now();
  const g = game(6, 'pitch', (g) => { g.now = () => clock; });
  const s = g.s;
  toReveal(g);
  ok(s.phase === 'reveal' && s.timer.main && g.remaining(s.timer.main) === E.AUTO_NEXT_SEC * 1000, 'the Money Reveal shows a ' + E.AUTO_NEXT_SEC + '-second countdown');
  let saved = 0; g.on('roundOver', () => { saved++; });
  const n = s.round.n, oldPeddler = s.round.peddler;
  clock += 15000; g.tick();
  ok(s.phase === 'reveal', 'nothing happens before the countdown ends');
  g.host('pause'); clock += 60000; g.tick();
  ok(s.phase === 'reveal', 'Hold stops the countdown');
  g.host('resume'); clock += 15001; g.tick();
  ok(s.round.n === n + 1 && s.round.peddler !== oldPeddler && ['brief', 'lab'].indexOf(s.phase) >= 0, 'the next round starts by itself with a new Peddler');
  ok(saved === 1, 'Hall of Fame votes are saved before the round is replaced');
  const g2 = game(6, 'pitch');
  toReveal(g2);
  ok(g2.host('startNow').ok && g2.s.round.n === 2, 'the Host can start the next round right away');
  const g3 = game(6, 'pitch', (g) => g.host('settings', { autoNext: false }));
  toReveal(g3);
  ok(!g3.s.timer.main, 'the countdown can be turned off in Settings');
  const g4 = game(6, 'pitch', (g) => g.host('settings', { rounds: 1 }));
  toReveal(g4);
  ok(!g4.s.timer.main && g4.s.phase === 'reveal', 'no countdown after the last planned round');
} else console.log('  (not built yet)');

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
