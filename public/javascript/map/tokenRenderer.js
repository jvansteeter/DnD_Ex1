var clientApp = angular.module('clientApp');

clientApp.controller('tokenRenderer', function ($scope, $window, EncounterService) {

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
        canvas.css({"zoom": EncounterService.mapZoom + "%"});
        canvas.css({"left": EncounterService.mapLeftDisplace});
        canvas.css({"top": EncounterService.mapTopDisplace});

        if (EncounterService.updateHasRun) {
            var encounterState = EncounterService.encounterState;
            context.clearRect(0, 0, EncounterService.encounterState.mapResX, EncounterService.encounterState.mapResY);

            //for each player entry in the encounter JSON
            for (var i = 0; i < encounterState.players.length; i++) {
                //collect the current player
                var player = encounterState.players[i];

                if(!player.iconURL){
                    continue;
                }

                EncounterService.getPlayerIconById(player._id).then(function(iconURI)
                {
					//identify the icon for the player
					var tokenImage = new Image();
					// tokenImage.onload = function()
					// {
                     //    context.drawImage(tokenImage,0,0);
                    // };
					tokenImage.src = iconURI;

					var isHost = EncounterService.isHost();
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
                });
            }
        }
        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function(){
        return EncounterService.encounterState.mapResX;
    };

    $scope.getResY = function(){
        return EncounterService.encounterState.mapResY;
    };

    init();
});