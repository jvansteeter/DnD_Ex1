var clientApp = angular.module('clientApp');

clientApp.service('mapInit', function (mapRenderer, socket) {
    var mapInit = {};
    var players;

    // config variables
    var $mapTag = $('#mapDiv');
    var count = 0;

    mapInit.start = function(){

        // build the mapCanvas
        var $mapCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="mapCanvas" width="650" height="650" data-index="0"/>');
        $mapTag.append($mapCanvas);

        mapRenderer.init({
            $el:$mapCanvas
        });

        // run game
        function gameLoop() {
            socket.emit("draw");
            mapRenderer.draw();
            window.requestAnimationFrame(gameLoop);
        }
        gameLoop();
    };


    mapInit.setPlayers = function(data)
    {
        console.log("---!!! In mapInit setPlayers function !!!---");
        players = data;
        players[0].name = "Made one change so far";
    };
    
    mapInit.demostrateTwoWayBinding = function()
    {
        console.log("---!!! In mapInit demostrateTwoWayBinding !!!---");
        for (var i = 0; i < players.length; i++)
        {
            players[i].name = "Changes reflect Automatically";
        }
    };
    

    return mapInit;
});

