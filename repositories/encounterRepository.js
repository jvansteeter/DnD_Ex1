'use strict';

var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

var encounterRepository = {};

encounterRepository.read = function (encounterId, callback)
{
    Encounter.findById(encounterId, function(error, encounter)
    {
		if (error)
		{
			callback(error);
			return;
		}

        if (encounter === null)
        {
            callback(new Error('Encounter with id: ' + encounterId + ' not found.'));
            return;
        }

        callback(error, encounter);
    });
};

encounterRepository.readAll = function (campaignId, userId, callback)
{
	Encounter.find({ campaignId: campaignId, $or: [ { active : true }, { hostId : userId } ] }, function(error, encounters)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, encounters);
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
			if (error)
			{
				callback(error);
				return;
			}

            callback(error, encounter);
        }
    )
};

encounterRepository.update = function (encounter, callback)
{
    encounter.save(function (error)
    {
		if (error)
		{
			callback(error);
			return;
		}

        callback(error);
    })
};

module.exports = encounterRepository;