var clientApp = angular.module('clientApp');

clientApp.service('mapInit', function()
{
    var map = {};
    var players;

    map.setPlayers = function(data)
    {
        console.log("In mapInit, setting players");
        players = data;
        console.log(players);
    };

    map.demonstrateTwoWayBinding = function()
    {
        console.log("In mapInit::demo2wayBinding");
        for (var i = 0; i < players.length; i++)
        {
            players[i].name = "Changes reflect automatically";
        }
        console.log(players);
    };

    return map;
});