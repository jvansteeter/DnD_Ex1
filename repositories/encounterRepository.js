'use strict';

var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

var encounterRepository = {};

encounterRepository.read = function (encounterId, callback)
{
    Encounter.findById(encounterId, function(error, encounter)
    {
        handleError(error, callback);
        if (encounter === null)
        {
            callback(new Error('Encounter with id: ' + encounterId + ' not found.'));
        }
        callback(error, encounter);
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
            handleError(error, callback);
            callback(error, encounter);
        }
    )
};

encounterRepository.update = function (encounter, callback)
{
    encounter.save(function (error)
    {
        handleError(error, callback);
        callback(error);
    })
};

function handleError(error, callback)
{
    if (error)
    {
		callback(error);
	}
}

module.exports = encounterRepository;