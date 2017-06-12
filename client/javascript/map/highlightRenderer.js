var clientApp = angular.module('clientApp');

clientApp.controller('highlightRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var tileSize;

    var space_check = 0;

    $scope.init = function() {
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

        switch (EncounterService.input_mode){
            case 'default':
                handle_default_mode();
                break;
            case 'note_single':
                handle_note_single();
                break;
            case 'note_five':
                handle_note_sphere(5);
                break;
            case 'note_ten':
                handle_note_sphere(10);
                break;
            case 'note_fifteen':
                handle_note_sphere(15);
                break;
            case 'note_twenty':
                handle_note_sphere(20);
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

        if(EncounterService.cellInBounds(EncounterService.mouse_cell)){
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

            if(playerFound){
                context.fillStyle = "rgba(102,178,255,0.2)";
                context.fillRect(tileSize * EncounterService.mouse_cell.x, tileSize * EncounterService.mouse_cell.y, tileSize, tileSize);
            }
            else{
                context.fillStyle = "rgba(255,255,255,.2)";
                context.fillRect(tileSize * EncounterService.mouse_cell.x, tileSize * EncounterService.mouse_cell.y, tileSize, tileSize);
            }
        }

        // render any selected players with darker color, if present
        for(player_index = 0; player_index < EncounterService.encounterState.players.length; player_index++){
            var player = EncounterService.encounterState.players[player_index];
            if (player.isSelected) {
                context.fillStyle = "rgba(45,136,229,.4)";
                context.fillRect(tileSize * player.mapX, tileSize * player.mapY, tileSize, tileSize);
            }
        }
    }

    function handle_note_mode(){

    }

    /***********************************************************************************************
     * handle_note_single()
     ***********************************************************************************************
     * Controller specific route for handling how the map should render when in note mode
     */
    function handle_note_single() {
        var note_uid = EncounterService.selected_note_uid;
        if(note_uid === null){
            return;
        }

        var color = null;

        for(var i = 0; i < EncounterService.encounterState.mapNotations.length; i++){
            var note_group = EncounterService.encounterState.mapNotations[i];
            if (note_group._id === note_uid)
                color = note_group.color;
        }

        context.fillStyle = color;

        // if there is a cell that the mouse point is hovering over
        if (EncounterService.cellInBounds(EncounterService.mouse_cell)) {
            context.fillRect(tileSize * EncounterService.mouse_cell.x, tileSize * EncounterService.mouse_cell.y, tileSize, tileSize);
        }
    }

    function handle_note_sphere(radius){
        var note_uid = EncounterService.selected_note_uid;
        if(note_uid === null){
            return;
        }

        var color = null;

        for(var i = 0; i < EncounterService.encounterState.mapNotations.length; i++){
            var note_group = EncounterService.encounterState.mapNotations[i];
            if (note_group._id === note_uid)
                color = note_group.color;
        }

        context.fillStyle = color;

        var test_distance = radius;
        var render_these = [];

        for(var x = 0; x < EncounterService.encounterState.mapDimX; x++){
            for(var y = 0; y < EncounterService.encounterState.mapDimY; y++){
                var test_cell = {x:x,y:y};
                if(EncounterService.distanceToCellFromCell(test_cell, EncounterService.mouse_cell) <= test_distance) {
                    if(EncounterService.cellInBounds(test_cell))
                        render_these.push(test_cell);
                }
            }
        }

        for(i = 0; i < render_these.length; i++){
            context.fillRect(tileSize * render_these[i].x, tileSize * render_these[i].y, tileSize, tileSize);
        }
    }
});