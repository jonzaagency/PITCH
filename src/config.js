/* P!TCH settings you may want to change. */
window.PITCH = window.PITCH || {};
window.PITCH.config = {
  version: '1.0.0',
  // Where the online game lives (GitHub Pages). Phones join here.
  // Practice mode is hidden from guests. Open the game once with ?owner=<your code> on a device to unlock it there
  // (?owner=off locks it again). This is a fingerprint of the code, not the code itself.
  ownerKey: 'ced680d6',
  pagesUrl: 'https://jonzaagency.github.io/PITCH/',
  // Free public MQTT brokers (secure WebSockets). The Host uses the first one that answers;
  // phones try them all and find the room. Add or reorder freely.
  brokers: [
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://broker.emqx.io:8084/mqtt',
    'wss://mqtt.eclipseprojects.io:443/mqtt'
  ],
  artifact: false
};
