'use strict';

var campaignRepository = require('../repositories/campaignRepository');
var campaignUserRepository = require('../repositories/campaignUserRepository');
var campaignPostRepository = require('../repositories/campaignPostRepository');
var encounterRepository = require('../repositories/encounterRepository');
var userRepository = require('../repositories/userRepository');

var campaignService = {};

campaignService.createNewCampaign = function (title, description, hostId, callback)
{
	campaignRepository.create(title, description, hostId, function(error, campaign)
	{
		if (error)
		{
			callback(error);
			return;
		}

		campaignUserRepository.create(hostId, campaign._id, function (error)
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

campaignService.getAllEncounters = function(campaignId, userId, callback)
{
	encounterRepository.readAll(campaignId, userId, function (error, encounters)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, encounters);
	})
};

campaignService.getAll = function (callback)
{
	campaignRepository.readAll(function (error, campaigns)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, campaigns);
	})
};

campaignService.getById = function (campaignId, callback)
{
	campaignRepository.read(campaignId, function (error, campaign)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, campaign);
	})
};

campaignService.getAdventurers = function (campaignId, callback)
{
	campaignUserRepository.readAll(campaignId, function (error, campaignUsers)
	{
		if (error)
		{
			callback(error);
			return;
		}

		var userIds = [];
		campaignUsers.forEach(function (campaignUser)
		{
			userIds.push(campaignUser.userId);
		});

		var adventurers = [];
		userRepository.readAll(userIds, function (error, users)
		{
			if (error)
			{
				callback(error);
				return;
			}

			users.forEach(function(user)
			{
				adventurers.push(user.first_name + ' ' + user.last_name);
			});

			callback(error, adventurers);
		})
	})
};

campaignService.getPosts = function (campaignId, callback)
{
	campaignPostRepository.readAll(campaignId, function (error, posts)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, posts);
	})
};

campaignService.join = function (userId, campaignId, callback)
{
	campaignUserRepository.create(userId, campaignId, function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback();
	})
};

campaignService.addPost = function (userId, author, authorPhoto, campaignId, content, tags, attachments, callback)
{
	campaignPostRepository.create(campaignId, userId, author, authorPhoto, content, tags, attachments, function(error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback();
	})
};

module.exports = campaignService;