var clientApp = angular.module('clientApp');

clientApp.service('mapInit', function()
{
    var map = {};
    var players;

    map.setPlayers = function(data)
    {
        players = data;
    };

    map.demonstrateTwoWayBinding = function()
    {
        for (var i = 0; i < players.length; i++)
        {
            players[i].name = "Changes reflect automatically";
        }
    };

    return map;
});