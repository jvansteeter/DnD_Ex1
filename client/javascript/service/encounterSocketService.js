'use strict';

var clientApp = angular.module('clientApp');

clientApp.service('EncounterSocketService', function (socket, EncounterService)
{
    socket.on('init', function ()
    {
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
        EncounterService.loadNotes();
    });

    socket.on('update:player', function (player)
    {
        EncounterService.setPlayer(player);
    });

    socket.on('add:player', function (player)
    {
        EncounterService.addPlayer(player)
    });

    socket.on('remove:player', function (player)
    {
        EncounterService.removePlayer(player);
    });

    socket.on('add:mapNotation', function (note)
    {
        EncounterService.addMapNotation(note);
    });

    socket.on('remove:mapNotation', function (note)
    {
        EncounterService.removeMapNotation(note);
    });

    this.emit = function (event, data)
    {
        socket.emit(event, data);
    }
});