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

    //window.addEventListener("resize", handleResize);
    //handleResize();

    if (createjs.Touch.isSupported() == true) {
        createjs.Touch.enable(stage)
    }

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