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

//
// API
//

router.post('/encounter/create', function(req, res)
{
    User.findById(req.user._id, function(error, user)
    {
        if (error)
        {
            res.status(500).send("Error finding user");
            return;
        }

        var name = user.first_name + " " + user.last_name;
        Encounter.create(
            {
                title : req.body.title,
                campaignID: req.body.campaignID,
                description : req.body.description,
                hostID : req.user._id,
                hostName : name,
                active : false
            }, function(error, encounter)
            {
                if (error)
                {
                    res.status(500).send("Error creating encounter");
                    return;
                }

                res.send("OK");
            });
    });
});

router.get('/image/profile', function(req, res)
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


router.post('/image/profile', function(req, res)
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

router.get('/encounter/all', function(req, res)
{
    Encounter.find({ $or: [ { active : true }, { hostID : req.user._id } ] }, function(error, encounters)
    {
        if (error)
        {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(encounters);
    });
});

router.get('/campaign/all', function(req, res)
{
    Campaign.find({}, function(error, campaigns)
    {
        if (error)
        {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(campaigns);
    });
});

router.get('/campaign/encounter/:campaign_id', function(req, res)
{
    Encounter.find({ campaignID: req.params.campaign_id, $or: [ { active : true }, { hostID : req.user._id } ] }, function(error, encounters)
    {
        if (error)
        {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(encounters);
    });
});

router.get('/encounter/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        res.json(encounter);
    });
});

router.post('/encounter/addplayer/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }
        var encounterPlayer = new EncounterPlayer(
        {
            name : req.body.name,
            userID: req.body.userID,
            initiative : req.body.initiative,
            armorClass : req.body.armorClass,
            hitPoints : req.body.hitPoints,
            maxHitPoints : req.body.maxHitPoints,
            visible : true,
            npc : false
        });
        encounter.addPlayer(encounterPlayer._id);
        encounterPlayer.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving encounter player");
                return;
            }
            
            res.send("OK");
        });
    });
});

router.post('/encounter/addnpc/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }
        var encounterPlayer = new EncounterPlayer(
        {
            name : req.body.name,
            userID: req.body.userID,
            initiative : req.body.initiative,
            armorClass : req.body.armorClass,
            hitPoints : req.body.hitPoints,
            maxHitPoints : req.body.maxHitPoints,
            visible : false,
            npc : true
        });

        encounter.addPlayer(encounterPlayer._id);
        encounterPlayer.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving encounter player");
                return;
            }
            
            res.send("OK");
        });
    });
});

router.post('/encounter/addnpc2/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounterState)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        var npcID = req.body.npcID;
        NPC.findById(npcID, function(error, npc)
        {
            if (error)
            {
                res.status(500).send("Error finding NPC");
                return;
            }

            var encounterPlayer = new EncounterPlayer(
                {
                    name : npc.name,
                    userID: npc.userID,
                    armorClass : npc.armorClass,
                    hitPoints : npc.hitPoints,
                    maxHitPoints : npc.hitPoints,
                    passivePerception : npc.passivePerception,
                    visible : false,
                    saves : npc.getSaves(),
                    npc : true
                });

            //calculate and assign mapX, mapY to encounterPlayer
            console.log("begining calculation")
            console.log(encounterState);

            var tokenPlaced = false;
            while(!tokenPlaced){
                var y = 0;
                var x = 0;

                var spaceIsFree = true;
                for(var i = 0; i < encounterState.players.length; i++){
                    var player = encounterState.players[i];
                    if(player.mapX === x && player.mapY === y){
                        spaceIsFree = false;
                    }
                }

                if(spaceIsFree){
                    encounterPlayer.mapX = x;
                    encounterPlayer.mapY = y;
                    tokenPlaced = true;
                }
                else{
                    x++;
                }
            }

            encounterState.addPlayer(encounterPlayer._id);
            encounterPlayer.save(function(error)
            {
                if (error)
                {
                    res.status(500).send("Error saving encounter player");
                    return;
                }
                
                res.send("OK");
            });
        });
    });
});

router.post('/encounter/addcharacter/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        var characterID = req.body.characterID;
        Character.findById(characterID, function(error, character)
        {
            if (error)
            {
                res.status(500).send("Error finding character");
                return;
            }

            var encounterPlayer = new EncounterPlayer(
                {
                    name : character.name,
                    userID: character.userID,
                    armorClass : character.armorClass,
                    hitPoints : character.maxHitPoints,
                    maxHitPoints : character.maxHitPoints,
                    passivePerception : character.passivePerception,
                    visible : true,
                    saves : character.getSaves(),
                    npc : false
                });
            
            encounter.addPlayer(encounterPlayer._id);
            encounterPlayer.save(function(error)
            {
                if (error)
                {
                    res.status(500).send("Error saving encounter player");
                    return;
                }
                
                res.send("OK");
            });
        });
    });
});

