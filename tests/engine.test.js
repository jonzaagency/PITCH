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

section('Product-tied stories');
{
  const g = game(7, 'lab'), s = g.s, r = s.round;
  ok(r.prospects.every((id) => !r.profiles[id].secret), 'no story before the Peddler picks an Item');
  g.act(r.peddler, { type: 'invention', item: 0 });
  const first = r.prospects.map((id) => r.profiles[id].secret);
  ok(first.every(Boolean) && new Set(first).size === first.length, 'picking an Item gives every Prospect a different story');
  g.act(r.peddler, { type: 'invention', item: 1 });
  ok(r.prospects.every((id) => r.profiles[id].secretTopic === C.themeOf(r.hand.items[1]).id), 'switching the Item re-deals from the new theme');
  ok(C.items.every((i) => C.themes.filter((t) => t.items.indexOf(i) >= 0).length === 1), 'every Item belongs to exactly one theme');
  let bad = 0, sleuthBad = 0;
  for (let t = 0; t < 30; t++) {
    const g2 = game(7, 'lab'), r2 = g2.s.round;
    if (t % 2) g2.act(r2.peddler, { type: 'invention', item: 2 }); // half the time the Peddler never picks
    g2.host('next');
    const item = r2.hand.items[r2.invention.item], theme = C.themeOf(item);
    r2.prospects.forEach((id) => {
      const pr = r2.profiles[id];
      if (pr.secretTopic !== theme.id || !pr.background || !pr.secret || pr.secretHints.length !== 3) bad++;
      const opts = r2.sleuth.options[id];
      const same = opts.filter((o) => o !== pr.secret && theme.stories.some((_, i) => C.tell(theme, i, item).secret === o)).length;
      if (!(opts.length === 4 && opts.indexOf(pr.secret) >= 0 && same === 2)) sleuthBad++;
    });
  }
  ok(bad === 0, 'every story matches the final product theme');
  ok(sleuthBad === 0, 'Secret Sleuth: real secret + 2 same-theme decoys + 1 other');
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
  const r = s.round, phil = r.phils[0], pro = r.prospects[0], pro2 = r.prospects[1];
  ok(!g.act(phil, { type: 'sleuthPick', target: pro, idx: 0 }).ok, 'no guessing during the Creation Lab');
  g.host('next');
  ok(s.phase === 'fact' && g.privateView(phil).sleuth.length === r.prospects.length, 'Inventors see options for every Prospect');
  ok(!g.privateView('p0').sleuth && !g.privateView(pro).sleuth, 'Peddler and Prospects do not see the options');
  ok(!g.act('p0', { type: 'nepo', card: 'insider', phil, target: pro }).ok && s.players.p0.wallet.inventory.insider === 1, 'peek fails before a guess, card kept');
  const right = r.sleuth.answer[pro];
  g.act(phil, { type: 'sleuthPick', target: pro, idx: (right + 1) % 4 });
  ok(g.act(phil, { type: 'sleuthPick', target: pro, idx: right }).ok, 'a guess can be changed');
  ok(g.act('p0', { type: 'nepo', card: 'insider', phil, target: pro }).ok && g.privateView('p0').insider.text === r.profiles[pro].secret, 'INSIDE TRADING shows the guess to the Peddler');
  g.act(pro2, { type: 'secretAnswer', yes: true });
  ok(!g.act(phil, { type: 'sleuthPick', target: pro2, idx: 0 }).ok, 'no guessing a secret that is already out');
  g.host('next');
  ok(!g.act(phil, { type: 'sleuthPick', target: pro, idx: 0 }).ok, 'guesses lock after Fact-Finding');
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

section('SCREW! voting');
{
  const g = game(7, 'pitch'), s = g.s, r = s.round;
  const [a, b, c] = r.prospects;
  ok(g.act(a, { type: 'screw', idx: 0 }).ok, 'a Prospect plays a SCREW!');
  const voters = r.phils.concat(r.prospects).filter((id) => id !== a);
  ok(voters.every((id) => (g.privateView(id).screwVotes || []).some((x) => x.by === a)), 'Inventors and other Prospects get the vote');
  ok(!(g.privateView(a).screwVotes || []).length && !g.privateView(r.peddler).screwVotes, 'the player who played it and the Peddler do not vote');
  ok(!g.act(voters[0], { type: 'screwVote', by: a, result: 'done' }).ok, 'no voting while the Peddler responds');
  ok(g.act(r.peddler, { type: 'screwDone' }).ok && !r.activeScrew, 'the Peddler can end the response early');
  voters.forEach((id, i) => g.act(id, { type: 'screwVote', by: a, result: i === 0 ? 'missed' : 'done' }));
  ok(r.screwPlayed[a].result === 'done' && r.screwPlayed[a].tally.done === voters.length - 1, 'majority decides');
  g.act(b, { type: 'screw', idx: 0 }); g.host('screwEnd');
  s.players[r.peddler].wallet.inventory.notToday = 1;
  g.act(c, { type: 'screw', idx: 0 });
  ok(g.act(r.peddler, { type: 'nepo', card: 'notToday' }).ok && r.screwPlayed[c].result === 'cancelled' && !r.screwVotes[c], 'NOT TODAY! cancels the vote');
  g.host('next');
  ok(!r.screwVotes[b].open, 'open votes close when the pitch ends');
  ok(!g.publicView().round.screwVotes[a].votes, 'the TV sees counts, not who voted what');
}

section('Peddler moves the round on');
{
  const g = game(6, 'brief'), s = g.s, r = s.round;
  ok(!g.act(r.prospects[0], { type: 'peddlerNext' }).ok, 'a Prospect cannot advance');
  ['lab', 'fact', 'pitch', 'close', 'scoring'].forEach((want) => ok(g.act(r.peddler, { type: 'peddlerNext' }).ok && s.phase === want, 'Peddler advances to ' + want));
  ok(!g.act(r.peddler, { type: 'peddlerNext' }).ok, 'the Peddler cannot reveal the money');
}

section('Inventor objections');
if (typeof E.Game.prototype.a_objectVote === 'function') {
  const g = game(8, 'pitch'), s = g.s, r = s.round;
  const inv = r.phils;
  ok(inv.length >= 2, 'enough Inventors for the test (' + inv.length + ')');
  const pv = g.privateView(inv[0]).objectBoard;
  ok(pv && pv.options.length === 3, 'Inventors see 3 objection options');
  ok(!g.act(r.prospects[0], { type: 'objectVote', idx: 0 }).ok, 'Prospects cannot vote objections');
  inv.forEach((id) => g.act(id, { type: 'objectVote', idx: 1 }));
  const sent = r.inventorObjections[r.inventorObjections.length - 1];
  ok(sent && sent.text === pv.options[1], 'the top-voted objection is sent');
  ok(g.privateView(sent.to).inventorObjection && g.privateView(sent.to).inventorObjection.text === sent.text, 'the Prospect gets it on their phone');
  ok(g.act(sent.to, { type: 'objectionDone' }).ok && !g.privateView(sent.to).inventorObjection, 'the Prospect can mark it done');
} else console.log('  (not built yet)');

console.log(`${passed} passed, ${failed} failed`);
process.exitCode = failed ? 1 : 0;
