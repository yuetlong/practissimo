/* 
 * Zachary Wong, UMass Lowell Computer Science, zwong@cs.uml.edu
 * Copyright © 2015 by Zachary Wong.  All rights reserved.
 * Updated September 3, 2015 1:15PM
 */

navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;
var setSwitch = 'false';
var bufAvg = 128;
var analyser = audioCtx.createAnalyser();
var sourceNode;

analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();

// setup a javascript node
var javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
sourceNode = audioCtx.createBufferSource();

if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia(
            // constraints - only audio needed for this app
                    {
                        audio: true
                    },
            // Success callback
            function (stream) {
                source = audioCtx.createMediaStreamSource(stream);

                 source.connect(analyser);
                 javascriptNode.connect(audioCtx.destination);
                 sourceNode.connect(audioCtx.destination)
                 analyser.connect(javascriptNode);
                /*analyser.connect(distortion);
                 distortion.connect(biquadFilter);
                 biquadFilter.connect(convolver);
                 convolver.connect(gainNode);
                 gainNode.connect(audioCtx.destination);*/

                detect();
                //voiceChange();

            },
                    // Error callback
                            function (err) {
                                console.log('The following gUM error occured: ' + err);
                            }
                    );
                } else {
            console.log('getUserMedia not supported on your browser!');
        }

        function detect() {
            //produces 32-bit floating point numbers
            analyser.fftSize = 256;
            var bufferLength = analyser.frequencyBinCount;
            console.log(bufferLength);
            var dataArray = new Uint8Array(bufferLength);
            
            function draw() {
                drawVisual = requestAnimationFrame(draw);
                analyser.getByteTimeDomainData(dataArray);
                
                for (var i = 0; i < bufferLength; i++) {
                    
                    bufAvg = getAverageVolume(dataArray);
                    var bufferVal = dataArray[i] / 2;
                    if(bufferVal > 128)
                         var setSwitch = 'true'
                    else
                         var setSwitch = 'false'
                    document.getElementById("switch").innerHTML = bufAvg;
                }
            }
            draw();
        }

javascriptNode.onaudioprocess = function() {
 
        // get the average, bincount is fftsize / 2
        var dataArray =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        var average = getAverageVolume(dataArray)
    }
 
    function getAverageVolume(array) {
        var values = 0;
        var average;
 
        var length = array.length;
 
        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }
 
        average = values / length;
        return average;
    }