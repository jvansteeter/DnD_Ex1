var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, EncounterService) {
    var body;

    var transform = {x:0, y:0, scale: 1};

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
		EncounterService.mapZoom = 100;
        EncounterService.mapLeftDisplace = 0;
        EncounterService.mapTopDisplace = 0;

    }

    $scope.click = function (event) {
        var canvasPts = screenToMapDim(event.clientX, event.clientY);
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
            if((canvasPts.x >= 0 && canvasPts.x < EncounterService.encounterState.mapDimX) && (canvasPts.y >= 0 && canvasPts.y < EncounterService.encounterState.mapDimY)){
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
                    else{
                        if(EncounterService.isHost()){
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

        if (mouseDown) {
            var oldMapTopDisplace = EncounterService.mapTopDisplace;
            var oldMapLeftDisplace = EncounterService.mapLeftDisplace;

            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

			EncounterService.mapTopDisplace = oldMapTopDisplace + (deltaY / (EncounterService.mapZoom / 100));
			EncounterService.mapLeftDisplace = oldMapLeftDisplace + (deltaX / (EncounterService.mapZoom / 100));

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        else {
            var newCell = screenToMapDim(event.clientX, event.clientY);
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
        var oldZoom = EncounterService.mapZoom;
        //*************************************************************************************************
        // Function 'constants'
        //*************************************************************************************************
        var scroll_scale_delta = 0.05;
        var max_scale = 2.50;
        var min_scale = 0.35;

        //*************************************************************************************************
        // Known Priors
        //*************************************************************************************************
        var start_scale = EncounterService.mapZoom / 100.0;
        var canvas_coor = screenToCanvasRes(currentMouseScreen);
        var map_coor = screenToMapRes(currentMouseScreen);

        var start_left_offset = EncounterService.mapLeftDisplace;
        var start_top_offset = EncounterService.mapTopDisplace;

        console.log('PRIORS');
        console.log('start_scale: ' + start_scale);
        console.log('start_left_offset: ' + start_left_offset);
        console.log('start_top_offset: ' + start_top_offset);
        console.log('canvas_coor: ' + canvas_coor.x + ', ' + canvas_coor.y);
        console.log('map_coor: ' + map_coor.x + ', ' + map_coor.y);
        console.log('');

        //*************************************************************************************************
        // Scale calculation
        //*************************************************************************************************
        var preferred_scale_delta = delta * scroll_scale_delta;
        var preferred_new_scale = start_scale + preferred_scale_delta;

        var new_scale;
        var new_scale_delta;

        if (preferred_new_scale >= max_scale) {
            // if the zoom in pushes past the max scale, set to max scale and calculate actual scale delta
            new_scale = max_scale;
            new_scale_delta = start_scale - max_scale;
        }
        else if (preferred_new_scale <= min_scale) {
            // if the zoom out pushes past the min scale, set to min scale and calculate actual scale delta
            new_scale = min_scale;
            new_scale_delta = min_scale - start_scale;
        }
        else {
            // if the zoom is within bounds, accept the zoom parameters
            new_scale = preferred_new_scale;
            new_scale_delta = preferred_scale_delta;
        }

        var zoom_point_x = (map_coor.x);
        var zoom_point_y = (map_coor.y);

        var x_offset = (zoom_point_x * new_scale_delta);
        var y_offset = (zoom_point_y * new_scale_delta);

        var end_left_offset = start_left_offset - x_offset;
        var end_top_offset = start_top_offset - y_offset;

        // Context scaling test
        map_canvas_ctx.clearRect(-5, -5, EncounterService.encounterState.mapResX + 10, EncounterService.encounterState.mapResY + 10);
        map_canvas_ctx.translate(zoom_point_x, zoom_point_y);
        map_canvas_ctx.scale(1 + new_scale_delta, 1 + new_scale_delta);
        map_canvas_ctx.translate(-zoom_point_x, -zoom_point_y);

        grid_canvas_ctx.clearRect(-5, -5, EncounterService.encounterState.mapResX + 10, EncounterService.encounterState.mapResY + 10);
        grid_canvas_ctx.translate(zoom_point_x, zoom_point_y);
        grid_canvas_ctx.scale(1 + new_scale_delta, 1 + new_scale_delta);
        grid_canvas_ctx.translate(-zoom_point_x, -zoom_point_y);

        highlight_canvas_ctx.clearRect(-5, -5, EncounterService.encounterState.mapResX + 10, EncounterService.encounterState.mapResY + 10);
        highlight_canvas_ctx.translate(zoom_point_x, zoom_point_y);
        highlight_canvas_ctx.scale(1 + new_scale_delta, 1 + new_scale_delta);
        highlight_canvas_ctx.translate(-zoom_point_x, -zoom_point_y);

        token_canvas_ctx.clearRect(-5, -5, EncounterService.encounterState.mapResX + 10, EncounterService.encounterState.mapResY + 10);
        token_canvas_ctx.translate(zoom_point_x, zoom_point_y);
        token_canvas_ctx.scale(1 + new_scale_delta, 1 + new_scale_delta);
        token_canvas_ctx.translate(-zoom_point_x, -zoom_point_y);

        // console.log(map_canvas_ctx.)

        console.log('FINALS');
        console.log('x_offset: ' + x_offset);
        console.log('y_offset: ' + y_offset);
        console.log('new_scale_delta: ' + new_scale_delta);
        console.log('new_scale: ' + new_scale);
        console.log('end_left_offset: ' + end_left_offset);
        console.log('end_top_offset: ' + end_top_offset);
        console.log('');
        console.log(' ------------------------------------------------------------------------');


        // commit the new transform to the canvas
        EncounterService.mapLeftDisplace = end_left_offset;
        EncounterService.mapTopDisplace = end_top_offset;
        EncounterService.mapZoom = new_scale * 100;
    };

    function screenToMapDim(inputX, inputY) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = inputX - rect.left;
        var canvasY = inputY - rect.top;

        var mapX = (canvasX / (EncounterService.mapZoom / 100) - EncounterService.mapLeftDisplace);
        var mapXcoor = Math.floor(mapX / 50);

        var mapY = (canvasY / (EncounterService.mapZoom / 100) - EncounterService.mapTopDisplace);
        var mapYcoor = Math.floor(mapY / 50);

        return {x: mapXcoor, y: mapYcoor};
    }

    function screenToMapRes(coor) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = coor.x - rect.left;
        var canvasY = coor.y - rect.top;

        var mapX = (canvasX / (EncounterService.mapZoom / 100) - EncounterService.mapLeftDisplace);
        var mapY = (canvasY / (EncounterService.mapZoom / 100) - EncounterService.mapTopDisplace);

        return {x: mapX, y: mapY};
    }

    function screenToCanvasRes(coor){
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = coor.x - rect.left;
        var canvasY = coor.y - rect.top;
        return { x: canvasX, y: canvasY }
    }

    init();
});