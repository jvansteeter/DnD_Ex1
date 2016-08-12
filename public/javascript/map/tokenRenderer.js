var clientApp = angular.module('clientApp');

clientApp.service('tokenRenderer', function () {

    var tokenRenderer = {};
    var encounterState;
    var canvas;
    var context;
    var width;
    var height;
    var tileSize;

    tokenRenderer.init = function(canvasParam, encounterStateParam){

        canvas = canvasParam;

        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        encounterState = encounterStateParam;
        tileSize = 50;

    };

    tokenRenderer.draw = function(){
        context.clearRect(0, 0, width, height);

        for(var i = 0; i < encounterState.players.length; i++){
            var tokenImage = new Image();
            if(!encounterState.players[i].npc){
                tokenImage.src = "image/map/playerOne.png";
            }
            else {
                tokenImage.src = "image/map/playerThree.png";
            }

            context.drawImage(
                tokenImage,
                i * tileSize,
                1 * tileSize
            );
        }
    };


    return tokenRenderer;
});