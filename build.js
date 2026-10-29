// P!TCH build: stitches src/ into one self-contained HTML file per target.
//   node build.js
// Outputs:
//   docs/index.html          -> the online game (GitHub Pages: main branch, /docs folder)
//   dist/pitch-artifact.html -> the Claude artifact copy (Practice mode only; artifacts block WebSockets)
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const ORDER = ['config.js', 'content.js', 'engine.js', 'net.js', 'ui-core.js', 'ui-tv.js', 'ui-phone.js', 'app.js'];
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\n+$/, '') + '\n';

function bundle(artifact) {
  const js = ORDER.map(f => {
    let code = read(f);
    if (f === 'config.js' && artifact) code = code.replace('artifact: false', 'artifact: true');
    return `/* ===== ${f} ===== */\n${code}`;
  }).join('\n');
  const head = [
    '<title>P!TCH Party Game</title>',
    '<meta name="claude:viewport-fit-sides" content="cover">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bungee&family=Rubik:wght@400;500;600;700;800&display=swap">',
    `<style>\n${read('style.css')}\n</style>`
  ].join('\n');
  const body = [
    '<div id="app"></div>',
    '<noscript>P!TCH needs JavaScript turned on.</noscript>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js" async></script>',
    `<script>\n${js}\n/* ${artifact ? 'artifact' : 'site'} build */\n</script>`
  ].join('\n');
  if (artifact) return `${head}\n\n${body}\n`; // the artifact service adds its own page skeleton
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}

for (const [file, artifact] of [['docs/index.html', false], ['dist/pitch-artifact.html', true]]) {
  const out = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, bundle(artifact));
  console.log('built', file, (fs.statSync(out).size / 1024).toFixed(1) + ' KB');
}
