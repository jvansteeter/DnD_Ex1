'use strict';

var mongoose = require('mongoose');
var MapNotation = mongoose.model('MapNotation');

var mapNotation = {};

mapNotation.create = function (userId, callback)
{
	var mapNotation = new MapNotation({
		userId: userId,
	});
	mapNotation.save(function (error)
	{
		handleError(error);
		callback(error, mapNotation);
	})
};

mapNotation.read = function (mapNotationId, callback)
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

mapNotation.update = function (mapNotation, callback)
{
	MapNotation.save(mapNotation, function (error)
	{
		callback(error);
	})
};

mapNotation.delete = function (mapNotationId, callback)
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

module.exports = mapNotation;