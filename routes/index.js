var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) 
{
  	if (!req.isAuthenticated())
  	{
  		res.redirect('/login');
  	}
    else
    {
    	res.redirect('/profile');
    }   
});

router.get('/login', express.static('../views/login.html'));

router.get('/profile', isLoggedIn, express.static('../views/profile.html'));

function isLoggedIn(req, res, next)
{
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}

module.exports = router;
