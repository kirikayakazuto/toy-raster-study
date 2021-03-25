const electron = require('electron')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require("path");
const {Menu,MenuItem} = require("electron")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
function createWindow() {
    app.commandLine.appendSwitch('ignore-gpu-blacklist');

    // Create the browser window.
	mainWindow = new BrowserWindow({
        width: 960,
        height: 420,
        webPreferences: {
            nodeIntegration: true,
            webgl: true,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    
    mainWindow.loadFile(path.join(__dirname, "run/index.html"))

    mainWindow.webContents.on('did-finish-load', async function () {});

    mainWindow.webContents.on("before-input-event", (event, input) => {});
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    app.on('activate', function() {
        if (mainWindow === null) {
            createWindow()
        }
    });
});