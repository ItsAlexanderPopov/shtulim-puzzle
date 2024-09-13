const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');
const { GlobalKeyboardListener } = require("node-global-key-listener");
const { exec } = require('child_process');

let mainWindow;
let tray;
let willQuitApp = false;
let keyListener;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 660,
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            disableHtmlFullscreenWindowResize: true,
        },
        autoHideMenuBar: true,
        fullscreenable: false,
        icon: path.join(__dirname, 'icon.ico') 
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('close', function (event) {
        if (!willQuitApp) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.ico'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Quit',
            click: function () {
                willQuitApp = true;
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Rocket');
    tray.setContextMenu(contextMenu);

    tray.on('click', function () {
        mainWindow.show();
    });
}

function setupKeyListener() {
    keyListener = new GlobalKeyboardListener();
    
    let isWinKeyPressed = false;

    keyListener.addListener(function (e) {
        if (e.state == "DOWN" && e.name == "LEFT META") {
            isWinKeyPressed = true;
        }
        if (e.state == "UP" && e.name == "LEFT META") {
            isWinKeyPressed = false;
        }
        if (isWinKeyPressed && e.state == "DOWN" && e.name == "L") {
            console.log('Windows lock detected. Terminating app.');
            if (process.platform === 'win32') {
                exec('rundll32.exe user32.dll,LockWorkStation');
            }
            willQuitApp = true;
            app.quit();
        }
    });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.show();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        createWindow();
        createTray();
        if (process.platform === 'win32') {
            setupKeyListener();
        }
        
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            } else {
                mainWindow.show();
            }
        });
    });

    app.on('will-quit', () => {
        if (keyListener) {
            keyListener.kill();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    ipcMain.on('open-folder', (event, arg) => {
        if(arg){
            const folderPath = path.join(app.getPath("desktop"), "Secret Documents");
            shell.openPath(folderPath);
        }
    });
}