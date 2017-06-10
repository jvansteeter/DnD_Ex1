var clientApp = angular.module('clientApp');


clientApp.controller('inputController', function ($scope, EncounterService, $window) {
    var body;

    var tileSize;

    var canvas;
    var map_canvas_ctx;
    var grid_canvas_ctx;
    var highlight_canvas_ctx;
    var token_canvas_ctx;

    var context;
    var width;
    var height;

    var mouseDown = false;
    var dragging = false;
    var drag_threshold_default = 5;
    var drag_threshold = drag_threshold_default;
    var mouseX = 0;
    var mouseY = 0;

    // hackiness right here
    // var currentMouseScreen = {x: 0, y: 0};
    // end hackiness

    $scope.init = function() {
        canvas = $('#inputCanvas');
        body = $('body');
        tileSize = EncounterService.tileSize;

        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');

        draw();
    };

    function draw() {
        EncounterService.canvas_state.res_x = canvas[0].getBoundingClientRect().width;
        EncounterService.canvas_state.res_y = canvas[0].getBoundingClientRect().height;

        $window.requestAnimationFrame(draw);
    }

    $scope.click = function (event) {

    };

    $scope.mouseMove = function (event) {
        EncounterService.mouse_scn_res = {x: event.clientX, y: event.clientY};
        EncounterService.mouse_map_res = screenToMapRes({x: event.clientX, y: event.clientY});
        EncounterService.mouse_cell = screenToMapDim({x: event.clientX, y: event.clientY});

        drag_threshold -= 1;

        if (mouseDown) {
            // The mouse is being dragged
            if(drag_threshold < 0)
                dragging = true;

            var start_trans_x = EncounterService.map_transform.x;
            var start_trans_y = EncounterService.map_transform.y;

            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            EncounterService.map_transform.x = start_trans_x + deltaX;
            EncounterService.map_transform.y = start_trans_y + deltaY;

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        else {
            // The mouse is not being dragged
            drag_threshold = drag_threshold_default;

            if (EncounterService.cellInBounds(EncounterService.mouse_cell)) {
                // if the mouse is within the map's bounds
                // EncounterService.hoverCell = EncounterService.mouse_cell;

                // check if the hoverCell coincides with any player tokens
                var players = EncounterService.encounterState.players;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    player.isHovered = !!(player.mapX === EncounterService.mouse_cell.x && player.mapY === EncounterService.mouse_cell.y);
                }
            }
            // else {
            //     // the mouse is over a portion of the screen that is NOT part of the map
            //     EncounterService.hoverCell = null;
            // }
        }
    };

    $scope.mouseDown = function (event) {
        mouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    };

    $scope.mouseLeave = function (event) {
        mouseDown = false;
        EncounterService.hoverCell = null;
    };

    $scope.mouseEnter = function () {
    };

    $scope.mouseUp = function () {
        mouseDown = false;

        if(!dragging){
            if (EncounterService.selected_note_uid === null) {
                handle_default_mouseUp();
            } else {
                handle_note_mouseUp();
            }
        }

        dragging = false;
    };

    $scope.mouseScroll = function (event, delta, deltaX, deltaY) {
        // var oldZoom = EncounterService.mapZoom;
        //*************************************************************************************************
        // Function 'constants'
        //*************************************************************************************************
        var scroll_scale_delta = 0.10;
        var max_scale = 2.50;
        var min_scale = 0.35;

        //*************************************************************************************************
        // Known Priors
        //*************************************************************************************************
        var start_scale = EncounterService.map_transform.scale;
        var map_res_coor = screenToMapRes(currentMouseScreen);

        //*************************************************************************************************
        // Scale calculation
        //*************************************************************************************************
        var preferred_scale_delta = delta * scroll_scale_delta;
        var preferred_new_scale = start_scale + preferred_scale_delta;

        var new_scale;
        var new_scale_delta;

        if (preferred_new_scale >= max_scale) {
            // if the zoom in pushes past the max scale, set to max scale and calculate actual scale delta
            new_scale_delta = start_scale - max_scale;
        }
        else if (preferred_new_scale <= min_scale) {
            // if the zoom out pushes past the min scale, set to min scale and calculate actual scale delta
            new_scale_delta = min_scale - start_scale;
        }
        else {
            // if the zoom is within bounds, accept the zoom parameters
            new_scale_delta = preferred_scale_delta;
        }



        var x_offset = -(EncounterService.mouse_map_res.x * new_scale_delta);
        var y_offset = -(EncounterService.mouse_map_res.y * new_scale_delta);

        EncounterService.map_transform.scale += new_scale_delta;
        EncounterService.map_transform.x += x_offset;
        EncounterService.map_transform.y += y_offset;
    };

    function handle_default_mouseUp() {
        var mapDim_mouse = screenToMapDim({x: event.clientX, y: event.clientY});
        var players = EncounterService.encounterState.players;

        var selectedCount = 0;
        var selectedIndex = -1;

        // before processing the click, check for any selected players
        for (var i = 0; i < players.length; i++) {
            if (angular.isDefined(players[i].isSelected)) {
                if (players[i].isSelected === true) {
                    selectedIndex = i;
                    selectedCount++;
                }
            }
        }

        // if there is more than one piece selected, un-select all of them and return
        if (selectedCount > 1) {
            for (var j = 0; j < players.length; j++) {
                players[j].isSelected = false;
            }
            return;
        }

        // there is a token selected, condition check the move location
        if (selectedCount === 1) {
            // is there a token on the destination location
            for (var x = 0; x < players.length; x++) {
                var player = players[x];
                if (player.mapX === mapDim_mouse.x && player.mapY === mapDim_mouse.y) {
                    //if a token is found, un-select the selected token and stop
                    players[selectedIndex].isSelected = false;
                    return;
                }
            }

            // move the selected token
            if ((mapDim_mouse.x >= 0 && mapDim_mouse.x < EncounterService.encounterState.mapDimX) && (mapDim_mouse.y >= 0 && mapDim_mouse.y < EncounterService.encounterState.mapDimY)) {
                players[selectedIndex].mapX = mapDim_mouse.x;
                players[selectedIndex].mapY = mapDim_mouse.y;
            }

            // perpetuate the change
            EncounterService.updatePlayer_byIndex(selectedIndex);

            // un-select the selected token
            players[selectedIndex].isSelected = false;
        }

        if (selectedCount === 0) {
            // search for a token that was hot by the mouse event
            for (var k = 0; k < players.length; k++) {
                if (players[k].mapX === mapDim_mouse.x && players[k].mapY === mapDim_mouse.y) {
                    //if a token is found, select it and stop
                    if (players[k].visible) {
                        players[k].isSelected = true;
                    }
                    else {
                        if (EncounterService.isHost()) {
                            players[k].isSelected = true;
                        }
                    }
                    break;
                }
            }
        }
    }

    function handle_note_mouseUp() {
        var mapDim_mouse = screenToMapDim({x: event.clientX, y: event.clientY});
        var current_note_id = EncounterService.selected_note_uid;
        var found_note = false;

        // find the note group in the EncounterService
        for (var i = 0; i < EncounterService.encounterState.mapNotations.length; i++) {
            if (EncounterService.encounterState.mapNotations[i]._id === current_note_id) {
                found_note = true;

                var cells = EncounterService.encounterState.mapNotations[i].cells;
                var cell_present = false;
                for (var j = 0; j < cells.length; j++) {
                    if (cells[j].x === mapDim_mouse.x && cells[j].y === mapDim_mouse.y) {
                        cell_present = true;
                        EncounterService.encounterState.mapNotations[i].cells.splice(j, 1);
                    }
                }
                if (!cell_present && EncounterService.cellInBounds(mapDim_mouse)) {
                    EncounterService.encounterState.mapNotations[i].cells.push({x: mapDim_mouse.x, y: mapDim_mouse.y});
                }
				EncounterService.updateNote(EncounterService.encounterState.mapNotations[i]);
			}
			if (found_note) {
				break;
			}
		}
	}

    function screenToCanvasRes(coor) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = coor.x - rect.left;
        var canvasY = coor.y - rect.top;
        return {x: canvasX, y: canvasY}
    }

    function screenToMapRes(coor) {
        var canvas_res_coor = screenToCanvasRes(coor);

        var mapX = (canvas_res_coor.x - EncounterService.map_transform.x) / EncounterService.map_transform.scale;
        var mapY = (canvas_res_coor.y - EncounterService.map_transform.y) / EncounterService.map_transform.scale;

        return {x: mapX, y: mapY};
    }

    function screenToMapDim(coor) {
        var map_res_coor = screenToMapRes(coor);

        var map_dim_x = Math.floor(map_res_coor.x / tileSize);
        var map_dim_y = Math.floor(map_res_coor.y / tileSize);

        return {x: map_dim_x, y: map_dim_y};
    }

});
