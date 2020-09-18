// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
(async function () {
  window.addEventListener('DOMContentLoaded', async () => {
    const { sleep } = require('./util');
    console.log(sleep);
    // wait for webpack
    while (typeof window.webpackJsonp === 'undefined') {
      await sleep(1);
    }

    require('./core/class-normalizer')

    require('./tweaks/adblock');

    require('./tweaks/titlebar');

    require('./tweaks/mini.js');
    // open popups in external browser
    const { shell } = require('electron');
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http') && !event.target.href.includes('open.spotify.com')) {
        event.preventDefault();
        shell.openExternal(event.target.href);
      }
    });
    // expose limited require to the renderer(devtools)
    window.require = function(m) {
      if (m.includes("electronify") && !m.includes('node_modules')) {
        return require(`./${m.replace('electronify/', '')}`)
      }
    }
  });
}());
