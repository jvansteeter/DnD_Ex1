var clientApp = angular.module('clientApp');

clientApp.service('mapInit', function ($window) {
    var mapInit = {};
    var players;

    // config variables
    var $mapTag = $('#mapDiv');
    var count = 0;

    // ***** Startup Process

    // build the mapCanvas
    var $mapCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="mapCanvas" width="300" height="300" data-index="0"/>');
    $mapTag.append($mapCanvas);

    mapInit.run = function(){
        count++;
        console.log(count);
        // $window.requestAnimationFrame(this.run());
    };

    mapInit.setPlayers = function(data)
    {
        players = data;
    };
    
    mapInit.demostrateTwoWayBinding = function()
    {
        for (var i = 0; i < players.length; i++)
        {
            players[i].name = "Changes reflect Automatically";
        }
    };
    

    return mapInit;
});

