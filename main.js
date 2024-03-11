const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require("electron").ipcMain;
const { shell } = require("electron");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 480,
        height: 660,
        maximizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            disableHtmlFullscreenWindowResize: true,
        },
        autoHideMenuBar: true,
        fullscreenable: false,
    });
    
    mainWindow.loadFile('index.html');
    /* mainWindow.webContents.openDevTools(); */
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
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