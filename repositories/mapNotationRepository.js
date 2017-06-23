'use strict';

var mongoose = require('mongoose');
var MapNotation = mongoose.model('MapNotation');

var mapNotationRepository = {};

mapNotationRepository.create = function (userId, callback)
{
	var mapNotation = new MapNotation({
		userId: userId
	});
	mapNotation.save(function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, mapNotation);
	})
};

mapNotationRepository.read = function (mapNotationId, callback)
{
	MapNotation.findById(mapNotationId, function(error, mapNotation)
	{
		if (error)
		{
			callback(error);
			return;
		}

		if (mapNotation === null)
		{
			callback(new Error('MapNotation with id: ' + mapNotationId + ' not found.'));
			return;
		}

		callback(error, mapNotation);
	});
};

mapNotationRepository.readAll = function (mapNotationIds, callback)
{
	MapNotation.find({_id: {$in: mapNotationIds}}, function (error, mapNotations)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error, mapNotations);
	})
};

mapNotationRepository.update = function (mapNotationObject, callback)
{
	mapNotationObject.save(function (error)
	{
		if (error)
		{
			callback(new Error('Error saving map notation ' + error.message));
			return;
		}

		callback(error);
	})
};

mapNotationRepository.delete = function (mapNotationId, callback)
{
	MapNotation.remove({_id: mapNotationId}, function (error)
	{
		if (error)
		{
			callback(error);
			return;
		}

		callback(error);
	})
};

module.exports = mapNotationRepository;