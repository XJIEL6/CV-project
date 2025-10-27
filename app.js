// 全局变量
let model = null;
let webcam = null;
let canvas = null;
let ctx = null;
let isDetecting = false;
let animationId = null;

// DOM元素
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const statusElement = document.getElementById('status');
const statusText = document.getElementById('statusText');
const detectionsElement = document.getElementById('detections');

// 初始化
async function init() {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    
    // 添加按钮事件监听
    startButton.addEventListener('click', startDetection);
    stopButton.addEventListener('click', stopDetection);
    
    updateStatus('ready', '准备就绪 - 点击启动摄像头开始检测');
}

// 更新状态显示
function updateStatus(state, message) {
    const statusIcons = {
        'ready': '⚪',
        'loading': '🟡',
        'active': '🟢',
        'error': '🔴'
    };
    
    statusElement.querySelector('.status-icon').textContent = statusIcons[state] || '⚪';
    statusText.textContent = message;
    
    if (state === 'loading') {
        statusElement.classList.add('loading');
    } else {
        statusElement.classList.remove('loading');
    }
}

// 启动检测
async function startDetection() {
    try {
        startButton.disabled = true;
        updateStatus('loading', '正在加载模型...');
        
        // 加载COCO-SSD模型
        if (!model) {
            model = await cocoSsd.load();
            console.log('模型加载成功');
        }
        
        updateStatus('loading', '正在启动摄像头...');
        
        // 获取摄像头访问权限
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        
        webcamElement.srcObject = stream;
        
        // 等待视频加载
        await new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                resolve();
            };
        });
        
        // 设置canvas大小
        canvas.width = webcamElement.videoWidth;
        canvas.height = webcamElement.videoHeight;
        
        updateStatus('active', '检测中...');
        isDetecting = true;
        stopButton.disabled = false;
        
        // 开始检测循环
        detectFrame();
        
    } catch (error) {
        console.error('启动失败:', error);
        updateStatus('error', '启动失败: ' + error.message);
        startButton.disabled = false;
    }
}

// 停止检测
function stopDetection() {
    isDetecting = false;
    
    // 取消动画帧
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // 停止摄像头
    if (webcamElement.srcObject) {
        webcamElement.srcObject.getTracks().forEach(track => track.stop());
        webcamElement.srcObject = null;
    }
    
    // 清空canvas
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // 清空检测结果
    detectionsElement.innerHTML = '<p class="no-detections">暂无检测结果</p>';
    
    // 更新按钮状态
    startButton.disabled = false;
    stopButton.disabled = true;
    
    updateStatus('ready', '已停止 - 点击启动摄像头重新开始');
}

// 检测单帧
async function detectFrame() {
    if (!isDetecting) return;
    
    try {
        // 执行检测
        const predictions = await model.detect(webcamElement);
        
        // 清空canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制检测结果
        drawPredictions(predictions);
        
        // 更新检测信息面板
        updateDetectionsPanel(predictions);
        
        // 继续下一帧
        animationId = requestAnimationFrame(detectFrame);
        
    } catch (error) {
        console.error('检测错误:', error);
        stopDetection();
        updateStatus('error', '检测出错: ' + error.message);
    }
}

// 绘制预测结果
function drawPredictions(predictions) {
    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const score = (prediction.score * 100).toFixed(1);
        
        // 绘制边框
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);
        
        // 绘制标签背景
        const label = `${prediction.class} ${score}%`;
        ctx.font = '18px Arial';
        const textWidth = ctx.measureText(label).width;
        const textHeight = 24;
        
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(x, y - textHeight, textWidth + 10, textHeight);
        
        // 绘制标签文本
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x + 5, y - 6);
    });
}

// 更新检测信息面板
function updateDetectionsPanel(predictions) {
    if (predictions.length === 0) {
        detectionsElement.innerHTML = '<p class="no-detections">暂无检测结果</p>';
        return;
    }
    
    // 按置信度排序
    const sortedPredictions = predictions.sort((a, b) => b.score - a.score);
    
    // 生成HTML
    const html = sortedPredictions.map(prediction => {
        const confidence = (prediction.score * 100).toFixed(1);
        return `
            <div class="detection-item">
                <span class="detection-name">${prediction.class}</span>
                <span class="detection-confidence">${confidence}%</span>
            </div>
        `;
    }).join('');
    
    detectionsElement.innerHTML = html;
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
