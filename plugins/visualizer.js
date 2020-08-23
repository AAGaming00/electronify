const {desktopCapturer} = require('electron')
function checkFlag() {
    if(!document.querySelector('.Root__top-bar > header')) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      inject()
    }
  }
  checkFlag()
function inject(){
var anim;

var canvas = document.createElement("canvas");
canvas.id = 'canvas'
canvas.width = window.innerWidth;
canvas.height = '100%';
document.querySelector('.now-playing-bar').appendChild(canvas)
var padding = 5;
var WIDTH = canvas.width -padding ;
var HEIGHT = canvas.height -padding;
var barNumber = 27;
var ecart = 10;
var barWidth = (WIDTH / barNumber) -ecart;

onchange = function(stream) {
    console.log("here",stream);


    var context = new AudioContext();
    var src = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;
    var bufferByBar = Math.round(bufferLength/barNumber);
    var dataArray = new Uint8Array(bufferLength);



    var barHeight;
    var x = 0;

    console.log("bufferLength",bufferLength);
    console.log("bufferByBar",bufferByBar);
    console.log("barNumber",barNumber);
    console.log("barWidth",barWidth);

    function renderFrame() {
        anim = requestAnimationFrame(renderFrame);

        x = padding;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < barNumber; i++) {
            barHeight = 0
            for (var j = 0; j < bufferByBar; j++) {
                barHeight += dataArray[i*bufferByBar+j];
            }
            barHeight = barHeight/bufferByBar;

            barHeight = barHeight/700*HEIGHT;

            var r = barHeight + (25 * (i/bufferLength));
            var g = 250 * (i/bufferLength);
            var b = 50;

            // var fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            var fillStyle = "#F00";

            ctx.fillStyle = fillStyle;
            // ctx.fillStyle = "#F00";
            ctx.fillRect(x, HEIGHT - 2*barHeight - barWidth/2, barWidth, 2*barHeight);

            ctx.beginPath();
            ctx.arc(x+(barWidth/2), HEIGHT - 2*barHeight -barWidth/2 , barWidth/2, 0, 2 * Math.PI, false);
            ctx.arc(x+(barWidth/2), HEIGHT - barWidth/2 , barWidth/2, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = fillStyle;
            ctx.stroke();


            x += barWidth + ecart;
        }
    };
    setInterval(() => {
        renderFrame();
    }, 1000);
};

function start(){
    if(anim){
        window.cancelAnimationFrame(anim);
    }
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
        console.log(sources);
        
        for (const source of sources) {
            // Filter: main screen
            if (source.name === document.title) {
                try{
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {                                
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: source.id,
                        },
                        video: {
                            mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: source.id,
                            minWidth: 1280,
                            maxWidth: 4000,
                            minHeight: 720,
                            maxHeight: 4000
                        }
                    }
                    });
                    onchange(stream);
                }catch (e) {
                    console.log(e)
                }
            }
        }
})
}

window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WIDTH = canvas.width -padding ;
    HEIGHT = canvas.height -padding;
    barWidth = (WIDTH / barNumber) -ecart;
};

start();
  }