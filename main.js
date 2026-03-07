const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // 开启上下文隔离，更安全
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  // 开发时打开调试工具
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- 核心功能：处理翻译请求 ---
ipcMain.handle('translate-content', async (event, config) => {
  const { apiKey, baseURL, modelName, text, imageBase64, targetLang } = config;

  if (!apiKey) {
    return { success: false, error: '请先输入 API Key' };
  }

  // 构建多模态消息内容
  const content = [];
  
  // 文本部分
  const prompt = `请将以下内容翻译成${targetLang}，只需要返回翻译结果，不要添加任何解释。
原文：${text || '(请根据图片内容翻译)'}`;
  
  content.push({ type: 'text', text: prompt });

  // 图片部分 (如果存在)
  if (imageBase64) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`
      }
    });
  }

  try {
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: modelName,
        messages: [{ role: 'user', content: content }],
        max_tokens: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return { success: true, result: response.data.choices[0].message.content };
  } catch (error) {
    console.error(error);
    return { 
      success: false, 
      error: error.response ? JSON.stringify(error.response.data) : error.message 
    };
  }
});

// --- 处理截图粘贴 (读取剪贴板图片) ---
// 注意：Electron 渲染进程可以直接处理剪贴板，这里提供一个备用方案演示文件读取
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (err) {
    return null;
  }
});
