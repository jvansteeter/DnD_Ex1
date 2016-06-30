var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var passport = require('passport');

//
// API
//

router.post('/encounter/create', isLoggedIn, function(req, res)
{
    var name = req.user.first_name + " " + req.user.last_name;
    Encounter.create(
    {
        title : req.body.title,
        description : req.body.description,
        host : req.user.username,
        hostName : name,
        active : true
    }, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }
        
        res.send("OK");
    });
});

router.get('/encounter/all', isLoggedIn, function(req, res)
{
    Encounter.find({ active : true }, function(error, encounters)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        res.json({ encounters : encounters });
    });
});

router.get('/encounter/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        res.json({ encounter : encounter });
    });
});

router.post('/encounter/addplayer/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }
        var encounterPlayer = new EncounterPlayer(
        {
            name : req.body.name,
            userID: req.user._id,
            initiative : req.body.initiative,
            armorClass : req.body.armorClass,
            hitPoints : req.body.hitPoints,
            maxHitPoints : req.body.maxHitPoints,
            visible : true,
            npc : false
        });
        //res.json(encounterPlayer);
        encounter.addPlayer(encounterPlayer._id);
        encounterPlayer.save(function(error)
        {
            if (error)
            {
                res.sendStatus(403);
                return;
            }
            res.send("OK");
        });
    });
});

router.post('/encounter/addnpc/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }
        var encounterPlayer = new EncounterPlayer(
        {
            name : req.body.name,
            userID: req.user._id,
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
                res.sendStatus(403);
                return;
            }
            res.send("OK");
        });
    });
});

router.post('/encounter/addcharacter/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        var characterID = req.body.characterID;
        Character.findById(characterID, function(error, character)
        {
            if (error)
            {
                res.sendStatus(403);
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
                    npc : false
                });
            
            encounter.addPlayer(encounterPlayer._id);
            encounterPlayer.save(function(error)
            {
                if (error)
                {
                    res.sendStatus(403);
                    return;
                }
                res.send("OK");
            });
        });
    });
});

router.post('/encounter/removeplayer/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        //res.json(encounterPlayer);
        encounter.removePlayer(req.body.playerID);
        EncounterPlayer.remove({_id: req.body.playerID }, function(error)
        {
            if (error)
            {
                res.sendStatus(403);
                return;
            }
            res.send("OK");
        });
    });
});

router.get('/encounter/players/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        EncounterPlayer.find({_id : {$in : encounter.players }}, function(error, players)
        {
            if (error)
            {
                res.sendStatus(403);
                return;
            }

            res.json(players);
        });
    });
});

router.post('/encounter/hitplayer', isLoggedIn, function(req, res)
{
    console.log("---!!! Attempting to hit a player !!!---");
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            console.log("Error finding the player");
            res.sendStatus(403);
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
                res.sendStatus(403);
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/setinitiative', isLoggedIn, function(req, res)
{
    console.log("---!!! Attempting to set the initiative of a player !!!---");
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            console.log("Error finding the player");
            res.sendStatus(403);
            return;
        }

        console.log("found player " + player._id + " " + player.name + " " + req.body.hit);

        player.initiative = req.body.initiative;
        player.save(function(error)
        {
            if (error)
            {
                console.log("Error saving the player");
                res.sendStatus(403);
                return;
            }

            res.send("OK");
        });
    });
});

router.post('/encounter/togglevisible', isLoggedIn, function(req, res)
{
    console.log("---!!! Attempting to toggle visibility !!!---");
    EncounterPlayer.findById(req.body.playerID, function(error, player)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        player.toggleVisible();
        res.send("OK");
    });
});

router.get('/encounter/end/:encounter_id', isLoggedIn, function(req, res)
{
    Encounter.findById(req.params.encounter_id, function(error, encounter)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        encounter.setActive(false);
        res.send("OK");
    });
});

router.get('/class/all', isLoggedIn, function (req, res)
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

router.post('/character/create', isLoggedIn, function(req, res)
{
    Character.create(
    {
        userID: req.user._id,
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
            res.sendStatus(403);
            return;
        }

        character.generateCharacter();
        res.send("OK");
    });
});

router.post('/character/update', isLoggedIn, function(req, res)
{
    console.log(req.body.character._id);
    Character.findById(req.body.character._id, function(error, character)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        character.userID = req.user._id;
        character.name = req.body.character.name;
        character.class = req.body.character.class;
        character.level = req.body.character.level;
        character.background = req.body.character.background;
        character.playerName = req.body.character.playerName;
        character.race = req.body.character.race;
        character.alignment = req.body.character.alignment;
        character.exp = req.body.character.exp;
        character.proficiencyBonus = req.body.character.proficiencyBonus;
        character.strength = req.body.character.strength;
        character.dexterity = req.body.character.dexterity;
        character.constitution = req.body.character.constitution;
        character.intelligence = req.body.character.intelligence;
        character.wisdom = req.body.character.wisdom;
        character.charisma = req.body.character.charisma;
        character.armorClass = req.body.character.armorClass;
        character.initiative = req.body.character.initiative;
        character.speed = req.body.character.speed;
        character.hitPoints = req.body.character.maxHitPoints;
        character.maxHitPoints = req.body.character.maxHitPoints;
        character.features = req.body.character.features;
        character.proficiencies = req.body.character.proficiencies;
        character.languages = req.body.character.languages;
        character.personality = req.body.character.personality;
        character.ideals = req.body.character.ideals;
        character.bonds = req.body.character.bonds;
        character.flaws = req.body.character.flaws;
        character.attacks = req.body.character.attacks;
        character.money = req.body.character.money;
        character.equipment = req.body.character.equipment;

        character.generateCharacter();
        res.send("OK");
    });
});

router.get('/character/all/:user_id', isLoggedIn, function(req, res)
{
    Character.find({userID: req.params.user_id}, function(error, characters)
    {
        if (error)
        {
            res.sendStatus(403);
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

router.get('/character/:character_id', isLoggedIn, function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }
        
        res.json({character: character});
    });
});

router.get('/character/delete/:character_id', isLoggedIn, function(req, res)
{
    Character.findById(req.params.character_id, function(error, character)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        if (character.userID != req.user._id)
        {
            res.sendStatus(401);
            return;
        }

        character.remove();
        res.send("OK");
    });
});

function isLoggedIn(req, res, next) 
{
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}

module.exports = router;
