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
var formidable = require('formidable');
var path = require('path');

var encounterService = require('../services/encounterService');

//
//  Encounter API
// /api/encounter
//

router.post('/create', function (req, res)
{
    try
    {
        encounterService.createEncounter(req.user._id, req.body.title, req.body.campaignId, req.body.description, false, function()
        {
            res.send("OK");
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.get('/:encounter_id', function (req, res)
{
    try
    {
        encounterService.getEncounterById(req.params.encounter_id, function(encounter)
        {
            res.json(encounter);
        })
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.post('/addnpc/:encounter_id', function (req, res)
{
    try
    {
        encounterService.addNPC(req.params.encounter_id, req.body.npcId, function()
        {
            res.send('OK');
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.post('/addcharacter/:encounter_id', function (req, res)
{
    try
    {
        encounterService.addCharacter(req.params.encounter_id, req.body.characterId, function()
        {
            res.send('OK');
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.post('/removeplayer/:encounter_id', function (req, res)
{
    try
    {
        encounterService.removePlayer(req.params.encounter_id, req.body.playerId, function()
        {
            res.send('OK');
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.get('/encounterstate/:encounter_id', function (req, res)
{
    try
    {
        encounterService.getEncounterState(req.params.encounter_id, function(encounterState)
        {
            res.json(encounterState);
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.post('/setinitiative', function (req, res)
{
    try
    {
        encounterService.setInitiative(req.body.playerId, req.body.initiative, function()
        {
            res.send("OK");
        });
    }
    catch (error)
    {
        error500(res, error);
    }
});

router.post('/setactive/:encounter_id', function (req, res)
{
    try
    {
        encounterService.setActive(req.params.encounter_id, req.body.active, function()
        {
            res.send("OK");
        });
    }
    catch (error)
    {
        error500(res, error);
    }
    // Encounter.findById(req.params.encounter_id, function (error, encounter)
    // {
    //     if (error)
    //     {
    //         res.status(500).send("Error finding encounter");
    //         return;
    //     }
    //
    //     encounter.setActive(req.body.active);
    //     encounter.save(function (error)
    //     {
    //         if (error)
    //         {
    //             res.status(500).send("Error saving encounter");
    //             return;
    //         }
    //
    //         res.send("OK");
    //     });
    // });
});

router.post('/updatemapdata/:encounter_id', function (req, res)
{
    Encounter.findById(req.params.encounter_id, function (error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        encounter.mapResX = req.body.mapResX;
        encounter.mapResY = req.body.mapResY;
        encounter.mapDimX = req.body.mapDimX;
        encounter.mapDimY = req.body.mapDimY;

        encounter.save(function (error)
        {
            if (error)
            {
                res.status(500).send("Error saving encounter");
                return;
            }
            res.send("OK");
        });
    })
});

router.post('/updateplayer', function (req, res)
{
    EncounterPlayer.findById(req.body.player._id, function (error, player)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter player");
            return;
        }

        if (typeof player !== "undefined" || player !== null)
        {
            player.setPlayer(req.body.player);
            player.save(function (error)
            {
                if (error)
                {
                    res.status(500).send("Error while saving update to npc");
                    return;
                }

                res.send("OK");
            });
        }
        else
        {
            res.status(400).send("OK");
        }
    });
});

router.get('/initwithoutmap/:encounter_id', function (req, res)
{
    Encounter.findById(req.params.encounter_id, function (error, encounter)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        encounter.initialized = true;
        encounter.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
                return;
            }

            res.send("OK");
        })
    });
});

router.post('/uploadmap/:encounter_id', function (req, res)
{
    var encounterID = req.params.encounter_id;
    var directory = "image/encounters/" + encounterID + "/";
    var fileName = "map" + path.extname(req.files.file.file);

    fs.ensureDirSync(directory);

    fs.copy(req.files.file.file, directory + fileName, function (error)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        Encounter.findById(encounterID, function (error, encounter)
        {
            if (error)
            {
                res.status(500).send(error);
                return;
            }

            encounter.initialized = true;
            encounter.mapURL = directory + fileName;
            encounter.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                }

                fs.unlink(req.files.file.file, function (error)
                {
                    if (error)
                    {
                        res.status(500).send(error);
                    }

                    res.send("OK");
                });
            });
        });
    });
});

router.post('/connect/:encounter_id', function (req, res)
{
    Encounter.findById(req.params.encounter_id, function (error, encounter)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        var id = req.body.id;
        var username = req.body.username;
        var unique = true;
        for (var i = 0; i < encounter.connectedUsers.length; i++)
        {
            if (encounter.connectedUsers[i].userId === id)
            {
                unique = false;
            }
        }

        if (unique)
        {
            encounter.connectedUsers.push({userId: id, username: username});
            encounter.save(function (error)
            {
                if (error)
                {
                    res.status(500).send(error);
                    return;
                }

                res.send("OK");
            });
        }
        else
        {
            res.send("OK");
        }
    });
});

router.post('/disconnect/:encounter_id', function (req, res)
{
    Encounter.findById(req.params.encounter_id, function (error, encounter)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        var id = req.body.id;
        for (var i = 0; i < encounter.connectedUsers.length; i++)
        {
            if (encounter.connectedUsers[i].userId === id)
            {
                encounter.connectedUsers.splice(i, 1);
            }
        }

        encounter.save(function (error)
        {
            if (error)
            {
                res.status(500).send(error);
                return;
            }

            res.send("OK");
        });
    });
});

function error500(res, error)
{
    res.status(500).send(error);
}

module.exports = router;