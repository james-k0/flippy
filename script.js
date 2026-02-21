const video = document.getElementById('video');
const flipBtn = document.getElementById('flipBtn');
const startBtn = document.getElementById('startBtn');
const crosshairBtn = document.getElementById('crosshairBtn');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const statusDiv = document.getElementById('status');
const crosshairVertical = document.querySelector('.crosshair-vertical');
const crosshairHorizontal = document.querySelector('.crosshair-horizontal');
let stream = null;
let isFlipped = false;
let showCrosshair = true;
let zoomLevel = 1;

function updateStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}
function updateVideoTransform() {
    let transform = `scale(${zoomLevel})`;
    if (isFlipped) {
        transform += ' scaleX(-1)';
    }
    video.style.transform = transform;
}
async function startCamera() {
    try {
        updateStatus('waiting camera', 'info');
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }, 
            audio: false 
        });  
        video.srcObject = stream;
        updateStatus('Camera active', 'success');
        startBtn.textContent = 'Stop Camera';
        startBtn.style.background = '#f56565';
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        updateStatus('Error: cant access camera', 'error');
    }
}
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
        updateStatus('Camera stopped', 'info');
        startBtn.textContent = 'Start Camera';
        startBtn.style.background = '#48bb78';
    }
}
startBtn.addEventListener('click', () => {
    if (stream) {
        stopCamera();
    } else {
        startCamera();
    }
});
flipBtn.addEventListener('click', () => {
    isFlipped = !isFlipped;
    if (isFlipped) {
        flipBtn.textContent = 'Flipped';
    } else {
        flipBtn.textContent = 'Regular';
    }
    updateVideoTransform();
});
crosshairBtn.addEventListener('click', () => {
    showCrosshair = !showCrosshair;
    if (showCrosshair) {
        crosshairVertical.classList.remove('hidden');
        crosshairHorizontal.classList.remove('hidden');
        crosshairBtn.textContent = 'x-hair: On';
    } else {
        crosshairVertical.classList.add('hidden');
        crosshairHorizontal.classList.add('hidden');
        crosshairBtn.textContent = 'x-hair: Off';
    }
});
zoomInBtn.addEventListener('click', () => {
    if (zoomLevel < 3) {
        zoomLevel += 0.25;
        updateVideoTransform();
    }
});
zoomOutBtn.addEventListener('click', () => {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        updateVideoTransform();
    }
});
window.addEventListener('beforeunload', () => {
    stopCamera();
});
