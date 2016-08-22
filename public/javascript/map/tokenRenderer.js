var clientApp = angular.module('clientApp');

clientApp.controller('tokenRenderer', function ($window, Encounter) {

    var canvas;
    var context;
    var width;
    var height;
    var tileSize;

    function init() {
        canvas = $('#tokenCanvas');
        context = canvas.get(0).getContext('2d');
        width = canvas.width();
        height = canvas.height();
        tileSize = 50;

        draw();
    }

    function draw() {
        canvas.css({"zoom": Encounter.mapZoom + "%"});
        canvas.css({"left": Encounter.mapLeftDisplace});
        canvas.css({"top": Encounter.mapTopDisplace});

        if (Encounter.updateHasRun) {
            var encounterState = Encounter.encounterState;
            context.clearRect(0, 0, width, height);

            //for each player entry in the encounter JSON
            for (var i = 0; i < encounterState.players.length; i++) {
                //collect the current player
                var player = encounterState.players[i];
                console.log(player._id);

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

    init();
});