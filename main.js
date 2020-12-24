// Modules to control application life and create native browser window
let BrowserWindow
const {app, session, BrowserWindow: ElectronWindow} = require('electron')
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
const {BrowserWindow: GlasstronWindow} = require('glasstron')
const {join} = require('path')
const {readFileSync} = require('fs')
// app.commandLine.appendSwitch("--enable-transparent-visuals");
// app.commandLine.appendSwitch('--allow-running-insecure-content');
// app.commandLine.appendSwitch('--ignore-certificate-errors');
// app.commandLine.appendSwitch('--widevine-cdm-path', join(__dirname, 'widevine')); 
// app.commandLine.appendSwitch('--widevine-cdm-version', '4.10.1582.2')
function createWindow () {
  // Create the browser window.
  if (process.platform !== 'linux') {
    BrowserWindow = GlasstronWindow
  } else {
    BrowserWindow = ElectronWindow
  }
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 400,
    minHeight: 400,
    frame: false,
    backgroundColor: '#000000ab',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      plugins: true,
      enableRemoteModule: true,
      nodeIntegration: false,
      contextIsolation: false,
      worldSafeExecuteJavaScript: true
    }
  })
  if (process.platform !== 'linux') {
    mainWindow.blurType = "blurbehind";
    //              ^~~~~~~
    // Windows 10 1803+; for older versions you
    // might want to use 'blurbehind'
    mainWindow.setBlur(process.platform !== 'linux');
  }
  mainWindow.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 Edg/84.0.522.63"
  const filter = {
    urls: ['*://*.spotify.com/*']
  }
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 Edg/84.0.522.63";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  // and load the index.html of the app.
  console.log(process.versions)
  mainWindow.loadURL('https://open.spotify.com/')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

}

// Print widevine info
app.on('widevine-ready', (version, lastVersion) => {
  if (null !== lastVersion) {
      console.log('Widevine ' + version + ', upgraded from ' + lastVersion + ', is ready to be used!');
  } else {
      console.log('Widevine ' + version + ' is ready to be used!');
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));
  setTimeout(
		createWindow,
		process.platform == "linux" ? 1000 : 0
		// Electron has a bug on linux where it
		// won't initialize properly when using
		// transparency. To work around that, it
		// is necessary to delay the window
		// spawn function.
	);  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
