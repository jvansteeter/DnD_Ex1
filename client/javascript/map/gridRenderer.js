var clientApp = angular.module('clientApp');

clientApp.controller('gridRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var tileSize;

    $scope.init = function() {
        canvas = $('#gridCanvas');

        context = canvas.get(0).getContext('2d');
        tileSize = EncounterService.tileSize;

        draw();
    };

    function draw() {
        clear_canvas();

        if(EncounterService.gridEnabled){
            var x_offset = EncounterService.map_transform.x;
            var y_offset = EncounterService.map_transform.y;
            var scale = EncounterService.map_transform.scale;

            context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

            var dimX = EncounterService.encounterState.mapDimX;
            var dimY = EncounterService.encounterState.mapDimY;
            var resX = EncounterService.encounterState.mapResX;
            var resY = EncounterService.encounterState.mapResY;

            context.clearRect(0, 0, resX, resY);
            context.fillStyle = "rgba(0,0,0,.3)";
            for (var vertLine = 0; vertLine <= dimX; vertLine++) {
                context.fillRect(tileSize * vertLine - 1, 0, 1, dimY * tileSize);
            }

            for (var horizLine = 0; horizLine <= dimY; horizLine++) {
                context.fillRect(0, tileSize * horizLine - 1, dimX * tileSize, 1);
            }
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