const { remote } = require('electron')
function checkFlag() {
    if(!document.querySelector('.now-playing__pip-toggle')) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      inject()
    }
  }
  checkFlag()
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

// 1. Create the button
function inject() {
var button = document.querySelector(".now-playing__pip-toggle");
var new_element = button.cloneNode(true);
button.parentNode.replaceChild(new_element, button);
button = document.querySelector(".now-playing__pip-toggle");
// 3. Add event handler
let olddim = new Object();
let resetinterval = new Object();
let win;
let browser;
function unmaximize(e) {
    e.preventDefault()
    browser.unmaximize()
}
const width = 1280;
const minWidth = 800;
const height = 120;
button.addEventListener ("click", async function() {
    win = remote.getCurrentWindow()
    browser = win.webContents.getOwnerBrowserWindow()
    if (document.querySelector('.miniplayer')) {
        console.log(olddim)
        win.removeListener('maximize', unmaximize, false);
        setTimeout(() => browser.setMaximumSize(100000000, 100000000), 200); // why cant i just set it false?
        browser.setMinimumSize(olddim.minWidth, olddim.minHeight)
        setTimeout(() => browser.setSize(olddim.width, olddim.height), 300); // electron bug
        await sleep(400)
        document.body.classList.add('miniplayerEnd')
        document.body.classList.add('miniplayerStarting')
        await sleep(100)
        document.body.classList.remove('miniplayerEnd')
        browser.setSize(olddim.width, olddim.height)
        document.body.classList.remove('miniplayerStarting')
        document.body.classList.remove('miniplayerStart')
        document.body.classList.remove('miniplayer')
    }
    else {
        document.body.classList.add('miniplayer')
        document.body.classList.add('miniplayerStarting')
        document.body.classList.add('miniplayerStart')
        await sleep(700)
        console.log(win)
        olddim.width = browser.getSize()[0]
        olddim.height = browser.getSize()[1]
        olddim.minWidth = browser.getMinimumSize()[0]
        olddim.minHeight = browser.getMinimumSize()[1]
        browser.setMinimumSize(width, height)
        setTimeout(() => browser.setMaximumSize(100000000, height), 200); // :angery:
        await sleep(100)
        document.body.classList.remove('miniplayerStarting')
        document.body.classList.add('miniplayerStarted')
        await sleep(100)
        browser.setSize(width, height)
        await sleep(200)
        document.body.classList.remove('miniplayerStarted')  
        resetinterval.maximize = win.on('maximize',unmaximize, false);
    }
});
}
function start() {
    const win = remote.getCurrentWindow()
    const browser = win.webContents.getOwnerBrowserWindow()
    setTimeout(() => browser.setMaximumSize(100000000, 100000000), 200); // why cant i just set it false?
    browser.setMinimumSize(800, 600)
    setTimeout(() => browser.setSize(1280, 720) , 300); // why


}
start()