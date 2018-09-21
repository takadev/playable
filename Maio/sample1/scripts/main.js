var canvas;
var wrapper;
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
    video.style.width = window.parent.screen.width + "px";
    var height = (window.parent.screen.width / 16 * 9);
    video.style.height = height + "px";
    var top = (window.parent.screen.height - height) / 2;
    video.style.top = top + "px";

    video.addEventListener("loadeddata", function(){
        playVideo();
    }, false);

    video.addEventListener("ended", function(){
        hideVideo();
        initCanvas();
    }, false);
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
    canvas.height = window.parent.screen.width;
    canvas.width = window.parent.screen.width;

    canvas.setAttribute("id", "canvas");
    wrapper.appendChild(canvas);
    ctx = canvas.getContext('2d');

    stage = new createjs.Stage("canvas");
    if (createjs.Touch.isSupported() == true) {
        createjs.Touch.enable(stage)
    }

    initPainter();
    initButton();
}

function showCanvas() {
    wrapper.style.display = "";
}

function hideCanvas() {
    wrapper.style.display = "none";
}

function initPainter() {
    var shape = new createjs.Shape();
    stage.addChild(shape);
    stage.addEventListener("stagemousedown", handleDown);
    
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", onTick);
    function onTick() {
        stage.update();
    }

    function handleDown(event) {
        /*
        if (checkPos(event.stageX, event.stageY) == false) {
            return;
        }*/

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
            //hideCanvas();
            //showVideo();
            console.log("GOAL");
        } else {
            // FAULT
            //hideCanvas();
            //showVideo();
            console.log("FAULT");
        }
    }
}

function initButton() {
    var btnW = 50; // ボタンの横幅
    var btnH = 10; // ボタンの高さ
    var button = new createjs.Container();
    button.x = 200;
    button.y = 120;
    stage.addChild(button);
    
    var bg = new createjs.Shape();
    bg.graphics
        .setStrokeStyle(1)
        .beginStroke("#563d7c")
        .beginFill("white")
        .drawRoundRect(0, 0, btnW, btnH, 4);
    button.addChild(bg);
    // ラベルを作成
    var label = new createjs.Text("Install", "10px sans-serif", "#563d7c");
    label.x = btnW / 2;
    label.y = btnH / 2;
    label.textAlign = "center";
    label.textBaseline = "middle";
    button.addChild(label);

    button.addEventListener("click", handleClick);
    function handleClick(event) {
        // クリックされた時の処理を記述
        alert("クリックされました。");
    }
}
