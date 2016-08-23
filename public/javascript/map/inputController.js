var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, Encounter) {
    var canvas;
    var context;
    var width;
    var height;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

    function init() {
        canvas = $('#inputCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        Encounter.mapZoom = 100;
        Encounter.mapLeftDisplace = 0;
        Encounter.mapTopDisplace = 0;

    }

    $scope.click = function (event) {
        Encounter.updateHasRun = true;
        var canvasPts = screenToMapDim(event.clientX, event.clientY);
        var players = Encounter.encounterState.players;

        var selectedCount = 0;
        var selectedIndex = -1;

        // before processing the click, check for any selected players
        for (var i = 0; i < players.length; i++) {
            if(angular.isDefined(players[i].isSelected)){
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
            players[selectedIndex].mapX = canvasPts.x;
            players[selectedIndex].mapY = canvasPts.y;

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
                    players[k].isSelected = true;
                    break;
                }
            }
        }
    };

    $scope.mouseMove = function (event) {
        Encounter.updateHasRun = true;
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
        }
    };

    $scope.mouseDown = function (event) {
        Encounter.updateHasRun = true;
        mouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    };

    $scope.mouseLeave = function (event) {
        Encounter.updateHasRun = true;
        mouseDown = false;
        Encounter.hoverCell = {x: -1, y: -1};
    };

    $scope.mouseUp = function () {
        Encounter.updateHasRun = true;
        mouseDown = false;
    };

    $scope.mouseScroll = function (event, delta, deltaX, deltaY) {
        Encounter.updateHasRun = true;
        var oldZoom = Encounter.mapZoom;
        Encounter.mapZoom = oldZoom + (delta * 5);
        if (Encounter.mapZoom >= 250) {
            Encounter.mapZoom = 250;
        }

        if (Encounter.mapZoom <= 35) {
            Encounter.mapZoom = 35;
        }
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

    init();
});