router.post('/encounter/removeplayer/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        //res.json(encounterPlayer);
        encounter.removePlayer(req.body.playerID);
        EncounterPlayer.remove({_id: req.body.playerID }, function(error)
        {
            if (error)
            {
                res.status(500).send("Error removing encounter player");
                return;
            }
            res.send("OK");
        });
    });
});

router.get('/encounter/gamestate/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        EncounterPlayer.find({_id : {$in : encounter.players }}, function(error, players)
        {
            if (error)
            {
                res.status(500).send("Error finding encounter players");
                return;
            }

            encounter.players = players;
            res.json(encounter);
        });
    });
});

router.post('/encounter/hitplayer', function(req, res)
{
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter player");
            return;
        }

        player.hitPoints += req.body.hit;
        if (!player.npc && player.hitPoints < -9)
        {
            player.status = "DEAD";
        }
        else if (player.npc && player.hitPoints < 1)
        {
            player.status = "DEAD"
        }

        player.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving encounter player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/setinitiative', function(req, res)
{
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter player");
            return;
        }

        player.initiative = req.body.initiative;
        player.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/togglevisible', function(req, res)
{
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        player.toggleVisible();
        player.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/setactive/:encounter_id', function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.status(500).send("Error finding encounter");
            return;
        }

        encounter.setActive(req.body.active);
        encounter.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving encounter");
                return;
            }
            
            res.send("OK");
        });
    });
});

router.get('/class/all', function (req, res)
{
    var classes = [
        'Barbarian',
        'Bard',
        'Cleric',
        'Druid',
        'Fighter',
        'Monk',
        'Paladin',
        'Ranger',
        'Rogue',
        'Sorcerer',
        'Warlock',
        'Wizard'
    ];
    res.json({classes: classes});
});

router.post('/character/create', function(req, res)
{
    var character = new Character();
    character.setCharacter(req.body.character);
    character.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving new character");
            return;
        }

        res.send("OK");
    });
    // Character.create(
    // {
    //     userID: req.user._id,
    //     name: req.body.character.name,
    //     class: req.body.character.class,
    //     level: req.body.character.level,
    //     background: req.body.character.background,
    //     playerName: req.body.character.playerName,
    //     race: req.body.character.race,
    //     alignment: req.body.character.alignment,
    //     exp: req.body.character.exp,
    //     proficiencyBonus: req.body.character.proficiencyBonus,
    //     strength: req.body.character.strength,
    //     dexterity: req.body.character.dexterity,
    //     constitution: req.body.character.constitution,
    //     intelligence: req.body.character.intelligence,
    //     wisdom: req.body.character.wisdom,
    //     charisma: req.body.character.charisma,
    //     armorClass: req.body.character.armorClass,
    //     initiative: req.body.character.initiative,
    //     speed: req.body.character.speed,
    //     hitPoints: req.body.character.maxHitPoints,
    //     maxHitPoints: req.body.character.maxHitPoints,
    //     features: req.body.character.features,
    //     proficiencies: req.body.character.proficiencies,
    //     languages: req.body.character.languages,
    //     personality: req.body.character.personality,
    //     ideals: req.body.character.ideals,
    //     bonds: req.body.character.bonds,
    //     flaws: req.body.character.flaws,
    //     attacks: req.body.character.attacks,
    //     money: req.body.character.money,
    //     equipment: req.body.character.equipment
    // }, function(error, character)
    // {
    //     if (error)
    //     {
    //         res.status(500).send("Error creating character");
    //         return;
    //     }
    //
    //     character.generateCharacter();
    //     character.save(function(error)
    //     {
    //         if (error)
    //         {
    //             res.status(500).send("Error saving character");
    //         }
    //
    //         res.send("OK");
    //     });
    // });
});

