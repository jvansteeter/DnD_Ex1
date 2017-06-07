var mongoose = require('mongoose');

var mapNotation = new mongoose.Schema(
{
	userId: String,
	text: { type: String, default: 'New Notation' },
	color: {type: String, default: 'hsla(240, 100%, 50%, 1)' },
	cells: [{
		x: Number,
		y: Number
	}]
});

mapNotation.methods.setMapNotation = function(mapNotation)
{
	for (var value in mapNotation)
	{
		this[value] = mapNotation[value];
	}
};

mongoose.model('MapNotation', mapNotation);