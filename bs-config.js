// browser-sync config for the local preview server (`npm run dev`).
// Dev-only tooling — never shipped to the site. See CLAUDE.md "Local preview server".

const os = require('os');

// Return the machine's first non-internal IPv4 address so the printed preview
// URL is reachable from a phone on the same wifi. Falls back to undefined
// (browser-sync auto-detects, shows localhost) when there is no LAN address.
function lanIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const net of ifaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return undefined;
}

module.exports = {
  server: '.',                 // serve the repo root as static files
  port: 3000,                  // dev preview port (Playwright uses 7777 separately)
  host: lanIp(),               // pin the External URL to the LAN IP
  open: false,                 // never open a browser — use VS Code / the Claude Code app
  notify: false,               // no in-page "Connected" toast
  ui: false,                   // skip the browser-sync control UI on :3001
  files: ['index.html', 'css/*.css', 'js/*.js', 'images/*'],

  // browser-sync always prints both "Local" (localhost) and "External" (LAN IP)
  // and the order can't be changed. Re-print the phone-reachable URL last so it
  // is the obvious one to grab for testing on a device.
  callbacks: {
    ready(_err, bs) {
      const external = bs.options.getIn(['urls', 'external']);
      if (external) console.log('\n  ▶ Open on your phone (same wifi): ' + external + '\n');
    },
  },
};
