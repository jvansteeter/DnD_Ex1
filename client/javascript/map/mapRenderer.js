var clientApp = angular.module('clientApp');

clientApp.controller('mapRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var bgImage = new Image();

    var tileSize;
    var mapDataUpdate = false;

    $scope.init = function() {
        canvas = $('#mapCanvas');
        context = canvas.get(0).getContext('2d');

        tileSize = EncounterService.tileSize;

        draw();
    };

    function draw() {

        if (EncounterService.encounterState.mapURL) {
            var x_offset = EncounterService.map_transform.x;
            var y_offset = EncounterService.map_transform.y;
            var scale = EncounterService.map_transform.scale;

            context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

            bgImage.src = "api/image/encounterMap/" + EncounterService.encounterID;

            EncounterService.encounterState.mapResX = bgImage.width;
            EncounterService.encounterState.mapResY = bgImage.height;

            // tileSize = Encounter.encounterState.mapTileSize;
            EncounterService.encounterState.mapDimX = bgImage.width / tileSize;
            EncounterService.encounterState.mapDimY = bgImage.height / tileSize;

            if (!mapDataUpdate && EncounterService.encounterState.mapResX !== 0) {

                EncounterService.sendMapData(
                    EncounterService.encounterState.mapResX,
                    EncounterService.encounterState.mapResY,
                    EncounterService.encounterState.mapDimX,
                    EncounterService.encounterState.mapDimY
                );
                mapDataUpdate = true;
            }

            clear_canvas();
            context.drawImage(bgImage, 0, 0);
        }

        $window.requestAnimationFrame(draw);
    }

    $scope.get_res_x = function(){
        return EncounterService.canvas_state.res_x;
    };

    $scope.get_res_y = function(){
        return EncounterService.canvas_state.res_y;
    };

    function clear_canvas() {
        var offset = EncounterService.canvas_state.clear_offset;
        context.clearRect(-offset, -offset, EncounterService.encounterState.mapResX + (2 * offset), EncounterService.encounterState.mapResY + (2 * offset));
    }
});