var clientApp = angular.module('clientApp');

clientApp.controller('gridRenderer', function ($scope, $window, Encounter) {

    var canvas;
    var context;

    var tileSize;

    function init() {
        canvas = $('#gridCanvas');

        context = canvas.get(0).getContext('2d');
        tileSize = 50;

        draw();
    }

    function draw() {
        canvas.css({"zoom":Encounter.mapZoom + "%"});
        canvas.css({"left":Encounter.mapLeftDisplace});
        canvas.css({"top":Encounter.mapTopDisplace});

        var dimX = Encounter.encounterState.mapDimX;
        var dimY = Encounter.encounterState.mapDimY;
        var resX = Encounter.encounterState.mapResX;
        var resY = Encounter.encounterState.mapResY;

        context.clearRect(0, 0, resX, resY);
        context.fillStyle = "rgba(171,176,186,.3)";
        for (var vertLine = 0; vertLine <= dimX; vertLine++) {
            context.fillRect(tileSize * vertLine, 0, 2, dimY * tileSize);
        }

        for (var horizLine = 0; horizLine <= dimY; horizLine++) {
            context.fillRect(0, tileSize * horizLine, dimX * tileSize, 2);
        }

        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function(){
        return Encounter.encounterState.mapResX;
    };

    $scope.getResY = function(){
        return Encounter.encounterState.mapResY;
    };

    init();
});