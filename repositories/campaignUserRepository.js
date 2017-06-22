'use strict';

var mongoose = require('mongoose');
var CampaignUser = mongoose.model('CampaignUser');

var campaignUserRepository = {};

campaignUserRepository.create = function (userId, campaignId, callback)
{
	CampaignUser.findOrCreate(
		{
			userId: userId,
			campaignId: campaignId
		}, function (error, campaignUser)
		{
			if (error)
			{
				callback(error);
				return;
			}

			callback(error, campaignUser);
		}
	)
};

campaignUserRepository.readAll = function (campaignId, callback)
{
	CampaignUser.find({campaignId : campaignId}, function(error, campaignUsers)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (campaignUsers === null)
		{
			callback(new Error('Error finding all campaignUsers'));
			return;
		}

		callback(error, campaignUsers);
	});
};

campaignUserRepository.update = function (campaignUser, callback)
{
	campaignUser.save(function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error);
	})
};

module.exports = campaignUserRepository;