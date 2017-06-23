var mongoose = require('mongoose');

var mapNotation = new mongoose.Schema(
{
    userId: String,
    isPublic: { type: Boolean, default: false},
    canHide: { type: Boolean, default: true},
    text: { type: String, default: 'New Notation' },
    color: {type: String, default: 'rgba(255, 255, 255, 0.5)' },
    cells: []
});

mapNotation.methods.setMapNotation = function(mapNotationObject)
{
    this.isPublic = mapNotationObject.isPublic;
    this.canHide = mapNotationObject.canHide;
	this.text = mapNotationObject.text;
	this.color = mapNotationObject.color;
	this.cells = [];
	for (var i = 0; i < mapNotationObject.cells.length; i++)
    {
        this.cells.push(JSON.stringify(mapNotationObject.cells[i]));
    }
};

mongoose.model('MapNotation', mapNotation);