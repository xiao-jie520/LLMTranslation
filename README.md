多模态翻译助手 (LLM Translation Desktop App)

一个基于 Electron 构建的跨平台桌面应用程序，支持通过文本和截图调用大语言模型 (LLM) API 进行多模态翻译。

项目简介

这是一个轻量级的本地桌面工具，允许您方便地将文本或截取的图片内容翻译成多种目标语言。它通过配置连接到支持视觉理解的大模型 API（如 GLM-4V），实现图文混合输入、一键翻译的功能。

功能特点

•   多模态输入：支持纯文本输入，也支持直接从剪贴板粘贴截图进行翻译。

•   多模型支持：可通过配置自由更换后端大模型 API 的 Base URL 和模型名称。

•   多语言翻译：预置中、英、日、法、德等多种目标语言选项。

•   简洁界面：清晰的左右布局，左侧配置，右侧输入/输出，操作直观。

•   上下文隔离：应用了 Electron 的安全最佳实践，隔离主进程与渲染进程。

技术栈

•   前端/界面：HTML5, CSS3, Vanilla JavaScript

•   桌面框架：Electron ^40.8.0

•   HTTP 客户端：Axios ^1.13.6

•   进程通信：通过 preload.js 脚本和 contextBridge 安全暴露 API

快速开始

前提条件

•   https://nodejs.org/ (安装时建议包含 npm)

•   一个支持视觉理解的大模型 API Key 和接口地址（例如：智谱 AI 的 GLM-4V 系列模型）

安装与运行

1.  获取项目代码
    git clone <你的项目仓库地址>
    cd llmtranslation
    

2.  安装项目依赖
    npm install
    
    此命令会根据 package.json 文件自动安装 Electron 和 Axios 等所有依赖。

3.  启动应用程序
    npm start
    
    这将运行 package.json 中定义的 electron . 脚本，启动应用窗口。

使用说明

1.  配置 API：
    ◦   在应用左侧栏输入您的 API Key。

    ◦   填写 Base URL（例如：https://open.bigmodel.cn/api/paas/v4）。

    ◦   输入或选择 模型名称（例如：glm-4v 或 glm-4.6v-flash）。

    ◦   选择 目标语言。

2.  输入内容：
    ◦   文本翻译：直接在右侧上方文本框中输入待翻译文字。

    ◦   截图翻译：使用系统截图工具（如 Win+Shift+S, Cmd+Shift+4 等）截图后，在应用内点击“粘贴截图”按钮或直接按 Ctrl+V (Windows/Linux) / Cmd+V (Mac) 将图片粘贴到指定区域。

3.  开始翻译：
    ◦   点击 “开始翻译” 按钮。

    ◦   翻译结果将显示在右侧下方的结果框中。

配置选项详解

•   API Key: 您从大模型服务商处获取的授权密钥。

•   Base URL: API 的端点地址。请注意，如果您的 URL 已包含 /chat/completions 路径，需在输入时删除，程序会自动拼接。

•   模型名称: 您要调用的具体模型 ID。

•   目标语言: 翻译输出的语言，目前支持英语、中文、日语、法语、德语。

项目结构

llmtranslation/

├── package.json          # 项目配置和依赖声明

├── package-lock.json     # 依赖树锁定文件

├── main.js              # Electron 主进程文件，处理窗口创建、IPC

├── preload.js           # 预加载脚本，安全暴露 API 给渲染进程

├── renderer.js          # 渲染进程逻辑，处理界面交互

├── index.html           # 应用程序主界面

└── README.md            # 本说明文件


故障排除

•   应用无法启动或白屏：

    ◦   确保已运行 npm install 成功安装所有依赖。

    ◦   检查 Node.js 和 npm 版本是否过旧。

•   控制台提示“electronAPI is undefined”：

    ◦   检查 preload.js 和 main.js 中预加载脚本的路径配置是否正确。

•   翻译失败，返回错误信息：

    ◦   确认 API Key、Base URL 和模型名称填写正确且有效。

    ◦   确认您的网络可以访问所配置的 API 地址。

    ◦   查看开发者控制台（可通过 main.js 中取消注释 openDevTools() 来开启）获取详细的错误响应。

注意事项

•   请妥善保管您的 API Key，不要将其提交到公开的代码仓库中。

•   本应用的图片处理依赖大模型的多模态能力，请确保所使用的 API 支持图像输入。

•   响应速度和翻译质量取决于您所配置的 API 服务。

开发扩展

•   如需新增支持的语言，可在 index.html 文件中修改 <select id="targetLang"> 下拉选项。

•   如需调整界面样式，请直接修改 index.html 中的 <style> 部分。

•   主进程逻辑在 main.js 中，渲染进程逻辑在 renderer.js 中。

提示：本文档内容基于您提供的项目文件 (package.json, main.js, renderer.js 等) 生成。在使用 API 时产生的费用及服务质量，由对应的 API 提供商负责。

