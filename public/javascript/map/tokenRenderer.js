var clientApp = angular.module('clientApp');

clientApp.controller('tokenRenderer', function ($window, Encounter) {

    var tokenRenderer = {};
    var encounterState;
    var canvas;
    var context;
    var width;
    var height;
    var tileSize;
    var isHost = false;

    function init() {
        encounterState = Encounter.getEncounterState();
        canvas = $('#tokenCanvas');
        context = canvas.get(0).getContext('2d');
        width = canvas.width();
        height = canvas.height();
        tileSize = 50;
        isHost = Encounter.isHost();

        draw();
    }

    function draw() {
        context.clearRect(0, 0, width, height);

        console.log(encounterState);

        //for each player entry in the encounter JSON
        for (var i = 0; i < encounterState.players.length; i++) {
            //collect the current player
            var player = encounterState.players[i];

            //identify the icon for the player
            var tokenImage = new Image();
            if (!player.npc) {
                tokenImage.src = "image/map/playerOne.png";
            }
            else {
                tokenImage.src = "image/map/playerThree.png";
            }

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

    init();

    // tokenRenderer.init = function(canvasParam, isHostParam){
    //
    //     canvas = canvasParam;
    //
    //     width = canvas.width();
    //     height = canvas.height();
    //     context = canvas.get(0).getContext('2d');
    //     tileSize = 50;
    //     isHost = isHostParam;
    //
    //     encounterState = Encounter.getEncounterState();
    // };
    //
    // tokenRenderer.updateEncounterState = function(newEncounterState){
    //     encounterState = newEncounterState;
    // };
    //
    // tokenRenderer.draw = function(){
    //     context.clearRect(0, 0, width, height);
    //
    //     //for each player entry in the encounter JSON
    //     for(var i = 0; i < encounterState.players.length; i++){
    //         //collect the current player
    //         var player = encounterState.players[i];
    //
    //         //identify the icon for the player
    //         var tokenImage = new Image();
    //         if(!player.npc){
    //             tokenImage.src = "image/map/playerOne.png";
    //         }
    //         else {
    //             tokenImage.src = "image/map/playerThree.png";
    //         }
    //
    //         //draw the icon based off of current settings
    //         if(player.visible){
    //             context.globalAlpha = 1;
    //             context.drawImage(
    //                 tokenImage,
    //                 player.mapX * tileSize,
    //                 player.mapY * tileSize
    //             );
    //         }
    //         else{
    //             if(isHost){
    //                 context.globalAlpha = 0.35;
    //                 context.drawImage(
    //                     tokenImage,
    //                     player.mapX * tileSize,
    //                     player.mapY * tileSize
    //                 );
    //             }
    //             else{
    //                 context.globalAlpha = 0.0;
    //                 context.drawImage(
    //                     tokenImage,
    //                     player.mapX * tileSize,
    //                     player.mapY * tileSize
    //                 );
    //             }
    //
    //         }
    //     }
    // };
    //
    //
    // return tokenRenderer;
});