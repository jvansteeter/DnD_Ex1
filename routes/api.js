var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var jwt = require('express-jwt');
var passport = require('passport');

//var SECRET = '\x1f\x1e1\x8a\x8djO\x9e\xe4\xcb\x9d`\x13\x02\xfb+\xbb\x89q"F\x8a\xe0a';
//var auth = jwt({secret: SECRET, userProperty: 'payload'});

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
    Character.create({ user_id: req.user._id }, function(error, character)
    {
        if (error)
        {
            res.sendStatus(403);
            return;
        }

        //character.createNewCharacter(req.user._id, req.body.character);
    });
    res.send(req.body.character);
});

/*
// get all items for the user
router.get('/api/items', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) 
    {
        if (user) 
        {
            // if the token is valid, find all the user's items and return them
		    Item.find({user:user.id}, function(err, items) 
		    {
				if (err) 
				{
				    res.sendStatus(403);
				    return;
				}
				// return value is the list of items as JSON
				res.json({items: items});
		    });
        } 
        else 
        {
            res.sendStatus(403);
        }
    });
});

// add an item
router.post('/api/items', function (req,res) {
    // validate the supplied token
    // get indexes
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, create the item for the user
	    Item.create({title:req.body.item.title,completed:false,user:user.id}, function(err,item) {
		if (err) {
		    res.sendStatus(403);
		    return;
		}
		res.json({item:item});
	    });
        } else {
            res.sendStatus(403);
        }
    });
});

// get an item
router.get('/api/items/:item_id', function (req,res) 
{
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) 
    {
        if (user) 
        {
            // if the token is valid, then find the requested item
            Item.findById(req.params.item_id, function(err, item) 
            {
            	if (err) 
                {
            	    res.sendStatus(403);
            	    return;
            	}
                // get the item if it belongs to the user, otherwise return an error
                if (item.user != user) 
                {
                    res.sendStatus(403);
            	    return;
                }
                // return value is the item as JSON
                res.json({item:item});
            });
        } 
        else 
        {
            res.sendStatus(403);
        }
    });
});

// update an item
router.put('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findById(req.params.item_id, function(err,item) {
		if (err) {
		    res.sendStatus(403);
		    return;
		}
                // update the item if it belongs to the user, otherwise return an error
                if (item.user != user.id) {
                    res.sendStatus(403);
		    return;
                }
                item.title = req.body.item.title;
                item.completed = req.body.item.completed;
                item.save(function(err) {
		    if (err) {
			res.sendStatus(403);
			return;
		    }
                    // return value is the item as JSON
                    res.json({item:item});
                });
	    });
        } else {
            res.sendStatus(403);
        }
    });
});

// delete an item
router.delete('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findByIdAndRemove(req.params.item_id, function(err,item) {
		if (err) {
		    res.sendStatus(403);
		    return;
		}
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(403);
        }
    });
});

*/

function isLoggedIn(req, res, next) 
{
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}

module.exports = router;
