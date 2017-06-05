var clientApp = angular.module('clientApp');

clientApp.controller('gridRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var tileSize;

    function init() {
        canvas = $('#gridCanvas');

        context = canvas.get(0).getContext('2d');
        tileSize = EncounterService.tileSize;

        draw();
    }

    function draw() {
        clear_canvas();

        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;

        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        var dimX = EncounterService.encounterState.mapDimX;
        var dimY = EncounterService.encounterState.mapDimY;
        var resX = EncounterService.encounterState.mapResX;
        var resY = EncounterService.encounterState.mapResY;

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

    // $scope.getResX = function(){
    //     return EncounterService.encounterState.mapResX;
    // };
    //
    // $scope.getResY = function(){
    //     return EncounterService.encounterState.mapResY;
    // };

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

    init();
});