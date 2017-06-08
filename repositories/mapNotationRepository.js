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
		handleError(error);
		callback(error, mapNotation);
	})
};

mapNotationRepository.read = function (mapNotationId, callback)
{
	MapNotation.findById(mapNotationId, function(error, mapNotation)
	{
		handleError(error, callback);
		if (mapNotation === null)
		{
			callback(new Error('MapNotation with id: ' + mapNotationId + ' not found.'));
		}
		callback(error, mapNotation);
	});
};

mapNotationRepository.readAll = function (mapNotationIds, callback)
{
	MapNotation.find({_id: {$in: mapNotationIds}}, function (error, mapNotations)
	{
		handleError(error, callback);
		callback(error, mapNotations);
	})
};

mapNotationRepository.update = function (mapNotationObject, callback)
{
	mapNotationObject.save(function (error)
	{
		handleError(error, callback);
		callback(error);
	})
};

mapNotationRepository.delete = function (mapNotationId, callback)
{
	MapNotation.remove({_id: mapNotationId}, function (error)
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

module.exports = mapNotationRepository;