router.post('/character/update', function(req, res)
{
    Character.findById(req.body.character._id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        character.setCharacter(req.body.character);
        character.generateCharacter();
        character.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving character");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/npc/create', function(req, res)
{
    var npc = new NPC();
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
    // NPC.create(
    //     {
    //         userID: req.user._id,
    //         name: req.body.npc.name,
    //         descriptors: req.body.npc.descriptors,
    //         description: req.body.npc.description,
    //         strength: req.body.npc.strength,
    //         dexterity: req.body.npc.dexterity,
    //         constitution: req.body.npc.constitution,
    //         intelligence: req.body.npc.intelligence,
    //         wisdom: req.body.npc.wisdom,
    //         charisma: req.body.npc.charisma,
    //         armorClass: req.body.npc.armorClass,
    //         hitPoints: req.body.npc.hitPoints,
    //         speed: req.body.npc.speed,
    //         features: req.body.npc.features,
    //         specials: req.body.npc.specials,
    //         money: req.body.npc.money,
    //         equipment: req.body.npc.equipment,
    //         attacks: req.body.npc.attacks,
    //         actions: req.body.npc.actions
    //     }, function(error, npc)
    //     {
    //         if (error)
    //         {
    //             res.status(500).send("Error creating NPC");
    //             return;
    //         }
    //
    //         npc.generateNPC();
    //         npc.save(function(error)
    //         {
    //             if (error)
    //             {
    //                 res.status(500).send("Error saving NPC");
    //                 return;
    //             }
    //
    //             res.send("OK");
    //         });
    //     });
});

router.post('/npc/update', function(req, res)
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

router.get('/character/all/:user_id', function(req, res)
{
    Character.find({userID: req.params.user_id}, function(error, characters)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        var list = [];
        for (var i = 0; i < characters.length; i++)
        {
            var character =
            {
                _id: characters[i]._id,
                name: characters[i].name,
                class: characters[i].class,
                level: characters[i].level
            };
            list.push(character);
        }
        
        res.json({characters: list});
    });
});

router.get('/npc/all/', function(req, res)
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

router.get('/character/:character_id', function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }
        
        res.json({character: character});
    });
});

router.get('/npc/:npc_id', function(req, res)
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

router.get('/character/delete/:character_id', function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error finding character");
            return;
        }

        character.remove(function(error)
        {
            if (error)
            {
                res.status(500).send("Error removing character");
                return;
            }

            res.send("OK");
        });
    });
});

router.get('/npc/delete/:npc_id', function(req, res)
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

router.post('/encounter/updatenpc', function(req, res)
{
   EncounterPlayer.findById(req.body.npc._id, function(error, player)
   {
       if (error)
       {
           res.status(500).send("Error finding encounter player");
           return;
       }
       
       player.setPlayer(req.body.npc);
       player.save(function(error)
       {
           if (error)
           {
               res.status(500).send("Error while saving update to npc");
               return;
           }

           res.send("OK");
       });
   }) ;
});

router.get('/user', function(req, res)
{
    res.json(req.user);
});

router.get('/user/campaigns', function(req, res)
{
    CampaignUser.find({userID: req.user._id}, function(error, campaignUsers)
    {
        if (error)
        {
            res.status(500).send("Error finding campaign user relations");
            return;
        }

        var campaignIDs = [];
        for (var i = 0; i < campaignUsers.length; i++)
        {
            campaignIDs.push(campaignUsers[i].campaignID);
        }

        Campaign.find({_id: {$in: campaignIDs}}, function(error, campaigns)
        {
            if (error)
            {
                res.status(500).send("Error finding campaigns");
                return;
            }

            res.send(campaigns);
        });
    });
});

router.get('/campaign/:campaign_id', function(req, res)
{
    Campaign.findById(req.params.campaign_id, function(error, campaign)
    {
        if (error)
        {
            res.status(500).send("Error finding campaign");
            return;
        }

        res.json(campaign);
    });
});

router.post('/campaign/create', function(req, res)
{
    var campaign = new Campaign();
    campaign.addHost(req.user._id);
    campaign.title = req.body.title;
    campaign.description = req.body.description;
    campaign.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving campaign");
            return;
        }

        var campaignUser = new CampaignUser();
        campaignUser.userID = req.user._id;
        campaignUser.campaignID = campaign._id;

        campaignUser.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving campaign user relation");
                return;
            }

            res.send("OK");
        });
    })
});

router.post('/campaign/join/', function(req, res)
{
    CampaignUser.findOrCreate(
    {
        userID: req.user._id,
        campaignID: req.body.campaignID
    }, function(error, campaignUser)
    {
        if (error)
        {
            res.status(500).send("Error finding or creating campaign user relation");
            return;
        }

        campaignUser.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving campaign user relation");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('campaign/post', function(req, res)
{
    var post = new CampaignPost();
    post.userID = req.user._id;
    post.author = req.user.first_name + " " + req.user.last_name;
    post.authorPhoto = req.user.profilePhotoURL;
    post.content = req.body.content;
    post.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving post");
            return;
        }

        res.send("OK");
    })
});

function getGameState(encounter)
{
    EncounterPlayer.find({_id : {$in : encounter.players }}, function(error, players)
    {
        if (error)
        {
            return;
        }

        encounter.players = players;

        return encounter;
    });
}

module.exports = router;
