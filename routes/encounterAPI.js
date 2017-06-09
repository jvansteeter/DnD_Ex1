var express = require('express');
var router = express.Router();

var encounterService = require('../services/encounterService');

//
//  Encounter API
// /api/encounter
//

router.post('/create', function (req, res, reportError)
{
	encounterService.createEncounter(req.user._id, req.body.title, req.body.campaignId, req.body.description, false, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.get('/:encounter_id', function (req, res, reportError)
{
	encounterService.getEncounterById(req.params.encounter_id, function(error, encounter)
	{
        if (error)
        {
			reportError(error);
			return;
        }

		res.json(encounter);
	})
});

router.post('/addnpc/:encounter_id', function (req, res, reportError)
{
	encounterService.addNPC(req.params.encounter_id, req.body.npcId, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/addcharacter/:encounter_id', function (req, res, reportError)
{
	encounterService.addCharacter(req.params.encounter_id, req.body.characterId, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/removeplayer/:encounter_id', function (req, res, reportError)
{
	encounterService.removePlayer(req.params.encounter_id, req.body.playerId, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.get('/encounterstate/:encounter_id', function (req, res, reportError)
{
	encounterService.getEncounterState(req.params.encounter_id, function(error, encounterState)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.json(encounterState);
	});
});

router.post('/setinitiative', function (req, res, reportError)
{
	encounterService.setInitiative(req.body.playerId, req.body.initiative, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/setactive/:encounter_id', function (req, res, reportError)
{
	encounterService.setActive(req.params.encounter_id, req.body.active, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/updatemapdata/:encounter_id', function (req, res, reportError)
{
	encounterService.updateMapData(req.params.encounter_id, req.body.mapResX, req.body.mapResY, req.body.mapDimX, req.body.mapDimY, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	})
});

router.post('/updateplayer', function (req, res, reportError)
{
	encounterService.updatePlayer(req.body.player._id, req.body.player, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	})
});

router.get('/initwithoutmap/:encounter_id', function (req, res, reportError)
{
	encounterService.initWithoutMap(req.params.encounter_id, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	})
});

router.post('/uploadmap/:encounter_id', function (req, res, reportError)
{
	encounterService.uploadMap(req.params.encounter_id, req.files.file.file, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	})
});

/***************************************************************************************************************
 * MAP NOTATION ROUTES
 ***************************************************************************************************************
 */
router.get('/addmapnotation/:encounter_id', function (req, res, reportError)
{
	encounterService.addMapNotation(req.params.encounter_id, req.user._id, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/removemapnotation/:encounter_id', function (req, res, reportError)
{
	encounterService.removeMapNotation(req.params.encounter_id, req.body.mapNotationId, function(error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	});
});

router.post('/updatemapnotation', function (req, res, reportError)
{
	encounterService.updateMapNotation(req.body.mapNotation._id, req.body.mapNotation, function (error)
	{
		if (error)
		{
			reportError(error);
			return;
		}

		res.send("OK");
	})
});

module.exports = router;