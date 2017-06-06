'use strict';

var mongoose = require('mongoose');
var Character = mongoose.model('Character');

var characterRepository = {};

characterRepository.read = function (characterId, callback)
{
    Character.findById(characterId, function(error, character)
    {
        handleError(error);
        if (character === null)
        {
            throw new Error('Character with id: ' + characterId + ' not found.');
        }
        callback(character);
    });
};

function handleError(error)
{
    if (error)
    {
        console.log(error);
        throw error;
    }
}

module.exports = characterRepository;