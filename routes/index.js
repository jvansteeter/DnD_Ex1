var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/encounter', function(req, res)
{
    res.sendfile('public/encounter.html');
});

router.get('/', function(req, res) 
{
  	if (req.path === '/')
  	{
  		res.redirect('/login.html');
  	}
  	else if (req.session.user == null)
    {
        console.log('---!!! User not logged in !!!---');
        console.log('Path: ' + req.path);
        res.sendStatus(401);
    }
    else
    {
    	res.redirect('/home.html');
    }   
});

router.get('/encounter', function(req, res)
{
    res.sendfile('../public/encounter.html');
});

module.exports = router;
