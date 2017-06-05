var clientApp = angular.module('clientApp');

clientApp.controller('noteRenderer', function ($scope, $window, EncounterService) {
    var canvas;
    var context;
    var tileSize;

    function init() {
        canvas = $('#noteCanvas');
        context = canvas.get(0).getContext('2d');

		var encounterState = EncounterService.encounterState;
        tileSize = EncounterService.tileSize;

		draw();
    }

    function draw() {
    	clear_canvas();

        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;

        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        var color_index = 0;
        for(var user in EncounterService.notes){
            var color_data = EncounterService.colors[color_index];

            context.fillStyle = "rgba(" + color_data[0] + "," + color_data[1] + "," + color_data[2] + ", 0.2)";

            var cells = EncounterService.notes[user];
            for(var cell in cells){
                var cell_actual = EncounterService.notes[user][cell];
                context.fillRect(tileSize * cell_actual.x, tileSize * cell_actual.y, tileSize, tileSize);
            }
            color_index++;
        }
        $window.requestAnimationFrame(draw);
	}


    //******************************************************************************
	// Renderer Generic
    //******************************************************************************
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