var clientApp = angular.module('clientApp');

clientApp.controller('tokenRenderer', function ($scope, $window, Encounter) {

    var canvas;
    var context;
// minor change
    var tileSize;

    function init() {
        canvas = $('#tokenCanvas');
        context = canvas.get(0).getContext('2d');

        tileSize = 50;

        draw();
    }

    function draw() {
        canvas.css({"zoom": Encounter.mapZoom + "%"});
        canvas.css({"left": Encounter.mapLeftDisplace});
        canvas.css({"top": Encounter.mapTopDisplace});

        if (Encounter.updateHasRun) {
            Encounter.updateHasRun = false;
            var encounterState = Encounter.encounterState;
            context.clearRect(0, 0, Encounter.encounterState.mapResX, Encounter.encounterState.mapResY);

            //for each player entry in the encounter JSON
            for (var i = 0; i < encounterState.players.length; i++) {
                //collect the current player
                var player = encounterState.players[i];

                if(!player.iconURL){
                    continue;
                }

                //identify the icon for the player
                var tokenImage = new Image();
                tokenImage.src = "api/image/encounterplayer/" + player._id;

                var isHost = Encounter.isHost();
                //draw the icon based off of current settings
                if (player.visible) {
                    context.globalAlpha = 1;
                    context.drawImage(
                        tokenImage,
                        player.mapX * tileSize,
                        player.mapY * tileSize
                    );
                }
                else {
                    if (isHost) {
                        context.globalAlpha = 0.35;
                        context.drawImage(
                            tokenImage,
                            player.mapX * tileSize,
                            player.mapY * tileSize
                        );
                    }
                    else {
                        context.globalAlpha = 0.0;
                        context.drawImage(
                            tokenImage,
                            player.mapX * tileSize,
                            player.mapY * tileSize
                        );
                    }
                }
            }
        }
        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function(){
        return Encounter.encounterState.mapResX;
    };

    $scope.getResY = function(){
        return Encounter.encounterState.mapResY;
    };

    init();
});