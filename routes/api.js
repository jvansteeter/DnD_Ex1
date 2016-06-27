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
            user: req.user.username,
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
            user: req.user.username,
            initiative : req.body.initiative,
            armorClass : req.body.armorClass,
            hitPoints : req.body.hitPoints,
            maxHitPoints : req.body.maxHitPoints,
            visible : false,
            npc : true
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
        player_name: req.body.character.player_name,
        race: req.body.character.race,
        alignment: req.body.character.alignment,
        exp: req.body.character.exp,
        proficiency_bonus: req.body.character.proficiency_bonus,
        strength: req.body.character.strength,
        dexterity: req.body.character.dexterity,
        constitution: req.body.character.constitution,
        intelligence: req.body.character.intelligence,
        wisdom: req.body.character.wisdom,
        charisma: req.body.character.charisma,
        armor_class: req.body.character.armor_class,
        speed: req.body.character.speed,
        hitPoints: req.body.character.max_hitPoints,
        max_hitPoints: req.body.character.max_hitPoints,
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

        character.createNewCharacter();
        res.send("OK");
    });
});

router.get('/character/all', isLoggedIn, function(req, res)
{
    var userID = req.user._id;

    Character.find({userID: userID}, function(error, characters)
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

function isLoggedIn(req, res, next) 
{
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}

module.exports = router;
