// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

  !async function () {

    async function queryAsync(query) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const element = document.querySelector(query);
                if (element) {
                    clearInterval(interval);
                    return resolve(element);
                }
            }, 250);
        });
    }

    /**
     * Inject a middleware function in a object or instance
     * @param ctx Object or instance
     * @param fn Function name
     * @param middleware Middleware function
     * @param transform Transform function result
     */
    function inject({ctx, fn, middleware, transform}) {
        const original = ctx[fn];
        ctx[fn] = function () {
            if (!middleware || middleware.call(this, ...arguments) !== false) {
                const result = original.call(this, ...arguments);
                return transform ? transform.call(this, result, ...arguments) : result;
            }
        };
    }

    const nowPlayingBar = await queryAsync('.now-playing-bar');
    const playButton = await queryAsync('button[title=Play], button[title=Pause]');

    let audio;

    inject({
        ctx: document,
        fn: 'createElement',
        transform(result, type) {

            if (type === 'audio') {
                audio = result;
            }

            return result;
        }
    });

    let playInterval;
    new MutationObserver(() => {
        const link = document.querySelector('.now-playing > a');

        if (link) {

            if (!audio) {
                return console.error('Audio-element not found!');
            }

            if (!playButton) {
                return console.error('Play-button not found!');
            }

            // console.log('Ad found', audio, playButton, nowPlayingBar);

            audio.src = '';
            playButton.click();
            if (!playInterval) {
                playInterval = setInterval(() => {
                    if (!document.querySelector('.now-playing > a') && playButton.title === 'Pause') {
                        clearInterval(playInterval);
                        playInterval = null;
                    } else {
                        playButton.click();
                    }
                }, 500);
            }
        }
    }).observe(nowPlayingBar, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true
    });

    // Hide upgrade-button and captcha-errors, we don't what to see that.
    const style = document.createElement('style');
    style.innerHTML = `
        [aria-label="Upgrade to Premium"],
        body > div:not(#main) {
            display: none !important;
        }
    `;

    document.body.appendChild(style);
    var header = document.querySelector('main-view-container__scroll-node-child-spacer')[0]
    var drag = document.createElement('div')
    header.id = 'titlebar'
    drag.id = 'drag-region'
    header.appendChild(drag)
    header.insertAdjacentHTML('beforeend', `
      <div id="window-title">
        <span>Electron quick start</span>
      </div>

      <div id="window-controls">
        <div class="button" id="min-button">
          <svg width="11" height="1" viewBox="0 0 11 1">
            <path d="m11 0v1h-11v-1z" stroke-width=".26208"/>
          </svg>
        </div>
        <div class="button" id="max-button">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="m10-1.6667e-6v10h-10v-10zm-1.001 1.001h-7.998v7.998h7.998z" stroke-width=".25" />
          </svg>
        </div>
        <div class="button" id="restore-button">
          <svg width="11" height="11" viewBox="0 0 11 11">
            <path
              d="m11 8.7978h-2.2021v2.2022h-8.7979v-8.7978h2.2021v-2.2022h8.7979zm-3.2979-5.5h-6.6012v6.6011h6.6012zm2.1968-2.1968h-6.6012v1.1011h5.5v5.5h1.1011z"
              stroke-width=".275" />
          </svg>
        </div>
        <div class="button" id="close-button">
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="m6.8496 6 5.1504 5.1504-0.84961 0.84961-5.1504-5.1504-5.1504 5.1504-0.84961-0.84961 5.1504-5.1504-5.1504-5.1504 0.84961-0.84961 5.1504 5.1504 5.1504-5.1504 0.84961 0.84961z"
              stroke-width=".3" />
          </svg>
        </div>
      </div>`)
    
const remote = require('electron').remote;

const win = remote.getCurrentWindow(); /* Note this is different to the
html global `window` variable */

// When document has loaded, initialise

handleWindowControls();


window.onbeforeunload = (event) => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", event => {
        win.close();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }
}
// set up an observer for the title element
var target = document.querySelector('head > title');
var lastTitle;
var observer = new window.WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) { //prevent recursion recursion recursion recursion...
      if (mutation.target.textContent !== lastTitle) {
      mutation.target.textContent = mutation.target.textContent.replace('Spotify – Web Player', 'Spotify')
      lastTitle = mutation.target.textContent;
      document.querySelector('#window-title > span').textContent = mutation.target.textContent
        console.log('new title:', mutation.target.textContent);
      }
    });
});
observer.observe(target, { subtree: true, characterData: true, childList: true });
}();
})

