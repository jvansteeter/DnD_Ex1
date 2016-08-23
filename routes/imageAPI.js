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
// Image API
//

router.get('/profile', function(req, res)
{
    User.findById(req.user._id, function(error, user)
    {
        if (error)
        {
            res.status(500).send("Error finding user");
            return;
        }

        res.sendFile(path.resolve(user.profilePhotoURL));
    });
});


router.post('/profile', function(req, res)
{
    var directory = "image/users/" + req.user._id + "/";
    var fileName = "profile" + path.extname(req.files.file.file);

    fs.ensureDirSync(directory);

    fs.copy(req.files.file.file, directory + fileName, function(error)
    {
        if (error)
        {
            res.status(500).send("Error copying file");
            return;
        }

        User.findById(req.user._id, function(error, user)
        {
            if (error)
            {
                res.status(500).send("Error finding user");
                return;
            }

            user.profilePhotoURL = directory + fileName;
            user.save(function(error)
            {
                if (error)
                {
                    res.status(500).send("Error saving profile photo");
                }

                fs.unlink(req.files.file.file, function(error)
                {
                    if (error)
                    {
                        res.status(500).send("Error unlinking old file");
                    }

                    res.send("OK");
                });
            });
        });
    });
});

router.get('/users/:user_id/:photo_name', function(req, res)
{
    res.sendFile(path.resolve("image/users/" + req.params.user_id + "/" + req.params.photo_name));
});

router.get('/encountermap/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        if (encounter.mapURL)
        {
            res.sendFile(path.resolve(encounter.mapURL));
        }
        else
        {
            res.sendFile(path.resolve("public/image/map/dungeon.jpg"));
        }
    })
});

router.get('/character/:character_id', function(req, res)
{
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