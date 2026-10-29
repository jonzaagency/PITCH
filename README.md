# PITCH!

A Jackbox-style party game for 3 to 20+ players, in the same room or online. One browser (TV or laptop) is the Host and runs the game; everyone else plays on their phone.

**Play online:** https://jonzaagency.github.io/PITCH/ (after GitHub Pages is turned on, see below)

## How it's built

- Plain JavaScript, no framework, no server. The Host's browser runs the game engine; phones are controllers.
- Multiplayer goes over free public MQTT brokers on secure WebSockets (HiveMQ, then EMQX, then Eclipse). No accounts needed.
- Claude artifacts block WebSockets, so the artifact copy runs Practice mode only and links to the online game.

| File | What it holds |
| --- | --- |
| `src/config.js` | Settings: version, online URL, broker list |
| `src/content.js` | All the cards and prospect profile pieces (edit freely) |
| `src/engine.js` | The rulebook: roles, rounds, SCREW! cards, scoring, NEPO BABY! shop |
| `src/net.js` | Small MQTT 3.1.1 client and room messaging |
| `src/ui-core.js`, `ui-tv.js`, `ui-phone.js` | Screens for the TV and the phones |
| `src/app.js` | Home screen, Practice mode with bots, startup |
| `src/style.css` | The look |

## Build

```
node build.js
```

This writes `docs/index.html` (the online game) and `dist/pitch-artifact.html` (the Claude artifact copy).

## Turn on the online game

GitHub repo > Settings > Pages > Source: **Deploy from a branch**, Branch: **main**, Folder: **/docs**. The game appears at https://jonzaagency.github.io/PITCH/ a minute later.

## Try it locally

Open `docs/index.html?practice=5` in a browser to play Practice mode against 5 bots.
