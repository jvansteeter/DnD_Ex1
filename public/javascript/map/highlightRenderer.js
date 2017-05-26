var clientApp = angular.module('clientApp');

clientApp.controller('highlightRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;

    var tileSize = 50;
    var dialationFactor = 0;

    function init() {
        canvas = $('#highlightCanvas');
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw() {
        // canvas.css({"zoom": EncounterService.mapZoom + "%"});
        // canvas.css({"left": EncounterService.mapLeftDisplace});
        // canvas.css({"top": EncounterService.mapTopDisplace});

        var players = EncounterService.encounterState.players;
        var player;
        context.fillStyle = "rgba(255,0,0,.2)";

        context.clearRect(0, 0, EncounterService.encounterState.mapResX, EncounterService.encounterState.mapResY)

        if (angular.isDefined(EncounterService.hoverCell)) {
            if (EncounterService.hoverCell.x != -1) {

                // check if the hover cell is over a player; if it is, don't render the red square
                for( var j = 0; j < players.length; j++){
                    player = players[j];
                    if(player.mapX === EncounterService.hoverCell.x && player.mapY === EncounterService.hoverCell.y && (player.visible || EncounterService.isHost())){
                        context.fillStyle = "rgba(102,178,255,0";
                    }
                }

                var xCoor = EncounterService.hoverCell.x;
                var yCoor = EncounterService.hoverCell.y;
                context.fillRect(tileSize * xCoor, tileSize * yCoor, tileSize, tileSize);
            }
        }

        // render the selected player, if present
        for (var i = 0; i < players.length; i++) {
            player = players[i];
            if (player.isSelected) {
                context.fillStyle = "rgba(255,0,0,.4)";
                var selectX = player.mapX;
                var selectY = player.mapY;
                context.fillRect(
                    tileSize * selectX + (tileSize * dialationFactor / 2),
                    tileSize * selectY + (tileSize * dialationFactor / 2),
                    tileSize * (1 - dialationFactor),
                    tileSize * (1 - dialationFactor));
            }
        }

        //render any players that are "isHovered"
        for(var k = 0; k < players.length; k++){
            player = players[k];
            if(angular.isDefined(player.isHovered)){
                if(player.isHovered && player.visible){
                    context.fillStyle = "rgba(102,178,255,.3)";
                    context.fillRect(tileSize * player.mapX, tileSize * player.mapY, tileSize, tileSize);
                }
            }
        }


        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function () {
        return EncounterService.encounterState.mapResX;
    };

    $scope.getResY = function () {
        return EncounterService.encounterState.mapResY;
    };

    init();
});