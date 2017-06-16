var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs-extra');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var Campaign = mongoose.model('Campaign');
var CampaignPost = mongoose.model('CampaignPost');
var CampaignUser = mongoose.model('CampaignUser');
var NPC = mongoose.model('NPC');
var path = require('path');

var characterService = require('../services/characterService');

//
//  Character API
//  api/character
//

router.post('/create', function(req, res, reportError)
{
    characterService.createNewCharacter(req.user._id, req.body.character, function (error, character)
    {
        if (error)
        {
			reportError(error);
			return;
		}

		res.send(character);
	})
});

router.post('/icon/:character_id', function(req, res, reportError)
{
	characterService.uploadCharacterIcon(req.params.character_id, req.files.file.file, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send('OK');
	});
});

router.post('/update', function(req, res)
{
    Character.findById(req.body.character._id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        character.setCharacter(req.body.character);
        character.generateCharacter();
        character.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving character");
                return;
            }

            res.send("OK");
        });
    });
});

router.get('/all/:user_id', function(req, res)
{
    Character.find({userId: req.params.user_id}, function(error, characters)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        var list = [];
        for (var i = 0; i < characters.length; i++)
        {
            var character =
            {
                _id: characters[i]._id,
                name: characters[i].name,
                class: characters[i].class,
                level: characters[i].level
            };
            list.push(character);
        }

        res.json({characters: list});
    });
});

router.get('/:character_id', function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        res.json({character: character});
    });
});

router.get('/delete/:character_id', function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        character.remove(function(error)
        {
            if (error)
            {
                res.status(500).send("Error removing character");
                return;
            }

            res.send("OK");
        });
    });
});

module.exports = router;