const { remote } = require('electron')
function checkFlag() {
    if(!document.querySelector('.now-playing__pip-toggle')) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      inject()
    }
  }
  checkFlag()
  


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
button.addEventListener ("click", function() {
    win = remote.getCurrentWindow()
    browser = win.webContents.getOwnerBrowserWindow()
    if (document.querySelector('.miniplayer')) {
        console.log(olddim)
        win.removeListener('maximize', unmaximize, false);
        setTimeout(() => browser.setMaximumSize(100000000, 100000000), 200); // why cant i just set it false?
        browser.setMinimumSize(olddim.minWidth, olddim.minHeight)
        setTimeout(() => browser.setSize(olddim.width, olddim.height), 300); // electron bug
        setTimeout(() => {
            browser.setSize(olddim.width, olddim.height)
            document.body.classList.remove('miniplayerStart')
            document.body.classList.remove('miniplayer')
        }, 400); // electron bug
    }
    else {
        document.body.classList.add('miniplayer')
        document.body.classList.add('miniplayerStarting')
        setTimeout(() => {
            document.body.classList.add('miniplayerStart')
            console.log(win)
            olddim.width = browser.getSize()[0]
            olddim.height = browser.getSize()[1]
            olddim.minWidth = browser.getMinimumSize()[0]
            olddim.minHeight = browser.getMinimumSize()[1]
            browser.setMinimumSize(width, height)
            setTimeout(() => browser.setMaximumSize(100000000, height), 200); // :angery:
            setTimeout(() => {
                document.body.classList.remove('miniplayerStarting')
                browser.setSize(width, height)
            }, 3000);
            resetinterval.maximize = win.on('maximize',unmaximize, false);
        }, 2000);
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