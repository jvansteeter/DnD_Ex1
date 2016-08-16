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

//
//  NPC API
//

router.post('/create', function(req, res)
{
    var npc = new NPC();
    npc.userID = req.user._id;
    npc.setNPC(req.body.npc);
    npc.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving new NPC");
            return;
        }

        res.send("OK");
    });
});

router.post('/update', function(req, res)
{
    NPC.findById(req.body.npc._id, function(error, npc)
    {
        if (error)
        {
            res.status(500).send("Error finding NPC");
            return;
        }

        npc.setNPC(req.body.npc);
        npc.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving NPC");
                return;
            }

            res.send("OK");
        });
    });
});

router.get('/all/', function(req, res)
{
    NPC.find({userID: req.user._id}, function(error, npcs)
    {
        if (error)
        {
            res.status(500).send("Error finding NPC");
            return;
        }

        var list = [];
        for (var i = 0; i < npcs.length; i++)
        {
            var character =
            {
                _id: npcs[i]._id,
                name: npcs[i].name,
                descriptors: npcs[i].descriptors
            };
            list.push(character);
        }

        res.json({npcs: list});
    });
});

router.get('/:npc_id', function(req, res)
{
    NPC.findById(req.params.npc_id, function(error, npc)
    {
        if (error)
        {
            res.status(500).send("Error finding NPC");
            return;
        }

        res.json({npc: npc});
    });
});

router.get('/delete/:npc_id', function(req, res)
{
    NPC.findById(req.params.npc_id, function(error, npc)
    {
        if (error)
        {
            res.status(500).send("Error finding NPC");
            return;
        }

        npc.remove(function(error)
        {
            if (error)
            {
                res.status(500).send("Error deleting npc");
                return;
            }

            res.send("OK");
        });
    });
});

module.exports = router;