#!/bin/bash
# Records video/howto.html to docs/media/how-to-play.mp4 with headless Chrome (real time, about 2 minutes).
set -e
cd "$(dirname "$0")/.."
OUT=$(mktemp -d); PROF=$(mktemp -d)
python3 - "$PWD" "$OUT" <<'PY' &
import http.server, sys, os
ROOT, OUT = sys.argv[1], sys.argv[2]
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def do_POST(s):
        data = s.rfile.read(int(s.headers['Content-Length']))
        open(os.path.join(OUT, os.path.basename(s.path)), 'wb').write(data); s.send_response(200); s.end_headers()
    def log_message(s, *a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', 8798), H).serve_forever()
PY
SRV=$!; sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --user-data-dir="$PROF" --window-size=1920,1224 \
  --auto-accept-this-tab-capture --autoplay-policy=no-user-gesture-required --no-first-run \
  "http://127.0.0.1:8798/video/howto.html?rec=1" >/dev/null 2>&1 &
CH=$!
for i in $(seq 1 200); do [ -f "$OUT/log.txt" ] && break; sleep 1; done
kill $CH $SRV 2>/dev/null || true
cat "$OUT/log.txt"; echo
# re-save through AVFoundation so every player (and the duration) reads it properly
rm -f docs/media/how-to-play.mp4
avconvert -s "$OUT/raw.mp4" -o docs/media/how-to-play.mp4 -p Preset1920x1080 --replace >/dev/null
ls -la docs/media/how-to-play.mp4
