var express = require('express');
var router = express.Router();

var imageService = require('../services/imageService');
var encounterService = require('../services/encounterService');
var characterService = require('../services/characterService');
var npcService = require('../services/npcService');
var encounterPlayerRepository = require('../repositories/encounterPlayerRepository');

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
	characterService.get(req.params.character_id, function (error, character)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		imageService.get(character.iconURL, function (imageFile)
		{
			res.sendFile(imageFile);
		})
	})
});

router.get('/npc/:npc_id', function(req, res, reportError)
{
	npcService.get(req.params.npc_id, function (error, npc)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		imageService.get(npc.iconURL, function (imageFile)
		{
			res.sendFile(imageFile);
		})
	})
});

router.get('/encounterplayer/:player_id', function(req, res, reportError)
{
	encounterPlayerRepository.read(req.params.player_id, function (error, player)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		imageService.get(player.iconURL, function (imageFile)
		{
			res.sendFile(imageFile);
		})
	})
});

router.get('/noimage', function(req, res)
{
	imageService.get('image/common/noImage.png', function (imageFile)
	{
		res.sendFile(imageFile);
	})
});

module.exports = router;