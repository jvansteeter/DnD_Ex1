var clientApp = angular.module('clientApp');

clientApp.controller('mapRenderer', function ($window, Encounter) {

    var canvas;
    var context;
    var width;
    var height;
    var bgImage = new Image();

    var tileSize = 50;
    var mapDataUpdate = false;
    var imageURL;

    function init() {
        canvas = $('#mapCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw() {

        if (Encounter.updateHasRun) {
            if(Encounter.encounterState.mapURL){

                canvas.css({"zoom": Encounter.mapZoom + "%"});
                canvas.css({"left": Encounter.mapLeftDisplace});
                canvas.css({"top": Encounter.mapTopDisplace});

                bgImage.src = "api/image/encounterMap/" + Encounter.encounterID;

                Encounter.encounterState.mapResX = bgImage.width;
                Encounter.encounterState.mapResY = bgImage.height;

                // tileSize = Encounter.encounterState.mapTileSize;
                Encounter.encounterState.mapDimX = bgImage.width / tileSize;
                Encounter.encounterState.mapDimY = bgImage.height / tileSize;

                console.log(Encounter.encounterState.mapResX,
                    Encounter.encounterState.mapResY,
                    Encounter.encounterState.mapDimX,
                    Encounter.encounterState.mapDimY);

                if(!mapDataUpdate && Encounter.encounterState.mapResX != 0){

                    Encounter.sendMapData(
                        Encounter.encounterState.mapResX,
                        Encounter.encounterState.mapResY,
                        Encounter.encounterState.mapDimX,
                        Encounter.encounterState.mapDimY
                    );
                    mapDataUpdate = true;
                }

                context.clearRect(0, 0, width, height);
                context.drawImage(bgImage, 0, 0);
            }
        }

        $window.requestAnimationFrame(draw);
    }

    init();
});