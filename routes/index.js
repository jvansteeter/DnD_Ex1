var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/login', function(req, res)
{
    res.sendFile('public/login.html');
});

router.get('/home', function(req, res)
{
    res.sendFile('public/home.html');
});

router.get('/encounter', function(req, res)
{
    res.sendFile('public/encounter.html');
});

router.get('/', function(req, res) 
{
  	if (req.path === '/')
  	{
  		res.redirect('/login');
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

module.exports = router;
