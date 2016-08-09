var clientApp = angular.module('clientApp');

clientApp.service('mapMain', function (mapRenderer, gridRenderer, tokenRenderer) {
    var mapMain = {};
    var gameState;

    // config variables
    var $mapTag = $('#mapDiv');
    var count = 0;

    mapMain.start = function(){

        // build the mapCanvas
        var $mapCanvas = $('#mapCanvas');
        mapRenderer.init($mapCanvas);

        // build the gridCanvas
        var $gridCanvas = $('#gridCanvas');
        gridRenderer.init($gridCanvas);

        var $tokenCanvas = $('#tokenCanvas');
        tokenRenderer.init($tokenCanvas, gameState);


        // run game
        function gameLoop() {
            mapRenderer.draw();
            tokenRenderer.draw();
            window.requestAnimationFrame(gameLoop);
        }
        gameLoop();
    };


    mapMain.setGameState = function(data)
    {
        console.log("---!!! In mapInit setGameState function !!!---");
        gameState = data;
    };
    

    return mapMain;
});

