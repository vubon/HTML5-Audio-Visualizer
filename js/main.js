/* * 
 * audio visualizer with html5 audio element
 *
 * v0.1.0
 * 
 * licenced under the MIT license
 * 
 * reference: http://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
 * reference: https://github.com/AlexJuca/SpectrumVisualizer
 *
 */

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

window.onload = function() {
    var audio = document.getElementById('audio');
    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
    // analyser.fftSize = 64;
    // frequencyBinCount tells you how many values you'll receive from the analyser
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // we're ready to receive some data!
	var that = this,
		canvas = document.getElementById('canvas'),
		canvas2 = document.getElementById('canvas2'),
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        meterWidth = 2, //width of the meters in the spectrum
        gap = 0.1, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = 800 / (2 + 2), //count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
    ctx = canvas.getContext('2d'),
	ctx1 = canvas2.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, 300);
	gradient2 = ctx1.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#6666cc');
    gradient.addColorStop(0.5, '#ff0000');
    gradient.addColorStop(0, '#f00');
	
	gradient2.addColorStop(1, '#6666cc');
    gradient2.addColorStop(0.5, '#ff0000');
    gradient2.addColorStop(0, '#f00');
    // loop
    function renderFrame() {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var step = Math.round(array.length / meterNum); //sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight);
		ctx1.clearRect(0, 0, cwidth, cheight);
        for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
                capYPositionArray.push(value);
            };
            ctx.fillStyle = capStyle;
			ctx1.fillStyle = capStyle;
            //draw the cap, with transition effect
            if (value < capYPositionArray[i]) {
                ctx.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
				ctx1.fillRect(i * 12, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
                ctx.fillRect(i * 12, cheight - value, meterWidth, capHeight);
				ctx1.fillRect(i * 12, cheight - value, meterWidth, capHeight);
                capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
            ctx.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
			ctx1.fillRect(i * 12 /*meterWidth+gap*/ , cheight - value + capHeight, meterWidth, cheight); //the meter
        }
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();
};
