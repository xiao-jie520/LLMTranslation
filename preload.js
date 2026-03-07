const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  translate: (config) => ipcRenderer.invoke('translate-content', config),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
});
