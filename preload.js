// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
require('./tweaks/adblock')

require('./tweaks/titlebar')

require('./tweaks/mini.js')
// open popups in external browser
let shell = require('electron').shell
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http') && !event.target.href.includes('open.spotify.com')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
})
})