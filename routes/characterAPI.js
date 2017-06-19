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

router.post('/update', function(req, res, reportError)
{
    characterService.update(req.body.character._id, req.body.character, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send('OK');
    })
});

router.get('/all/:user_id', function(req, res, reportError)
{
    characterService.getAllList(req.params.user_id, function (error, characterList)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json({characters: characterList});
	})
});

router.get('/:character_id', function(req, res, reportError)
{
    characterService.get(req.params.character_id, function (error, character)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json({character: character});
    })
});

router.get('/delete/:character_id', function(req, res, reportError)
{
    characterService.delete(req.params.character_id, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send('OK');
    })
});

module.exports = router;