const { app, BrowserWindow, ipcMain, shell, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;
let willQuitApp = false;

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
                app.quit(); // Quit the application when 'Quit' is clicked in the tray menu
            }
        }
    ]);

    tray.setToolTip('Rocket');
    tray.setContextMenu(contextMenu);

    tray.on('click', function () {
        mainWindow.show(); // Show the main window when tray icon is clicked
    });
}

// Check if another instance of the app is already running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Another instance was launched, focus the existing window
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
        
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            } else {
                mainWindow.show(); // Show the main window if it's hidden in the tray when activating the app
            }
        });
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    ipcMain.on('open-folder', (event, arg) => {
        if(arg){
            const folderPath = path.join(app.getPath("desktop"), "Rocket");
            shell.openPath(folderPath);
        }
    });
}
