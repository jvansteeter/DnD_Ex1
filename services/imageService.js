'use strict';

var path = require('path');
var fs = require('fs-extra');
var userRepository = require('../repositories/userRepository');

var imageService = {};

imageService.get = function (imageURL, callback)
{
	var absolutePath = path.resolve(imageURL);
	if (fs.existsSync(absolutePath))
	{
		callback(absolutePath);
		return;
	}

	callback(path.resolve('image/common/noImage.png'));
};

imageService.getProfilePhoto = function (userId, callback)
{
	userRepository.read(userId, function (error, user)
	{
		callback(error, path.resolve(user.profilePhotoURL));
	})
};

imageService.setProfilePhoto = function (userId, imageFile, callback)
{
	var directory = 'image/users/' + userId + '/';
	var fileName = 'profile' + path.extname(imageFile);

	fs.ensureDirSync(directory);
	fs.copy(imageFile, directory + fileName, function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		userRepository.read(userId, function (error, user)
		{
			if (error)
			{
				callback(error);
				return;
			}

			user.profilePhotoURL = directory + fileName;
			userRepository.update(user, function (error)
			{
				callback(error);
			})
		})
	})
};

module.exports = imageService;