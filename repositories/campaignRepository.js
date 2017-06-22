'use strict';

var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');

var campaignRepository = {};

campaignRepository.create = function (title, description, hostId, callback)
{
	Campaign.create(
		{
			title: title,
			description: description
		}, function (error, campaign)
		{
			if (error)
			{
				callback(error);
				return;
			}

			campaign.addHost(hostId);
			campaign.save(function (error, campaign)
			{
				callback(error, campaign);
			})
		}
	)
};

campaignRepository.read = function (campaignId, callback)
{
	Campaign.findById(campaignId, function(error, campaign)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (campaign === null)
		{
			callback(new Error('Encounter with id: ' + campaignId + ' not found.'));
			return;
		}

		callback(error, campaign);
	});
};

campaignRepository.readMany = function (campaignIds, callback)
{
	Campaign.find({_id: {$in: campaignIds}}, function (error, campaigns)
	{
		callback(error, campaigns);
	})
};

campaignRepository.readAll = function (callback)
{
	Campaign.find({}, function(error, campaigns)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (campaigns === null)
		{
			callback(new Error('Error finding all campaigns'));
			return;
		}

		callback(error, campaigns);
	});
};

campaignRepository.update = function (campaign, callback)
{
	campaign.save(function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error);
	})
};

campaignRepository.delete = function (campaignId, callback)
{
	Campaign.findById(campaignId, function (error, campaign)
	{
		if (error)
		{
			callback(error);
			return;
		}

		campaign.delete(function (error)
		{
			if (error)
			{
				callback(error);
				return;
			}

			callback();
		})
	})
};

module.exports = campaignRepository;