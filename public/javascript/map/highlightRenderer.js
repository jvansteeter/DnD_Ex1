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
        clear_canvas();

        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;

        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

        var players = EncounterService.encounterState.players;
        var player;
        context.fillStyle = "rgba(255,255,255,.2)";

        if (angular.isDefined(EncounterService.hoverCell)) {

            if (EncounterService.hoverCell.x != -1) {
                // check if the hover cell is over a player; if it is, don't render the red square

                for( var j = 0; j < players.length; j++){
                    player = players[j];
                    if(player.mapX === EncounterService.hoverCell.x && player.mapY === EncounterService.hoverCell.y && (player.visible || EncounterService.isHost())){
                        context.fillStyle = "rgba(102,178,255,0)";
                    }
                }
                var xCoor = EncounterService.hoverCell.x;
                var yCoor = EncounterService.hoverCell.y;
                context.fillRect(tileSize * xCoor, tileSize * yCoor, tileSize, tileSize);
            }
        }

        // render the selected player with darker red, if present
        for (var i = 0; i < players.length; i++) {
            player = players[i];
            if (player.isSelected) {
                context.fillStyle = "rgba(45,136,229,.4)";
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

    init();
});