'use strict';

var mongoose = require('mongoose');
var CampaignPost = mongoose.model('CampaignPost');

var campaignPostRepository = {};

campaignPostRepository.create = function (campaignId, userId, author, authorPhoto, content, tags, attachements, callback)
{
	CampaignPost.create(
		{
			campaignId: campaignId,
			userId: userId,
			author: author,
			authorPhoto: authorPhoto,
			content: content,
			tags: tags,
			attachments: attachements
		}, function (error, campaignPost)
		{
			if (error)
			{
				callback(error);
				return;
			}

			callback(error, campaignPost);
		}
	)
};

campaignPostRepository.readAll = function (campaignId, callback)
{
	CampaignPost.find({campaignId : campaignId}, function(error, campaignPosts)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (campaignPosts === null)
		{
			callback(new Error('Error finding all campaignPosts'));
			return;
		}

		callback(error, campaignPosts);
	});
};

campaignPostRepository.update = function (campaignUser, callback)
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

module.exports = campaignPostRepository;