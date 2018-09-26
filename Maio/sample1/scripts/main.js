var canvas;
var wrapper;
var video;
var ctx;
var checkIndex = 1;
var checkPointScale = {
    "x1":0.546875, "y1":0.6943359375,
    "x2":0.56640625, "y2":0.65234375,
    "x3":0.5859375, "y3":0.6103515625,
    "x4":0.60546875, "y4":0.568359375,
    "x5":0.625, "y5":0.5263671875,
    "x6":0.64453125, "y6":0.484375,
    "x7":0.6640625, "y7":0.4423828125,
    "x8":0.68359375, "y8":0.400390625,
}

var len = Object.keys(checkPointScale).length / 2;
var toleranceX;
var toleranceY;
var footer;

Maio.onReady(function(isDefaultMute) {
    initVideo();
    loadVideo();
});

function initVideo() {
    video = document.querySelector('video');
    video.style.width = window.parent.screen.width + "px";
    //var height = (window.parent.screen.width / 16 * 9); // TODO
    var height = window.parent.screen.width;
    video.style.height = height + "px";
    var top = (window.parent.screen.height - height) / 2;
    video.style.top = top + "px";

    video.addEventListener("loadeddata", playVideo, false);
    video.addEventListener("ended", videoEndCallback, false);

    footer = document.querySelector('div#footer');
    footer.style.top = top + window.parent.screen.width + "px";
}

function videoEndCallback(){
    hideVideo();
    initCanvas();
    showCanvas();
}

function loadVideo() {
    video.load();
}

function playVideo() {
    video.play();
}

function showVideo() {
    video.style.display = "";
}

function hideVideo() {
    video.style.display = "none";
}

function initCanvas() {
    wrapper = document.querySelector('div#canvas_wrapper');
    wrapper.style.width = wrapper.style.height = window.parent.screen.width + "px";
    var top = (window.parent.screen.height - window.parent.screen.width) / 2;
    wrapper.style.top = top + "px";

    canvas = document.createElement('canvas');
    canvas.height = canvas.width = window.parent.screen.width;
    
    canvas.setAttribute("id", "canvas");
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage = new createjs.Stage("canvas");
    if (createjs.Touch.isSupported() == true) {
        createjs.Touch.enable(stage)
    }
    initPainter();
}

function showCanvas() {
    wrapper.style.display = "";
}

function hideCanvas() {
    wrapper.style.display = "none";
}

function initPainter() {
    checkIndex = 1;
    var shape = new createjs.Shape();
    stage.addChild(shape);
    stage.addEventListener("stagemousedown", handleDown);
    
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);
    function onTick() {
        stage.update();
    }

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

    function checkPos(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if (checkIndex > len) {
            checkIndex = len;
        }
        toleranceX = toleranceY = 10;
        if (checkIndex == 1 || checkIndex == len) {
            toleranceX = toleranceY = 20;
        }
        var checkX = checkPointScale["x" + checkIndex] * canvas.width;
        var checkY = checkPointScale["y" + checkIndex] * canvas.width;
        checkX = parseInt(checkX);
        checkY = parseInt(checkY);

        if ((checkX - toleranceX) <= x && x <= (checkX + toleranceX) && 
            (checkY - toleranceY) <= y && y <= (checkY + toleranceY)) {
            checkIndex++;
            return true;
        }
        return false;
    }

    function judge(x, y) {
        if (checkPos(x, y) && checkIndex >= len) {
            // GOAL
            video.src = "video/test2.mp4";
            video.removeEventListener("ended", videoEndCallback);
            video.addEventListener("ended", function(){
                Maio.closeAd(true);
            }, false);
        } else {
            // FAULT
            video.src = "video/test.mp4";
            canvas.parentNode.removeChild(canvas);
        }
        loadVideo();
        hideCanvas();
        showVideo();
    }
}