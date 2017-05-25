var clientApp = angular.module('clientApp');

clientApp.controller('mapRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var bgImage = new Image();

    var tileSize = 50;
    var mapDataUpdate = false;

    function init() {
        canvas = $('#mapCanvas');
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw() {

        if (EncounterService.updateHasRun) {
            if (EncounterService.encounterState.mapURL) {

                canvas.css({"zoom": EncounterService.mapZoom + "%"});
                canvas.css({"left": EncounterService.mapLeftDisplace});
                canvas.css({"top": EncounterService.mapTopDisplace});

                bgImage.src = "api/image/encounterMap/" + EncounterService.encounterID;

                EncounterService.encounterState.mapResX = bgImage.width;
                EncounterService.encounterState.mapResY = bgImage.height;

                // tileSize = Encounter.encounterState.mapTileSize;
                EncounterService.encounterState.mapDimX = bgImage.width / tileSize;
                EncounterService.encounterState.mapDimY = bgImage.height / tileSize;

                if (!mapDataUpdate && EncounterService.encounterState.mapResX != 0) {

                    EncounterService.sendMapData(
                        EncounterService.encounterState.mapResX,
                        EncounterService.encounterState.mapResY,
                        EncounterService.encounterState.mapDimX,
                        EncounterService.encounterState.mapDimY
                    );
                    mapDataUpdate = true;
                }

                context.clearRect(0, 0, EncounterService.encounterState.mapResX, EncounterService.encounterState.mapResY);
                context.drawImage(bgImage, 0, 0);
            }
        }

        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function(){
        return EncounterService.encounterState.mapResX;
    };

    $scope.getResY = function(){
        return EncounterService.encounterState.mapResY;
    };

    init();
    // new branch comment ... delete me
});