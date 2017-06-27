'use strict';

var clientApp = angular.module('clientApp');

clientApp.service('EncounterSocketService', function (socket, EncounterService)
{
    socket.on('init', function ()
    {
        console.log('socket connection initialized')
    });

    socket.on('update:encounter', function ()
    {
        EncounterService.update();
    });

    socket.on('update:mapNotation', function (mapNotation)
    {
        for (var i = 0; i < EncounterService.encounterState.mapNotations.length; i++)
        {
            if (mapNotation._id === EncounterService.encounterState.mapNotations[i]._id)
            {
                EncounterService.encounterState.mapNotations[i] = mapNotation;
            }
        }
    });

    socket.on('update:player', function (player)
    {
        player.isHovered = false;
        for (var i = 0; i < EncounterService.encounterState.players.length; i++)
        {
            if (EncounterService.encounterState.players[i]._id === player._id)
            {
                if (angular.isDefined(EncounterService.encounterState.players[i].isSelected) && EncounterService.encounterState.players[i].isSelected === true) {
                    player.isSelected = true;
                }
                else {
                    player.isSelected = false;
                }

                for (var value in player)
                {

                    EncounterService.encounterState.players[i][value] = player[value];
                }
            }
        }
    });

    this.emit = function (event, data)
    {
        socket.emit(event, data);
    }
});