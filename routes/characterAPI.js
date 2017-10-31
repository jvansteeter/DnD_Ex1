var express = require('express');
var router = express.Router();

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