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

                    var note_vis = EncounterService.getNoteVisibilityObject(note_group);
                    switch(note_vis.state){
                        case 'full':
                            context.fillRect(tileSize * x - 1, tileSize * y - 1, tileSize + 1, tileSize + 1);
                            break;
                        case 'ghost':
                            var start_alpha = getNoteColorAlpha(note_group);
                            context.fillStyle = genNewColorStringForContext_Alpha(note_group, start_alpha / 3);
                            context.fillRect(tileSize * x - 1, tileSize * y - 1, tileSize + 1, tileSize + 1);
                            break;
                        case 'off':
                            break;
                        case 'locked':
                            context.fillRect(tileSize * x - 1, tileSize * y - 1, tileSize + 1, tileSize + 1);
                            break;
                    }
                }
            }
        }

        $window.requestAnimationFrame(draw);
	}

	function getNoteColorAlpha(note){
        var alphaValue = note.color.split(',')[3].split(')')[0];
        return parseFloat(alphaValue);
    }

    function genNewColorStringForContext_Alpha(note, alpha){
	    var colorParts = note.color.split(',');
	    colorParts[3] = alpha + ')';
	    return colorParts.join(',');
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