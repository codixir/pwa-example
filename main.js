if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
        console.log('Service Worker Registered', registration);
    })
    .catch((error) => {
        console.error('Service Worker Failed to Register', error);
    });
}

document.getElementById('get-location').addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            document.getElementById('location-result').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

// Camera
const cameraPreview = document.getElementById('camera-preview');
const startCameraButton = document.getElementById('start-camera');
const stopCameraButton = document.getElementById('stop-camera');
let cameraStream;

startCameraButton.addEventListener('click', async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraPreview.srcObject = cameraStream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

stopCameraButton.addEventListener('click', () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraPreview.srcObject = null;
    }
});

// Microphone
const startRecordingButton = document.getElementById('start-recording');
const stopRecordingButton = document.getElementById('stop-recording');
const audioPreview = document.getElementById('audio-preview');
let mediaRecorder;
let recordedChunks = [];

startRecordingButton.addEventListener('click', async () => {
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(audioStream);
        mediaRecorder.start();
        recordedChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        });
    
        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
            const audioURL = URL.createObjectURL(audioBlob);
            audioPreview.src = audioURL;
        });
    } catch (error) {
        console.error('Error accessing microphone:', error);
    }
});