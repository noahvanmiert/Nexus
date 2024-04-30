const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
    onNewTab: (callback) => ipcRenderer.on('new-tab', (_event, value) => callback(value)),
    onCloseTab: (callback) => ipcRenderer.on('close-tab', (_event, value) => callback(value))
});