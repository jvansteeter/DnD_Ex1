var clientApp = angular.module('clientApp');

clientApp.controller('gridRenderer', function ($window, Encounter) {

    var canvas;
    var context;
    var width;
    var height;
    var tileSize;
    var dimX;
    var dimY;

    function init() {
        canvas = $('#gridCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        tileSize = 50;

        draw();
    }

    function draw() {
        canvas.css({"zoom":Encounter.mapZoom + "%"});
        canvas.css({"left":Encounter.mapLeftDisplace});
        canvas.css({"top":Encounter.mapTopDisplace});

        dimX = Encounter.encounterState.mapDimX;
        dimY = Encounter.encounterState.mapDimY;

        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(255,0,0,.3)";
        for (var vertLine = 0; vertLine < dimX; vertLine++) {
            context.fillRect(tileSize * vertLine, 0, 2, 650);
        }

        for (var horizLine = 0; horizLine < dimY; horizLine++) {
            context.fillRect(0, tileSize * horizLine, 650, 2);
        }

        $window.requestAnimationFrame(draw);
    }

    init();
});