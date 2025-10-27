# CV-project

实时物体识别系统 - 基于YOLO算法的网页应用

## 功能介绍

这是一个基于浏览器的实时物体检测系统，使用摄像头捕获视频流，并通过YOLO类算法（COCO-SSD模型）实时识别画面中的物体。

### 主要特性

- 🎥 **实时视频检测**：直接使用电脑摄像头进行实时物体识别
- 🚀 **浏览器运行**：无需安装Python或其他依赖，直接在浏览器中运行
- 🎯 **多物体检测**：可同时识别多个物体，支持80种常见物体类别
- 📊 **可视化展示**：实时显示检测框和置信度
- 🌐 **中文界面**：完全中文化的用户界面

### 技术栈

- **TensorFlow.js**：在浏览器中运行机器学习模型
- **COCO-SSD模型**：基于YOLO架构的预训练物体检测模型
- **HTML5 Canvas**：用于绘制检测框和标签
- **WebRTC**：获取摄像头视频流

## 使用方法

### 1. 在线访问

直接用浏览器打开 `index.html` 文件即可使用。

### 2. 本地服务器（推荐）

为了更好的性能和兼容性，建议使用本地服务器：

```bash
# 使用Python的简单HTTP服务器
python -m http.server 8000

# 或者使用Node.js的http-server
npx http-server
```

然后在浏览器中访问 `http://localhost:8000`

### 3. 操作步骤

1. 打开网页后，点击"启动摄像头"按钮
2. 授权浏览器访问摄像头权限
3. 等待模型加载完成（首次使用可能需要几秒钟）
4. 系统会自动开始检测视频中的物体
5. 检测结果会以绿色边框和标签显示在视频上
6. 右侧面板会显示所有检测到的物体及其置信度
7. 点击"停止识别"按钮可以停止检测

## 支持的物体类别

COCO-SSD模型可以识别80种常见物体，包括：

- 人物（person）
- 交通工具（car, bicycle, motorcycle, bus, train, truck等）
- 动物（cat, dog, bird, horse等）
- 家具（chair, sofa, bed, table等）
- 电子设备（laptop, mouse, keyboard, cell phone等）
- 食物（apple, banana, pizza, cake等）
- 运动器材（sports ball, tennis racket等）
- 以及更多...

## 浏览器兼容性

- ✅ Chrome 63+
- ✅ Firefox 57+
- ✅ Safari 11.1+
- ✅ Edge 79+

**注意**：需要浏览器支持WebRTC和WebAssembly

## 性能说明

- 首次加载需要下载模型文件（约6-8MB）
- 检测速度取决于设备性能，一般可达到20-30 FPS
- 推荐使用较新的设备以获得更好的体验

## 隐私保护

- 所有处理都在本地浏览器中完成
- 不会上传任何视频或图像数据到服务器
- 摄像头数据仅用于实时检测，不会被存储

## 开发说明

项目结构：
```
CV-project/
├── index.html      # 主HTML文件
├── style.css       # 样式文件
├── app.js          # 主应用逻辑
└── README.md       # 项目文档
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！