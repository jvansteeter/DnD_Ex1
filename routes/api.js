var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs-extra');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var NPC = mongoose.model('NPC');
var formidable = require('formidable');
var path = require('path');

//
// API
//

router.post('/encounter/create', function(req, res)
{
    User.findById(req.body.userID, function(error, user)
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
                description : req.body.description,
                hostID : req.body.userID,
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
    console.log("---!!! Trying to get no image !!!---");
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
    console.log("---!!! Trying to save profile image !!!---");
    console.log(JSON.stringify(req.body));
    console.log(JSON.stringify(req.files));

    var directory = "image/users/" + req.user._id + "/";
    var fileName = "profile" + path.extname(req.files.file.file);

    console.log("check if dir exists");
    fs.ensureDirSync(directory);

    fs.copy(req.files.file.file, directory + fileName, function(error)
    {
        if (error)
        {
            res.status(500).send("Error copying file");
            return;
        }

        console.log("successfully written to file");
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

                res.send("OK");
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

        res.json({ encounters : encounters });
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

        res.json({ encounter : encounter });
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
    Encounter.findById(req.params.encounter_id, function(error, encounter)
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

router.get('/encounter/players/:encounter_id', function(req, res)
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

            res.json(players);
        });
    });
});

router.post('/encounter/hitplayer', function(req, res)
{
    console.log("---!!! Attempting to hit a player !!!---");
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            console.log("Error finding the player");
            res.status(500).send("Error finding encounter player");
            return;
        }

        console.log("found player " + player._id + " " + player.name + " " + req.body.hit);

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
                console.log("Error saving the player");
                res.status(500).send("Error saving encounter player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/setinitiative', function(req, res)
{
    console.log("---!!! Attempting to set the initiative of a player !!!---");
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            console.log("Error finding the player");
            res.status(500).send("Error finding encounter player");
            return;
        }

        console.log("found player " + player._id + " " + player.name + " " + req.body.hit);

        player.initiative = req.body.initiative;
        player.save(function(error)
        {
            if (error)
            {
                console.log("Error saving the player");
                res.status(500).send("Error saving player");
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/togglevisible', function(req, res)
{
    console.log("---!!! Attempting to toggle visibility !!!---");
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
    Character.create(
    {
        userID: req.body.userID,
        name: req.body.character.name,
        class: req.body.character.class,
        level: req.body.character.level,
        background: req.body.character.background,
        playerName: req.body.character.playerName,
        race: req.body.character.race,
        alignment: req.body.character.alignment,
        exp: req.body.character.exp,
        proficiencyBonus: req.body.character.proficiencyBonus,
        strength: req.body.character.strength,
        dexterity: req.body.character.dexterity,
        constitution: req.body.character.constitution,
        intelligence: req.body.character.intelligence,
        wisdom: req.body.character.wisdom,
        charisma: req.body.character.charisma,
        armorClass: req.body.character.armorClass,
        initiative: req.body.character.initiative,
        speed: req.body.character.speed,
        hitPoints: req.body.character.maxHitPoints,
        maxHitPoints: req.body.character.maxHitPoints,
        features: req.body.character.features,
        proficiencies: req.body.character.proficiencies,
        languages: req.body.character.languages,
        personality: req.body.character.personality,
        ideals: req.body.character.ideals,
        bonds: req.body.character.bonds,
        flaws: req.body.character.flaws,
        attacks: req.body.character.attacks,
        money: req.body.character.money,
        equipment: req.body.character.equipment
    }, function(error, character)
    {
        if (error)
        {
            res.status(500).send("Error creating character");
            return;
        }

        character.generateCharacter();
        character.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving character");
            }

            res.send("OK");
        });
    });
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
    NPC.create(
        {
            userID: req.body.userID,
            name: req.body.npc.name,
            descriptors: req.body.npc.descriptors,
            description: req.body.npc.description,
            strength: req.body.npc.strength,
            dexterity: req.body.npc.dexterity,
            constitution: req.body.npc.constitution,
            intelligence: req.body.npc.intelligence,
            wisdom: req.body.npc.wisdom,
            charisma: req.body.npc.charisma,
            armorClass: req.body.npc.armorClass,
            hitPoints: req.body.npc.hitPoints,
            speed: req.body.npc.speed,
            features: req.body.npc.features,
            specials: req.body.npc.specials,
            money: req.body.npc.money,
            equipment: req.body.npc.equipment,
            attacks: req.body.npc.attacks,
            actions: req.body.npc.actions
        }, function(error, npc)
        {
            if (error)
            {
                res.status(500).send("Error creating NPC");
                return;
            }

            npc.generateNPC();
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

router.post('/npc/update', function(req, res)
{
    console.log(req.body.npc._id);
    NPC.findById(req.body.npc._id, function(error, npc)
    {
        if (error)
        {
            res.status(500).send("Error finding NPC");
            return;
        }

        // npc.name = req.body.npc.name;
        // npc.descriptors = req.body.npc.descriptors;
        // npc.description = req.body.npc.description;
        // npc.strength = req.body.npc.strength;
        // npc.dexterity = req.body.npc.dexterity;
        // npc.constitution = req.body.npc.constitution;
        // npc.intelligence = req.body.npc.intelligence;
        // npc.wisdom = req.body.npc.wisdom;
        // npc.charisma = req.body.npc.charisma;
        // npc.armorClass = req.body.npc.armorClass;
        // npc.speed = req.body.npc.speed;
        // npc.hitPoints = req.body.npc.hitPoints;
        // npc.features = req.body.npc.features;
        // npc.specials = req.body.npc.specials;
        // npc.money = req.body.npc.money;
        // npc.equipment = req.body.npc.equipment;
        // npc.attacks = req.body.npc.attacks;
        // npc.actions = req.body.npc.actions;
        //
        // npc.generateNPC();
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

// function isLoggedIn(req, res, next) 
// {
//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();
//     // if they aren't redirect them to the home page
//     res.sendStatus(401);
// }

module.exports = router;
