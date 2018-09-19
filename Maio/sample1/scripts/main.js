var canvas;
var video;
var ctx;
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

var mikanX = 0;
var lastTimestamp = null;

var Asset = {};
Asset.images = {};

Asset.assets = [
    { type: 'image', name: 'back', src: 'images/back.png' },
    { type: 'image', name: 'box', src: 'images/box.png' }
];

Asset.loadAssets = function(onComplete) {
    var total = Asset.assets.length;
    var loadCount = 0;
    var onLoad = function() {
        loadCount++;
        if (loadCount >= total) {
            onComplete();
        }
    };

    Asset.assets.forEach(function(asset) {
        switch (asset.type) {
            case 'image':
                Asset._loadImage(asset, onLoad);
                break;
        }
    });
};

Asset._loadImage = function(asset, onLoad) {
    var image = new Image();
    image.src = asset.src;
    image.onload = onLoad;
    Asset.images[asset.name] = image;
};

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
    body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;

    Asset.loadAssets(function() {
        requestAnimationFrame(update);
    });
}

function update(timestamp) {
    requestAnimationFrame(update);
    render();

    var delta = 0;
    if (lastTimestamp != null) {
        delta = (timestamp - lastTimestamp) / 1000;
    }
    lastTimestamp = timestamp;
    mikanX += 100 * delta;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(Asset.images['back'], 0, 0);
    ctx.drawImage(Asset.images['box'], mikanX, 0);
}