var clientApp = angular.module('clientApp');

clientApp.service('mapMain', function (mapRenderer, gridRenderer, tokenRenderer) {
    var mapMain = {};
    var isHost = false;

    mapMain.start = function(isHostParam){

        // build the mapCanvas
        var $mapCanvas = $('#mapCanvas');
        mapRenderer.init($mapCanvas);

        // build the gridCanvas
        var $gridCanvas = $('#gridCanvas');
        gridRenderer.init($gridCanvas);

        var $tokenCanvas = $('#tokenCanvas');
        tokenRenderer.init($tokenCanvas, isHostParam);


        // run game
        function gameLoop() {
            mapRenderer.draw();
            gridRenderer.draw();
            tokenRenderer.draw();
            window.requestAnimationFrame(gameLoop);
        }
        gameLoop();
    };


    mapMain.setGameState = function(data)
    {
        tokenRenderer.updateEncounterState(data);
    };
    

    return mapMain;
});

