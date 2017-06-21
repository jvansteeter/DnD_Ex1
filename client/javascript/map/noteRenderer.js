var clientApp = angular.module('clientApp');

clientApp.controller('noteRenderer', function ($scope, $window, EncounterService) {
    var canvas;
    var context;
    var tileSize;

    $scope.init = function() {
        canvas = $('#noteCanvas');
        context = canvas.get(0).getContext('2d');

		var encounterState = EncounterService.encounterState;
        tileSize = EncounterService.tileSize;

		draw();
    };

    function draw() {
    	clear_canvas();

        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;

        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        for(var k = 0; k < EncounterService.encounterState.mapNotations.length; k++){
            var note_group = EncounterService.encounterState.mapNotations[k];

            if(note_group.isPublic || EncounterService.isNoteOwner(note_group)){
                context.fillStyle = note_group.color;

                var cells = note_group.cells;
                for(var j = 0; j < cells.length; j++){
                    var x = cells[j].x;
                    var y = cells[j].y;

                    context.fillRect(tileSize * x , tileSize * y, tileSize - 1, tileSize - 1);
                }
            }
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
});