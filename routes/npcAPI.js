var express = require('express');
var router = express.Router();

var npcService = require('../services/npcService');

//
//  NPC API
//  api/npc
//

router.post('/create', function(req, res, reportError)
{
    npcService.createNewNPC(req.user._id, req.body.npc, function (error, npc)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send(npc);
    })
});

router.post('/update', function(req, res, reportError)
{
    npcService.update(req.body.npc._id, req.body.npc, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send('OK');
    })
});

router.get('/all/', function(req, res, reportError)
{
    npcService.getAllList(function (error, npcs)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json({npcs: npcs});
    })
});

router.get('/:npc_id', function(req, res, reportError)
{
    npcService.get(req.params.npc_id, function (error, npc)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json({npc: npc});
	})
});

router.get('/delete/:npc_id', function(req, res, reportError)
{
    npcService.delete(req.params.npc_id, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send('OK');
    })
});

router.post('/icon/:npc_id', function(req, res, reportError)
{
	npcService.uploadNPCIcon(req.params.npc_id, req.files.file.file, function(error)
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