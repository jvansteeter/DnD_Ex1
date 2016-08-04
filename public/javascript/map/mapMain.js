var clientApp = angular.module('clientApp');

clientApp.service('mapMain', function (mapRenderer, gridRenderer, inputController) {
    var mapMain = {};
    var gameState;

    // config variables
    var $mapTag = $('#mapDiv');
    var count = 0;

    mapMain.start = function(){

        // build the mapCanvas
        var $mapCanvas = $('<canvas style="border:1px solid #c3c3c3; z-index:0; position:absolute;" id="mapCanvas" width="650" height="650"/>');
        mapRenderer.init($mapCanvas);
        $mapTag.append($mapCanvas);

        // build the gridCanvas
        var $gridCanvas = $('<canvas style="border:1px solid #c3c3c3; z-index:1; position:absolute;" id="gridCanvas" width="650" height="650"/>');
        gridRenderer.init($gridCanvas);
        $mapTag.append($gridCanvas);

        // build the inputController
        var $inputCanvas = $('<canvas style="border:1px solid #c3c3c3; z-index:1; position:absolute;" id="inputCanvas" width="650" height="650"/>');
        inputController.init($inputCanvas);
        $mapTag.append(inputController);

        // run game
        function gameLoop() {
            mapRenderer.draw();
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

