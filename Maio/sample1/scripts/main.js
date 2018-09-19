var canvas;
var video;
var ctx;

Maio.onReady(function(isDefaultMute) {
    initVideo();
    loadVideo();
});

function initVideo() {
    video = document.querySelector('video');

    video.addEventListener("loadeddata", function(){
        playVideo();
    }, false);

    video.addEventListener("ended", function(){
        removeVideo();
        initCanvas();
    }, false);
}

function loadVideo() {
    video.load();
}

function playVideo() {
    video.play();
}

function removeVideo() {
    video.parentNode.removeChild(video);
}

function initCanvas() {
    var body = document.querySelector('body');
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas");
    body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    stage = new createjs.Stage("canvas");
    if (createjs.Touch.isSupported() == true) {
        createjs.Touch.enable(stage)
    }

    var image = new Image();
    image.src = "images/bg.png";
    image.onload = function() {
        var bg = new createjs.Bitmap(image);
        var aspectRatio = canvas.width / canvas.height;
        var imageAspectRatio = image.width / image.height;
        if (imageAspectRatio < aspectRatio) {
            var scale = canvas.width / image.width;
        } else {
            var scale = canvas.height / image.height;
        }
        bg.scaleX = bg.scaleY = scale;
        bg.x = (canvas.width - bg.scaleX * image.width) / 2;
        bg.y = (canvas.height - bg.scaleY * image.height) / 2;

        stage.addChild(bg);
        var src = canvas.toDataURL('image/tmp.png');
        canvas.style.backgroundImage = "url(" + src + ")";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initPainter()
    }

    //window.addEventListener("resize", handleResize);
    //handleResize();

}

function initPainter() {
    var shape = new createjs.Shape();
    stage.addChild(shape);
    stage.addEventListener("stagemousedown", handleDown);

      // マウスを押した時に実行される
    function handleDown(event) {
        shape.graphics.beginStroke("Black");
        shape.graphics.setStrokeStyle(5);
        shape.graphics.moveTo(event.stageX, event.stageY);
        stage.addEventListener("stagemousemove", handleMove);
        stage.addEventListener("stagemouseup", handleUp);
    }

    function handleMove(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    function handleUp(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
        shape.graphics.endStroke();
        stage.removeEventListener("stagemousemove", handleMove);
        stage.removeEventListener("stagemouseup", handleUp);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);
    function onTick() {
        stage.update();
    }
}

function judge() {

}

// リサイズ処理
/*
function handleResize(event) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    stage.canvas.width = w;
    stage.canvas.height = h;
    stage.update();
}*/