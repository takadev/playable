var canvas;
var video;
var ctx;
var checkIndex = 1;
var checkPoint = {
    "x1":167, "y1":131,
    "x2":184, "y2":118,
    "x3":196, "y3":105,
    "x4":206, "y4":92,
    "x5":210, "y5":79,
    "x6":205, "y6":66,
    "x7":200, "y7":52,
} 
var len = Object.keys(checkPoint).length / 2;
var tolerance = 10;

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
    
    function handleDown(event) {
        if (checkPos(event.stageX, event.stageY) == false) {
            return;
        }
        shape.graphics.beginStroke("Black");
        shape.graphics.setStrokeStyle(5);
        shape.graphics.moveTo(event.stageX, event.stageY);
        stage.addEventListener("stagemousemove", handleMove);
        stage.addEventListener("stagemouseup", handleUp);
    }

    function handleMove(event) {
        checkPos(event.stageX, event.stageY);
        shape.graphics.lineTo(event.stageX, event.stageY);
    }

    function handleUp(event) {
        shape.graphics.lineTo(event.stageX, event.stageY);
        shape.graphics.endStroke();
        stage.removeEventListener("stagemousedown", handleDown);
        stage.removeEventListener("stagemousemove", handleMove);
        stage.removeEventListener("stagemouseup", handleUp);
        judge(event.stageX, event.stageY);
    }

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);
    function onTick() {
        stage.update();
    }

    function checkPos(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if (checkIndex > len) {
            checkIndex = len;
        }

        if (checkPoint["x" + checkIndex] - tolerance <= x && x <= checkPoint["x" + checkIndex] + tolerance && 
            checkPoint["y" + checkIndex] - tolerance <= y && y <= checkPoint["y" + checkIndex] + tolerance) {
            checkIndex++;
            return true;
        }
        return false;
    }

    function judge(x, y) {
        if (checkPos(x, y, len) && checkIndex > len) {
            // GOAL
            console.log("GOAL");
        } else {
            // FAULT
            console.log("FAULT");
        }
    }
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