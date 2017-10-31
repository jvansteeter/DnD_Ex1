'use strict';

var campaignUserRepository = require('../repositories/campaignUserRepository');
var campaignRepository = require('../repositories/campaignRepository');

var userService = {};

userService.getAllCampaigns = function (userId, callback)
{
	campaignUserRepository.readAllCampaigns(userId, function (error, campaignUsers)
	{
		var campaignIds = [];
		for (var i = 0; i < campaignUsers.length; i++)
		{
			campaignIds.push(campaignUsers[i].campaignId);
		}

		campaignRepository.readMany(campaignIds, function (error, campaigns)
		{
			callback(error, campaigns);
		})
	})
};

module.exports = userService;
