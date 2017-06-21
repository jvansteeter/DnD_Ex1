var clientApp = angular.module('clientApp');

clientApp.controller('highlightRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var tileSize;

    var space_check = 0;

    $scope.init = function () {
        canvas = $('#highlightCanvas');
        context = canvas.get(0).getContext('2d');

        tileSize = EncounterService.tileSize;

        draw();
    };

    function draw() {
        // ***********************************************************************************
        // SETUP PHASE
        // ***********************************************************************************
        clear_canvas();
        // transform step
        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;
        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        // ***********************************************************************************
        // OPERATION PHASE
        // ***********************************************************************************

        switch (EncounterService.input_mode) {
            case 'default':
                handle_default_mode();
                break;
            case 'note':
                handle_note_mode();
                break;
        }


        // ***********************************************************************************
        // COMPLETE PHASE
        // ***********************************************************************************
        $window.requestAnimationFrame(draw);
    }

    $scope.get_res_x = function () {
        return EncounterService.canvas_state.res_x;
    };

    $scope.get_res_y = function () {
        return EncounterService.canvas_state.res_y;
    };

    function clear_canvas() {
        var offset = EncounterService.canvas_state.clear_offset;
        context.clearRect(-offset, -offset, EncounterService.encounterState.mapResX + (2 * offset), EncounterService.encounterState.mapResY + (2 * offset));
    }

    /***********************************************************************************************
     * handle_default_mode()
     ***********************************************************************************************
     * Controller specific route for handling how the map should render when in default mode
     */
    function handle_default_mode() {
        space_check += 1;

        if (EncounterService.cellInBounds(EncounterService.mouse_cell)) {
            // The mouse is on the canvas and in the map bounds

            // Render the mouse tile
            var playerFound = false;

            // for (var j = 0; j < players.length; j++) {
            for (player_index = 0; player_index < EncounterService.encounterState.players.length; player_index++) {
                player = EncounterService.encounterState.players[player_index];
                if (player.mapX === EncounterService.mouse_cell.x && player.mapY === EncounterService.mouse_cell.y && (player.visible || EncounterService.isHost())) {
                    playerFound = true;
                    break;
                }
            }

            if (playerFound) {
                context.fillStyle = "rgba(102,178,255,0.2)";
                context.fillRect(tileSize * EncounterService.mouse_cell.x + 1, tileSize * EncounterService.mouse_cell.y + 1, tileSize - 1, tileSize - 1);
            }
            else {
                context.fillStyle = "rgba(255,255,255,.2)";
                context.fillRect(tileSize * EncounterService.mouse_cell.x + 1, tileSize * EncounterService.mouse_cell.y + 1, tileSize - 1, tileSize - 1);
            }
        }

        // render any selected players with darker color, if present
        for (player_index = 0; player_index < EncounterService.encounterState.players.length; player_index++) {
            var player = EncounterService.encounterState.players[player_index];
            if (player.isSelected) {
                context.fillStyle = "rgba(45,136,229,.4)";
                context.fillRect(tileSize * player.mapX + 1, tileSize * player.mapY + 1, tileSize - 1, tileSize - 1);
            }
        }
    }

    function handle_note_mode() {
        if (EncounterService.mouse_corner !== null) {
            // render the corner highlights
            context.fillStyle = "rgba(255,0,0,0.3)";
            if (EncounterService.mouse_corner !== null) {
                // context.fillRect((tileSize * EncounterService.mouse_corner.x) - (tileSize * EncounterService.corner_ratio / 2), (tileSize * EncounterService.mouse_corner.y) - (tileSize * EncounterService.corner_ratio / 2), tileSize * EncounterService.corner_ratio, tileSize * EncounterService.corner_ratio);
                context.beginPath();
                context.arc(tileSize * EncounterService.mouse_corner.x, tileSize * EncounterService.mouse_corner.y, EncounterService.corner_threshold, 0, 2 * Math.PI);
                context.lineWidth = 3;
                context.strokeStyle = "rgba(255,0,0,0.6)";
                context.stroke();
            }
        }

        switch (EncounterService.note_mode) {
            case 'sphere':
                handle_note_sphere(EncounterService.note_size);
                break;
            // case 'single':
            //     handle_note_sphere(0);
            //     break;
            // case 'five':
            //     handle_note_sphere(5);
            //     break;
            // case 'ten':
            //     handle_note_sphere(10);
            //     break;
            // case 'fifteen':
            //     handle_note_sphere(15);
            //     break;
            // case 'twenty':
            //     handle_note_sphere(20);
            //     break;
        }

    }

    function handle_note_sphere(radius) {
        var note_uid = EncounterService.selected_note_uid;
        var color = null;
        var stroke_color = null;

        for (var i = 0; i < EncounterService.encounterState.mapNotations.length; i++) {
            var note_group = EncounterService.encounterState.mapNotations[i];
            if (note_group._id === note_uid){
                color = note_group.color;
                var color_split = note_group.color.split(',');
                if(color_split.length === 4){
                    color_split[3] = '  1.0)';
                }
                else{
                //    handle the case where the color defaulted to hsl instead of hsla
                }
                stroke_color = color_split.join(',');
            }
        }
        context.fillStyle = color;

        var start_cells = [];
        var test_distance = radius;
        var render_these = [];


        var corner = EncounterService.mouse_corner;
        if (corner !== null) {
            // highlight based around corner
            if (EncounterService.cellInBounds({x: corner.x, y: corner.y}))
                start_cells.push({x: corner.x, y: corner.y});
            if (EncounterService.cellInBounds({x: corner.x - 1, y: corner.y}))
                start_cells.push({x: corner.x - 1, y: corner.y});
            if (EncounterService.cellInBounds({x: corner.x, y: corner.y - 1}))
                start_cells.push({x: corner.x, y: corner.y - 1});
            if (EncounterService.cellInBounds({x: corner.x - 1, y: corner.y - 1}))
                start_cells.push({x: corner.x - 1, y: corner.y - 1});

            for (x = 0; x < EncounterService.encounterState.mapDimX; x++) {
                for (y = 0; y < EncounterService.encounterState.mapDimY; y++) {
                    test_cell = {x: x, y: y};

                    for (start_cell_index = 0; start_cell_index < start_cells.length; start_cell_index++) {
                        if (EncounterService.distanceToCornerFromCell(start_cells[start_cell_index], test_cell) <= test_distance - 5) {
                            if (EncounterService.cellInBounds(test_cell)) {
                                render_these.push(test_cell);
                                break;
                            }
                        }
                    }
                }
            }

            context.beginPath();
            context.arc(tileSize * corner.x, corner.y * tileSize, (radius / 5) * tileSize, 0, 2 * Math.PI);
            context.lineWidth = 3;
            context.strokeStyle = stroke_color;
            context.stroke();

        }
        else {
            var mouse = EncounterService.mouse_cell;
            start_cells.push(mouse);

            if(mouse !== null){
                // highlight based around cell
                for (x = 0; x < EncounterService.encounterState.mapDimX; x++) {
                    for (y = 0; y < EncounterService.encounterState.mapDimY; y++) {
                        test_cell = {x: x, y: y};

                        for (start_cell_index = 0; start_cell_index < start_cells.length; start_cell_index++) {
                            if (EncounterService.distanceToCellFromCell(start_cells[start_cell_index], test_cell) <= test_distance) {
                                if (EncounterService.cellInBounds(test_cell)) {
                                    render_these.push(test_cell);
                                    break;
                                }
                            }
                        }
                    }
                }

                context.beginPath();
                context.arc(tileSize * mouse.x + tileSize/2, mouse.y * tileSize + tileSize/2, (radius / 5) * tileSize, 0, 2 * Math.PI);
                context.lineWidth = 3;
                context.strokeStyle = stroke_color;
                context.stroke();
            }
        }



        // render all cells connected to the desired notation style
        for (i = 0; i < render_these.length; i++) {
            context.fillRect(tileSize * render_these[i].x + 1, tileSize * render_these[i].y + 1, tileSize - 1, tileSize - 1);
        }
    }
});