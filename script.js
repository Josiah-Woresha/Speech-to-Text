document.addEventListener('DOMContentLoaded', () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the Web Speech API. Please use Google Chrome.');
    } else {
        const startButton = document.getElementById('start');
        const stopButton = document.getElementById('stop');
        const transcriptDiv = document.getElementById('transcript');
        const clearButton = document.getElementById('clear');

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function (event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcriptDiv.innerHTML += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            transcriptDiv.innerHTML += '<span style="color: gray;">' + interimTranscript + '</span>';
        };

        startButton.addEventListener('click', function () {
            navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            }).then(function(stream) {
                const audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    console.log('Using audio device: ' + audioTracks[0].label);
                }

                recognition.start();
                startButton.disabled = true;
                stopButton.disabled = false;
            }).catch(function(err) {
                console.error('Error accessing the microphone: ' + err.name + ': ' + err.message);
            });
        });

        stopButton.addEventListener('click', function () {
            recognition.stop();
            startButton.disabled = false;
            stopButton.disabled = true;
        });

        clearButton.addEventListener('click', function () {
            transcriptDiv.innerHTML = '';
        });
    }
});