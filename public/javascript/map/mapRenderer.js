var clientApp = angular.module('clientApp');

clientApp.controller('mapRenderer', function ($window, Encounter) {

    var canvas;
    var context;
    var width;
    var height;
    var bgImage = new Image();

    var tileSize = 50;

    function init(){
        canvas = $('#mapCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        bgImage.src = "image/map/dungeon.jpg";
        Encounter.mapZoom = 100;

        draw();
    }

    function draw(){
        canvas.css({"zoom":Encounter.mapZoom + "%"});

        Encounter.encounterState.mapResX = bgImage.width;
        Encounter.encounterState.mapResY = bgImage.height;
        // tileSize = Encounter.encounterState.mapTileSize;
        Encounter.encounterState.mapDimX = bgImage.width / tileSize;
        Encounter.encounterState.mapDimY = bgImage.height / tileSize;

        context.clearRect(0, 0, width, height);
        context.drawImage(bgImage,0,0);

        $window.requestAnimationFrame(draw);
    }

    init();
});