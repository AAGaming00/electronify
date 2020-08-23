// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// Load the core plugins
window.addEventListener('DOMContentLoaded', () => {
require('./tweaks/adblock')

require('./tweaks/titlebar')
})