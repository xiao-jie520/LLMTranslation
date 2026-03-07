// 等待 DOM 加载完成后再执行代码，确保元素存在
document.addEventListener('DOMContentLoaded', () => {
    console.log("Renderer process loaded."); // 这句话出现在控制台说明JS加载成功

    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const imagePreview = document.getElementById('imagePreview');
    const translateBtn = document.getElementById('translateBtn');

    let currentImageBase64 = null;

    // 1. 检查 electronAPI 是否存在
    if (window.electronAPI) {
        console.log("electronAPI bridge is ready.");
    } else {
        console.error("Error: window.electronAPI is undefined! Check preload.js and main.js load paths.");
    }

    // 2. 处理截图粘贴
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

    // 3. 将函数绑定到按钮 (替代 HTML 中的 onclick)
    translateBtn.addEventListener('click', startTranslate);

    // 把函数挂载到 window 对象，这样 HTML 里的 onclick="startTranslate()" 也能找到它
    window.startTranslate = startTranslate;
    window.pasteImage = () => {
        document.body.focus();
        alert('请使用 Ctrl+V 粘贴截图');
    };
    window.clearImage = () => {
        currentImageBase64 = null;
        imagePreview.style.backgroundImage = 'none';
        imagePreview.innerText = '在此处粘贴截图';
    };

    async function startTranslate() {
        const config = {
            apiKey: document.getElementById('apiKey').value,
            baseURL: document.getElementById('baseURL').value,
            modelName: document.getElementById('modelName').value,
            targetLang: document.getElementById('targetLang').value,
            text: inputText.value,
            imageBase64: currentImageBase64
        };

        if (!config.text && !config.imageBase64) {
            alert('请输入文本或粘贴截图');
            return;
        }

        // 简单的防误触
        if (!window.electronAPI) {
            alert('程序初始化错误，请重启应用。详情见控制台。');
            return;
        }

        translateBtn.disabled = true;
        translateBtn.innerText = '翻译中...';
        outputText.value = '正在请求大模型...';

        try {
            const response = await window.electronAPI.translate(config);

            if (response.success) {
                outputText.value = response.result;
            } else {
                outputText.value = `翻译失败: ${response.error}`;
            }
        } catch (error) {
            outputText.value = `前端调用异常: ${error.message}`;
        } finally {
            translateBtn.disabled = false;
            translateBtn.innerText = '开始翻译';
        }
    }
});
