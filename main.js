// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path');
const Sentry = require('@sentry/node');
const { autoUpdater } = require("electron-updater");
const log = require("electron-log")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const notifier = require('node-notifier');
autoUpdater.logger = log
log.transports.file.level = "debug"
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.on('checking-for-update', () => { })
autoUpdater.on('update-available', (info) => { })
autoUpdater.on('update-not-available', (info) => { })
autoUpdater.on('error', (err) => { })
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
})
autoUpdater.on('update-downloaded', (info) => {
  // Object
  notifier.notify({
    title: 'RRHH-LEGAJO-ACTUALIZACION',
    message: 'Actualizacion descargada, Reinicia la aplicacion para instalarla automaticamente.'
  });
});
function createWindow() {
  Sentry.init({ dsn: 'https://8839572e21fe429bb5f080d732e169af@sentry.io/1776203' });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  autoUpdater.checkForUpdatesAndNotify()
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL('http://localhost:8080/')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
