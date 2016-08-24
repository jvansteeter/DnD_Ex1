var clientApp = angular.module('clientApp');

clientApp.controller('mapRenderer', function ($scope, $window, Encounter) {

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

        if (Encounter.updateHasRun) {
            if (Encounter.encounterState.mapURL) {

                canvas.css({"zoom": Encounter.mapZoom + "%"});
                canvas.css({"left": Encounter.mapLeftDisplace});
                canvas.css({"top": Encounter.mapTopDisplace});

                bgImage.src = "api/image/encounterMap/" + Encounter.encounterID;

                Encounter.encounterState.mapResX = bgImage.width;
                Encounter.encounterState.mapResY = bgImage.height;

                // tileSize = Encounter.encounterState.mapTileSize;
                Encounter.encounterState.mapDimX = bgImage.width / tileSize;
                Encounter.encounterState.mapDimY = bgImage.height / tileSize;

                if (!mapDataUpdate && Encounter.encounterState.mapResX != 0) {

                    Encounter.sendMapData(
                        Encounter.encounterState.mapResX,
                        Encounter.encounterState.mapResY,
                        Encounter.encounterState.mapDimX,
                        Encounter.encounterState.mapDimY
                    );
                    mapDataUpdate = true;
                }

                context.clearRect(0, 0, Encounter.encounterState.mapResX, Encounter.encounterState.mapResY);
                context.drawImage(bgImage, 0, 0);
            }
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
    // new branch comment ... delete me
});