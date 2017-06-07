var express = require('express');
var router = express.Router();

var encounterService = require('../services/encounterService');

//
//  Encounter API
// /api/encounter
//

router.post('/create', function (req, res)
{
	encounterService.createEncounter(req.user._id, req.body.title, req.body.campaignId, req.body.description, false, function(error)
	{
		handleError(error, res);
		res.send("OK");
	});
});

router.get('/:encounter_id', function (req, res)
{
	encounterService.getEncounterById(req.params.encounter_id, function(error, encounter)
	{
		handleError(error, res);
		res.json(encounter);
	})
});

router.post('/addnpc/:encounter_id', function (req, res)
{
	encounterService.addNPC(req.params.encounter_id, req.body.npcId, function(error)
	{
		handleError(error, res);
		res.send('OK');
	});
});

router.post('/addcharacter/:encounter_id', function (req, res)
{
	encounterService.addCharacter(req.params.encounter_id, req.body.characterId, function(error)
	{
		handleError(error, res);
		res.send('OK');
	});
});

router.post('/removeplayer/:encounter_id', function (req, res)
{
	encounterService.removePlayer(req.params.encounter_id, req.body.playerId, function(error)
	{
		handleError(error, res);
		res.send('OK');
	});
});

router.get('/encounterstate/:encounter_id', function (req, res)
{
	encounterService.getEncounterState(req.params.encounter_id, function(error, encounterState)
	{
		handleError(error, res);
		res.json(encounterState);
	});
});

router.post('/setinitiative', function (req, res)
{
	encounterService.setInitiative(req.body.playerId, req.body.initiative, function(error)
	{
		handleError(error, res);
		res.send("OK");
	});
});

router.post('/setactive/:encounter_id', function (req, res)
{
	encounterService.setActive(req.params.encounter_id, req.body.active, function(error)
	{
		handleError(error, res);
		res.send("OK");
	});
});

router.post('/updatemapdata/:encounter_id', function (req, res)
{
	encounterService.updateMapData(req.params.encounter_id, req.body.mapResX, req.body.mapResY, req.body.mapDimX, req.body.mapDimY, function (error)
	{
		handleError(error, res);
		res.send("OK");
	})
});

router.post('/updateplayer', function (req, res)
{
	encounterService.updatePlayer(req.body.player._id, req.body.player, function (error)
	{
		handleError(error, res);
		res.send("OK");
	})
});

router.get('/initwithoutmap/:encounter_id', function (req, res)
{
	encounterService.initWithoutMap(req.params.encounter_id, function (error)
	{
		handleError(error, res);
		res.send("OK");
	})
});

router.post('/uploadmap/:encounter_id', function (req, res)
{
	encounterService.uploadMap(req.params.encounter_id, req.files.file.file, function (error) {
		handleError(error, res);
		res.send("OK");
	})
});

/***************************************************************************************************************
 * MAP NOTATION ROUTES
 ***************************************************************************************************************
 */
router.get('/addmapnotation/:encounter_id', function (req, res)
{
	encounterService.addMapNotation(req.params.encounter_id, req.user.user._id, function(error)
	{
		handleError(error, res);
		res.send('OK');
	});
});

router.post('/removemapnotation/:encounter_id', function (req, res)
{
	encounterService.removeMapNotation(req.params.encounter_id, req.body.mapNotationId, function(error)
	{
		handleError(error, res);
		res.send('OK');
	});
});

router.post('/updatemapnotation', function (req, res)
{
	encounterService.updateMapNotation(req.body.mapNotation._id, req.body.mapNotation, function (error)
	{
		handleError(error, res);
		res.send("OK");
	})
});

function handleError(error, res)
{
    if (error)
    {
    	console.error(error);
        res.status(500).send(error);
    }
}

module.exports = router;