var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, Encounter) {
    var body;

    var canvas;
    var context;
    var width;
    var height;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    // hackiness right here
    var currentMouseScreen = {x:0, y:0};
    // end hackiness

    function init() {
        canvas = $('#inputCanvas');
        body = $('body');

        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        Encounter.mapZoom = 100;
        Encounter.mapLeftDisplace = 0;
        Encounter.mapTopDisplace = 0;

    }

    $scope.click = function (event) {
        var canvasPts = screenToMapDim(event.clientX, event.clientY);
        var players = Encounter.encounterState.players;

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
            if((canvasPts.x >= 0 && canvasPts.x < Encounter.encounterState.mapDimX) && (canvasPts.y >= 0 && canvasPts.y < Encounter.encounterState.mapDimY)){
                players[selectedIndex].mapX = canvasPts.x;
                players[selectedIndex].mapY = canvasPts.y;
            }

            // perpetuate the change
            Encounter.updatePlayer(selectedIndex);

            // un-select the selected token
            players[selectedIndex].isSelected = false;
        }

        if (selectedCount == 0) {
            // search for a token that was hot by the mouse event
            for (var k = 0; k < players.length; k++) {
                if (players[k].mapX == canvasPts.x && players[k].mapY == canvasPts.y) {
                    //if a token is found, select it and stop
                    if(players[k].visible){
                        players[k].isSelected = true;
                    }
                    else{
                        if(Encounter.isHost()){
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
            var oldMapTopDisplace = Encounter.mapTopDisplace;
            var oldMapLeftDisplace = Encounter.mapLeftDisplace;

            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            Encounter.mapTopDisplace = oldMapTopDisplace + (deltaY / (Encounter.mapZoom / 100));
            Encounter.mapLeftDisplace = oldMapLeftDisplace + (deltaX / (Encounter.mapZoom / 100));

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        else {
            var newCell = screenToMapDim(event.clientX, event.clientY);
            Encounter.hoverCell = {x: newCell.x, y: newCell.y};

            // check if the hoverCell coincides with any player tokens
            var players = Encounter.encounterState.players;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.mapX === Encounter.hoverCell.x && player.mapY === Encounter.hoverCell.y) {
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
        Encounter.hoverCell = {x: -1, y: -1};
        body.css({"overflow":"visible"});
    };

    $scope.mouseEnter = function(){
        body.css({"overflow":"hidden"});
    };

    $scope.mouseUp = function () {
        mouseDown = false;
    };

    $scope.mouseScroll = function (event, delta, deltaX, deltaY) {
        var oldZoom = Encounter.mapZoom;

        var preferredZoomDelta = delta * 5;
        var preferredNewZoom = oldZoom + preferredZoomDelta;

        var actualZoomDelta;
        var actualNewZoom;

        if (preferredNewZoom >= 250) {
            actualNewZoom = 250;
            actualZoomDelta = oldZoom - 250;
        }
        else if (preferredNewZoom <= 35) {
            actualNewZoom = 35;
            actualZoomDelta = 35 - oldZoom;
        }
        else{
            actualNewZoom = preferredNewZoom;
            actualZoomDelta = preferredZoomDelta;
        }

        var oldLeftDisplace = Encounter.mapLeftDisplace;
        var oldTopDisplace = Encounter.mapTopDisplace;

        var mapCoor = screenToMapRes(currentMouseScreen);

        var newLeftDisplace = oldLeftDisplace + (mapCoor.x * actualZoomDelta / 100);
        var newTopDisplace = oldTopDisplace + (mapCoor.y * actualZoomDelta / 100);

        Encounter.mapLeftDisplace = newLeftDisplace;
        Encounter.mapTopDisplace = newTopDisplace;
        Encounter.mapZoom = actualNewZoom;
    };

    function screenToMapDim(inputX, inputY) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = inputX - rect.left;
        var canvasY = inputY - rect.top;

        var mapX = (canvasX / (Encounter.mapZoom / 100) - Encounter.mapLeftDisplace);
        var mapXcoor = Math.floor(mapX / 50);

        var mapY = (canvasY / (Encounter.mapZoom / 100) - Encounter.mapTopDisplace);
        var mapYcoor = Math.floor(mapY / 50);

        return {x: mapXcoor, y: mapYcoor};
    }

    function screenToMapRes(coor) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = coor.x - rect.left;
        var canvasY = coor.y - rect.top;

        var mapX = (canvasX / (Encounter.mapZoom / 100) - Encounter.mapLeftDisplace);
        var mapY = (canvasY / (Encounter.mapZoom / 100) - Encounter.mapTopDisplace);

        return {x: mapX, y: mapY};
    }

    init();
});