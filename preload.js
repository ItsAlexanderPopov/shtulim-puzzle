const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process via context bridge
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    // You can add more IPC functions here as needed
});
console.log('preloaded');
document.addEventListener('keydown', function(event) {
    event.preventDefault(); // Prevent default keyboard action
});