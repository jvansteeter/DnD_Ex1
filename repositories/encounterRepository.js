'use strict';

var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

var encounterRepository = {};

encounterRepository.read = function (encounterId, callback)
{
    Encounter.findById(encounterId, function(error, encounter)
    {
        handleError(error);
        if (encounter === null)
        {
            throw new Error('Encounter with id: ' + encounterId + ' not found.');
        }
        callback(encounter);
    });
};

encounterRepository.createEncounter = function (title, campaignId, description, hostId, hostName, active, callback)
{
    Encounter.create(
        {
            title: title,
            campaignId: campaignId,
            description: description,
            hostId: hostId,
            hostName: hostName,
            active: active
        }, function (error, encounter)
        {
            handleError(error);
            callback(encounter);
        }
    )
};

encounterRepository.update = function (encounter, callback)
{
    encounter.save(function (error)
    {
        handleError(error);
        callback();
    })
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = encounterRepository;