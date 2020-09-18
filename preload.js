// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
(async function() {
window.addEventListener('DOMContentLoaded', async () => {
  const { sleep } = require('./util')
  console.log(sleep)
  
while (typeof window.webpackJsonp === "undefined") {
  await sleep(1);
}
  const webpack = require('./webpack')
console.log(webpack)
window.webpack = webpack
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
}());