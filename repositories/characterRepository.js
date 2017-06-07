'use strict';

var mongoose = require('mongoose');
var Character = mongoose.model('Character');

var characterRepository = {};

characterRepository.read = function (characterId, callback)
{
    Character.findById(characterId, function(error, character)
    {
        handleError(error, callback);
        if (character === null)
        {
            callback(new Error('Character with id: ' + characterId + ' not found.'));
        }
        callback(error, character);
    });
};

function handleError(error, callback)
{
    if (error)
    {
        callback(error);
    }
}

module.exports = characterRepository;