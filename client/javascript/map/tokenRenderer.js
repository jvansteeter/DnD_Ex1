var clientApp = angular.module('clientApp');

clientApp.controller('tokenRenderer', function ($scope, $window, EncounterService) {

    var canvas;
    var context;
// minor change
    var tileSize;

    var url = 'api/image/encounterplayer/';
    var tokens = [];

    function init() {
        canvas = $('#tokenCanvas');
        context = canvas.get(0).getContext('2d');
        tileSize = 50;

		var encounterState = EncounterService.encounterState;
		for (var i = 0; i < encounterState.players.length; i++)
		{
			var token = new Image();
			token.src = url + encounterState.players[i]._id;

			tokens.push(token);
		}

		draw();
    }

    function draw() {
        clear_canvas();

        var x_offset = EncounterService.map_transform.x;
        var y_offset = EncounterService.map_transform.y;
        var scale = EncounterService.map_transform.scale;

        context.setTransform(scale, 0, 0, scale, x_offset, y_offset);

		var encounterState = EncounterService.encounterState;
		if (EncounterService.updateHasRun)
		{
			tokens = [];
			for (var i = 0; i < encounterState.players.length; i++)
			{
				var token = new Image();
				token.src = url + encounterState.players[i]._id;

				tokens.push(token);
			}
			EncounterService.setUpdateHasRunFlag(false);
		}

		//for each player entry in the encounter JSON
		for (i = 0; i < encounterState.players.length; i++) {
			//collect the current player
			var player = encounterState.players[i];

			if(!player.iconURL){
				continue;
			}

			//identify the icon for the player
			// var tokenImage = new Image();
			// tokenImage.src = 'api/image/encounterplayer/' + player._id;
			var tokenImage = tokens[i];

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
        }

        $window.requestAnimationFrame(draw);
    }

    // $scope.getResX = function(){
    //     return EncounterService.encounterState.mapResX;
    // };
    //
    // $scope.getResY = function(){
    //     return EncounterService.encounterState.mapResY;
    // };

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