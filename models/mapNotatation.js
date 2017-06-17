var mongoose = require('mongoose');

var mapNotation = new mongoose.Schema(
    {
        userId: String,
        isPublic: { type: Boolean, default: true},
        canHide: { type: Boolean, default: true},
        text: { type: String, default: 'New Notation' },
        color: {type: String, default: 'hsla(240, 100%, 50%, 1)' },
        cells: [{
            x: Number,
            y: Number
        }]
    });

mapNotation.methods.setMapNotation = function(mapNotationObject)
{
    for (var value in mapNotationObject)
    {
        this[value] = mapNotationObject[value];
    }
};

mongoose.model('MapNotation', mapNotation);