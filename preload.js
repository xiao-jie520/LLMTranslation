const { contextBridge, ipcRenderer } = require('electron');

// 暂时使用 localStorage 替代 electron-store（跨平台兼容）
contextBridge.exposeInMainWorld('electronAPI', {
  translate: (config) => ipcRenderer.invoke('translate-content', config),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  // 使用 localStorage 保存配置（替代 electron-store）
  saveConfig: (config) => localStorage.setItem('apiConfig', JSON.stringify(config)),
  getConfig: () => JSON.parse(localStorage.getItem('apiConfig'))
});
