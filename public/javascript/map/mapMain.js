var clientApp = angular.module('clientApp');

clientApp.service('mapMain', function (mapRenderer, gridRenderer, tokenRenderer) {
    var mapMain = {};
    var encounterState;

    mapMain.start = function(){

        // build the mapCanvas
        var $mapCanvas = $('#mapCanvas');
        mapRenderer.init($mapCanvas);

        // build the gridCanvas
        var $gridCanvas = $('#gridCanvas');
        gridRenderer.init($gridCanvas);

        var $tokenCanvas = $('#tokenCanvas');
        tokenRenderer.init($tokenCanvas, encounterState);


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
        console.log("---!!! In mapInit setGameState function !!!---");
        encounterState = data;
    };
    

    return mapMain;
});

