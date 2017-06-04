'use strict';

var mongoose = require('mongoose');
var EncounterPlayer = mongoose.model('EncounterPlayer');

var encounterPlayerRepository = {};

encounterPlayerRepository.create = function (name, userId, iconURL, armorClass, hitPoints, maxHitPoints, passivePerception, visible, saves, npc, callback)
{
    var encounterPlayer = new EncounterPlayer(
        {
            name: name,
            userId: userId,
            iconURL: iconURL,
            armorClass: armorClass,
            hitPoints: hitPoints,
            maxHitPoints: maxHitPoints,
            passivePerception: passivePerception,
            visible: visible,
            saves: saves,
            npc: npc
        });
    encounterPlayer.save(function (error)
    {
        handleError(error);
        callback(encounterPlayer);
    });
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = encounterPlayerRepository;