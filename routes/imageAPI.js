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
var imageService = require('../services/imageService');
var encounterService = require('../services/encounterService');
var characterService = require('../services/characterService');

//
// Image API
// /api/image
//

router.get('/profile', function(req, res, reportError)
{
    imageService.getProfilePhoto(req.user._id, function (error, imageFile)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.sendFile(imageFile);
    })
});


router.post('/profile', function(req, res, reportError)
{
    imageService.setProfilePhoto(req.user._id, req.files.file.file, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send('OK');
	})
});

router.get('/users/:user_id/:photo_name', function(req, res)
{
	imageService.get('image/users/' + req.params.user_id + '/' + req.params.photo_name, function (image)
	{
		res.sendFile(image);
	});
});

router.get('/encountermap/:encounter_id', function(req, res, reportError)
{
	encounterService.getEncounterById(req.params.encounter_id, function (error, encounter)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		imageService.get(encounter.mapURL, function (imageFile)
		{
			res.sendFile(imageFile);
		})
	})
});

router.get('/character/:character_id', function(req, res, reportError)
{
	// characterService.get(req.params.character_id, function (error, character)
	// {
	// 	if (error)
	// 	{
	// 		reportError(error);
	// 		return;
	// 	}
	//
	//
	// })
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        if (character.iconURL)
        {
            res.sendFile(path.resolve(character.iconURL));
        }
        else
        {
            res.sendFile(path.resolve("image/common/noImage.png"));
        }
    })
});

router.get('/npc/:npc_id', function(req, res)
{
    NPC.findById(req.params.npc_id, function(error, npc)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        if (npc.iconURL)
        {
            res.sendFile(path.resolve(npc.iconURL));
        }
        else
        {
            res.sendFile(path.resolve("image/common/noImage.png"));
        }
    })
});

router.get('/encounterplayer/:player_id', function(req, res)
{
    EncounterPlayer.findById(req.params.player_id, function(error, player)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        if (player.iconURL)
        {
            res.sendFile(path.resolve(player.iconURL));
        }
        else
        {
            res.send("");
        }
    })
});

router.get('/noimage', function(req, res)
{
    res.sendFile(path.resolve("image/common/noImage.png"));
});

module.exports = router;