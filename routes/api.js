var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var passport = require('passport');

var SECRET = '\x1f\x1e1\x8a\x8djO\x9e\xe4\xcb\x9d`\x13\x02\xfb+\xbb\x89q"F\x8a\xe0a';
var auth = jwt({secret: SECRET, userProperty: 'payload'});

//
// API
//

// register a user
router.post('/auth/register', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/bad'
}));

// login a local user using passport
router.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
}));

// register a user
/*router.post('/users/register', function (req, res) 
{
	console.log("attempting to register a new user");
    
    if(!req.body.username || !req.body.password)
	{
		return res.status(400).json({ message: 'Please fill out all fields' });
	}

	// find or create the user with the given username
    User.findOrCreate({username: req.body.username}, function(err, user, created) 
    {
    	console.log("User not already in database");
        if (created) 
        {
        	console.log("User was created");
            // if this username is not taken, then create a user record
            user.username = req.body.username;
            user.setPassword(req.body.password);
            user.save(function(err) 
            {
				if (err) 
				{
					console.log("There was an error while saving the user");
				    res.sendStatus("403");
				    return;
				}
		        // create a token
				var token = User.generateToken(user.name);
		        // return value is JSON containing the user's name and token
		        res.json({name: user.name, token: token});
		    });
		} 
		else 
		{
		    // return an error if the username is taken
		    console.log("Username already exists");
		    res.sendStatus("403");
		}
    });
});*/

// login a user
router.post('/users/login', function(req, res, next)
{
	if(!req.body.username || !req.body.password)
	{
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info)
	{
    	if(err)
    	{ 
    		return next(err); 
    	}

    	if(user)
    	{
    		return res.json({token: User.generateToken(user.username)});
    	} 
    	else 
    	{
    		return res.status(401).json(info);
    	}
	})(req, res, next);
});

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
router.get('/api/items/:item_id', function (req,res) {
    // validate the supplied token
    user = User.verifyToken(req.headers.authorization, function(user) {
        if (user) {
            // if the token is valid, then find the requested item
            Item.findById(req.params.item_id, function(err, item) {
		if (err) {
		    res.sendStatus(403);
		    return;
		}
                // get the item if it belongs to the user, otherwise return an error
                if (item.user != user) {
                    res.sendStatus(403);
		    return;
                }
                // return value is the item as JSON
                res.json({item:item});
            });
        } else {
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

module.exports = router;
