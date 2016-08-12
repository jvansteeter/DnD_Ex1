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
        this.tokenImage = new Image();
        this.tokenImage.src = "image/map/playerOne.png";

        for(i = 0; i < encounterState.players.length; i++){
            this.tokenImage = new Image();
            if(!encounterState.players[i].npc){
                this.tokenImage.src = "image/map/playerOne.png";
            }
            else {
                this.tokenImage.src = "image/map/playerThree.png";
            }

            context.drawImage(
                this.tokenImage,
                i * tileSize,
                1 * tileSize
            );
        }
    };


    return tokenRenderer;
});