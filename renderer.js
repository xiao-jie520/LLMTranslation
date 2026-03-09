document.addEventListener('DOMContentLoaded', () => {
  console.log("Renderer loaded successfully.");

  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const imagePreview = document.getElementById('imagePreview');
  const translateBtn = document.getElementById('translateBtn');
  const apiKeyInput = document.getElementById('apiKey');
  const baseURLInput = document.getElementById('baseURL');
  const modelNameInput = document.getElementById('modelName');
  const targetLangSelect = document.getElementById('targetLang');

  let currentImageBase64 = null;

  // 读取保存的配置（启动时自动填充）
  const savedConfig = window.electronAPI.getConfig();
  if (savedConfig) {
    apiKeyInput.value = savedConfig.apiKey || '';
    baseURLInput.value = savedConfig.baseURL || '';
    modelNameInput.value = savedConfig.modelName || '';
    targetLangSelect.value = savedConfig.targetLang || '';
  }

  // 保存配置的函数
  function saveConfig() {
    const config = {
      apiKey: apiKeyInput.value,
      baseURL: baseURLInput.value,
      modelName: modelNameInput.value,
      targetLang: targetLangSelect.value
    };
    window.electronAPI.saveConfig(config);
  }

  // 监听输入变化，自动保存
  apiKeyInput.addEventListener('change', saveConfig);
  baseURLInput.addEventListener('change', saveConfig);
  modelNameInput.addEventListener('change', saveConfig);
  targetLangSelect.addEventListener('change', saveConfig);

  // 检查 electronAPI 是否存在
  if (!window.electronAPI) {
    console.error("Error: window.electronAPI is undefined! Check preload.js and main.js.");
    alert("程序初始化失败，请重启应用。");
    return;
  }

  // --- 事件处理函数 ---
  function startTranslate() {
    const config = {
      apiKey: apiKeyInput.value,
      baseURL: baseURLInput.value,
      modelName: modelNameInput.value,
      targetLang: targetLangSelect.value,
      text: inputText.value,
      imageBase64: currentImageBase64
    };

    if (!config.text && !config.imageBase64) {
      alert('请输入文本或粘贴截图');
      return;
    }

    translateBtn.disabled = true;
    translateBtn.innerText = '翻译中...';
    outputText.value = '正在请求大模型...';

    window.electronAPI.translate(config)
      .then(response => {
        if (response.success) {
          outputText.value = response.result;
        } else {
          outputText.value = `翻译失败: ${response.error}`;
        }
      })
      .catch(error => {
        outputText.value = `前端调用异常: ${error.message}`;
      })
      .finally(() => {
        translateBtn.disabled = false;
        translateBtn.innerText = '开始翻译';
      });
  }

  function pasteImage() {
    document.body.focus();
    alert('请使用 Ctrl+V 粘贴截图');
  }

  function clearImage() {
    currentImageBase64 = null;
    imagePreview.style.backgroundImage = 'none';
    imagePreview.innerText = '在此处粘贴截图';
  }

  // --- 绑定事件（使用 addEventListener 替代 onclick）---
  translateBtn.addEventListener('click', startTranslate);
  document.getElementById('pasteImageBtn').addEventListener('click', pasteImage);
  document.getElementById('clearImageBtn').addEventListener('click', clearImage);

  // 处理截图粘贴（全局监听）
  document.addEventListener('paste', async (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = function(event) {
          currentImageBase64 = event.target.result;
          imagePreview.style.backgroundImage = `url(${currentImageBase64})`;
          imagePreview.innerText = '';
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  });
});
