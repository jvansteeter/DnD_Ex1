var clientApp = angular.module('clientApp');


clientApp.controller('inputController', function ($scope, EncounterService, $window) {
    var body;

    var transform = {x: 0, y: 0, scale: 1};

    var canvas;
    var map_canvas_ctx;
    var grid_canvas_ctx;
    var highlight_canvas_ctx;
    var token_canvas_ctx;

    var context;
    var width;
    var height;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    // hackiness right here
    var currentMouseScreen = {x: 0, y: 0};
    // end hackiness

    function init() {
        canvas = $('#inputCanvas');
        body = $('body');

        var map_canvas = $('#mapCanvas');
        map_canvas_ctx = map_canvas.get(0).getContext('2d');

        var grid_canvas = $('#gridCanvas');
        grid_canvas_ctx = grid_canvas.get(0).getContext('2d');

        var highlight_canvas = $('#highlightCanvas');
        highlight_canvas_ctx = highlight_canvas.get(0).getContext('2d');

        var token_canvas = $('#tokenCanvas');
        token_canvas_ctx = token_canvas.get(0).getContext('2d');

        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw(){
        EncounterService.canvas_state.res_x = canvas[0].getBoundingClientRect().width;
        EncounterService.canvas_state.res_y = canvas[0].getBoundingClientRect().height;

        // var x_offset = EncounterService.map_transform.x;
        // var y_offset = EncounterService.map_transform.y;
        // var scale = EncounterService.map_transform.scale;
        //
        // context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        $window.requestAnimationFrame(draw);
    }

    $scope.click = function (event) {
        var canvasPts = screenToMapDim({x: event.clientX, y: event.clientY});
        var players = EncounterService.encounterState.players;

        var selectedCount = 0;
        var selectedIndex = -1;

        // before processing the click, check for any selected players
        for (var i = 0; i < players.length; i++) {
            if (angular.isDefined(players[i].isSelected)) {
                if (players[i].isSelected == true) {
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
        if (selectedCount == 1) {
            // is there a token on the destination location
            for (var x = 0; x < players.length; x++) {
                var player = players[x];
                if (player.mapX == canvasPts.x && player.mapY == canvasPts.y) {
                    //if a token is found, un-select the selected token and stop
                    players[selectedIndex].isSelected = false;
                    return;
                }
            }

            // move the selected token
            if ((canvasPts.x >= 0 && canvasPts.x < EncounterService.encounterState.mapDimX) && (canvasPts.y >= 0 && canvasPts.y < EncounterService.encounterState.mapDimY)) {
                players[selectedIndex].mapX = canvasPts.x;
                players[selectedIndex].mapY = canvasPts.y;
            }

            // perpetuate the change
            EncounterService.updatePlayer(selectedIndex);

            // un-select the selected token
            players[selectedIndex].isSelected = false;
        }

        if (selectedCount == 0) {
            // search for a token that was hot by the mouse event
            for (var k = 0; k < players.length; k++) {
                if (players[k].mapX == canvasPts.x && players[k].mapY == canvasPts.y) {
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
    };

    $scope.mouseMove = function (event) {
        currentMouseScreen = {x: event.clientX, y: event.clientY};

        if(mouseDown){
            var start_trans_x = EncounterService.map_transform.x;
            var start_trans_y = EncounterService.map_transform.y;
            var trans_scale = EncounterService.map_transform.scale;

            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            EncounterService.map_transform.x = start_trans_x + deltaX;
            EncounterService.map_transform.y = start_trans_y + deltaY;

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        else {
            var newCell = screenToMapDim({x: event.clientX, y: event.clientY});
            var max_x = EncounterService.encounterState.mapDimX;
            var max_y = EncounterService.encounterState.mapDimY;

            if(newCell.x < max_x && newCell.x >= 0 && newCell.y < max_y && newCell.y >= 0){
                // the mouse is over the map
                EncounterService.hoverCell = {x: newCell.x, y: newCell.y};

                // check if the hoverCell coincides with any player tokens
                var players = EncounterService.encounterState.players;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    if (player.mapX === EncounterService.hoverCell.x && player.mapY === EncounterService.hoverCell.y) {
                        player.isHovered = true;
                    }
                    else {
                        player.isHovered = false;
                    }
                }
            }
            else{
                // the mouse is over a portion of the screen that is NOT part of the map
                EncounterService.hoverCell = undefined;
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
        EncounterService.hoverCell = {x: -1, y: -1};
        // body.css({"overflow":"visible"});
    };

    $scope.mouseEnter = function () {
        // body.css({"overflow":"hidden"});
    };

    $scope.mouseUp = function () {
        mouseDown = false;
    };

    $scope.mouseScroll = function (event, delta, deltaX, deltaY) {
        // var oldZoom = EncounterService.mapZoom;
        //*************************************************************************************************
        // Function 'constants'
        //*************************************************************************************************
        var scroll_scale_delta = 0.20;
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

        var x_offset = -(map_res_coor.x * new_scale_delta);
        var y_offset = -(map_res_coor.y * new_scale_delta);

        EncounterService.map_transform.scale += new_scale_delta;
        EncounterService.map_transform.x += x_offset;
        EncounterService.map_transform.y += y_offset;
    };

    function screenToCanvasRes(coor) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = coor.x - rect.left;
        var canvasY = coor.y - rect.top;
        return {x: canvasX, y: canvasY}
    }

    function screenToMapRes(coor) {
        var canvas_res_coor = screenToCanvasRes(coor);

        var mapX = (canvas_res_coor.x - EncounterService.map_transform.x)/EncounterService.map_transform.scale;
        var mapY = (canvas_res_coor.y - EncounterService.map_transform.y)/EncounterService.map_transform.scale;

        return {x: mapX, y: mapY};
    }

    function screenToMapDim(coor) {
        var map_res_coor = screenToMapRes(coor);

        var map_dim_x = Math.floor(map_res_coor.x / 50);
        var map_dim_y = Math.floor(map_res_coor.y / 50);

        return {x: map_dim_x, y: map_dim_y};
    }


    init();

});
