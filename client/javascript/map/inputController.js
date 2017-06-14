var clientApp = angular.module('clientApp');


clientApp.controller('inputController', function ($scope, EncounterService, $window) {
    var body;

    var tileSize;

    var canvas;

    var context;
    var width;
    var height;

    var mouseDown = false;
    var dragging = false;
    var drag_threshold_default = 5;
    var drag_threshold = drag_threshold_default;
    var mouseX = 0;
    var mouseY = 0;

    $scope.init = function () {
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
        // update the mouse positions
        EncounterService.mouse_scn_res = {x: event.clientX, y: event.clientY};
        EncounterService.mouse_map_res = screenToMapRes({x: event.clientX, y: event.clientY});
        EncounterService.mouse_cell = screenToMapDim({x: event.clientX, y: event.clientY});

        // calculate the presence of a activated corner
        var x = Math.round(EncounterService.mouse_map_res.x / EncounterService.tileSize);
        var y = Math.round(EncounterService.mouse_map_res.y / EncounterService.tileSize);

        if (Math.abs(EncounterService.mouse_map_res.x - x * EncounterService.tileSize) < EncounterService.corner_threshold && Math.abs(EncounterService.mouse_map_res.y - y * EncounterService.tileSize) < EncounterService.corner_threshold)
            EncounterService.mouse_corner = {x: x, y: y};
        else
            EncounterService.mouse_corner = null;


        drag_threshold -= 1;

        if (mouseDown) {
            // The mouse is being dragged
            if (drag_threshold < 0)
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
                    player.isHovered = (player.mapX === EncounterService.mouse_cell.x && player.mapY === EncounterService.mouse_cell.y);
                }
            }
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

        if (!dragging) {
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
        var current_note = EncounterService.getCurrentNote();
        var add_note_cells = [];

        // determine the note type and associate that with a radius value
        var radius;
        switch (EncounterService.note_mode) {
            case 'sphere':
                radius = EncounterService.note_size;
                break;
            // case 'single':
            //     radius = 0;
            //     break;
            // case 'five':
            //     radius = 5;
            //     break;
            // case 'ten':
            //     radius = 10;
            //     break;
            // case 'fifteen':
            //     radius = 15;
            //     break;
            // case 'twenty':
            //     radius = 20;
            //     break;
        }


        if (EncounterService.mouse_corner !== null) {
            // Case for making a note on the corner
            var mouse_corner = EncounterService.mouse_corner;

            var start_cells = [];
            if (EncounterService.cellInBounds({x: mouse_corner.x, y: mouse_corner.y}))
                start_cells.push({x: mouse_corner.x, y: mouse_corner.y});
            if (EncounterService.cellInBounds({x: mouse_corner.x - 1, y: mouse_corner.y}))
                start_cells.push({x: mouse_corner.x - 1, y: mouse_corner.y});
            if (EncounterService.cellInBounds({x: mouse_corner.x, y: mouse_corner.y - 1}))
                start_cells.push({x: mouse_corner.x, y: mouse_corner.y - 1});
            if (EncounterService.cellInBounds({x: mouse_corner.x - 1, y: mouse_corner.y - 1}))
                start_cells.push({x: mouse_corner.x - 1, y: mouse_corner.y - 1});
            for (x = 0; x < EncounterService.encounterState.mapDimX; x++) {
                for (y = 0; y < EncounterService.encounterState.mapDimY; y++) {
                    test_cell = {x: x, y: y};
                    for (start_cell_index = 0; start_cell_index < start_cells.length; start_cell_index++) {
                        if (EncounterService.distanceToCornerFromCell(start_cells[start_cell_index], test_cell) <= radius - 5) {
                            if (EncounterService.cellInBounds(test_cell)) {
                                add_note_cells.push(test_cell);
                            }
                        }
                    }
                }
            }
        }
        else {
            //Case for making a note on the cell
            var mouse_cell = EncounterService.mouse_cell;
            //determine the cells to be impacted by this mouse up event
            for (x = 0; x < EncounterService.encounterState.mapDimX; x++) {
                for (y = 0; y < EncounterService.encounterState.mapDimY; y++) {
                    test_cell = {x: x, y: y};
                    if (EncounterService.distanceToCellFromCell(mouse_cell, test_cell) <= radius) {
                        if (EncounterService.cellInBounds(test_cell)) {
                            add_note_cells.push(test_cell);
                        }
                    }
                }
            }
        }

        //check the diff between the addition to the notation and the current notation state, if there are new_cells, add them and flag
        var new_cell_found = false;
        for (j = 0; j < add_note_cells.length; j++){
            if(!isCellInNote(add_note_cells[j], current_note)){
                new_cell_found = true;
                current_note.cells.push(add_note_cells[j]);
            }
        }

        // if there were no new cells in the diff, remove the cells in the notation area.
        if(!new_cell_found){
            for(j = 0; j < add_note_cells.length; j++){
                attemptRemoveCellFromNote(add_note_cells[j], current_note);
            }
        }

        EncounterService.updateNote(current_note);
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

    function isCellInNote(cell, note){
        for(i = 0; i < note.cells.length; i++){
            if(cell.x === note.cells[i].x && cell.y === note.cells[i].y)
                return true;
        }
        return false;
    }

    function attemptRemoveCellFromNote(cell, note){
        for(i = 0; i < note.cells.length; i++){
            if(cell.x === note.cells[i].x && cell.y === note.cells[i].y){
                note.cells.splice(i,1);
            }
        }
    }

});
