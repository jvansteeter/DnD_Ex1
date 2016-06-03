var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  	res.redirect('/login');
});

router.get('/login', function(req, res) 
{
	var body = require('../public/login.html');
  	res.writeHead(200, 
  	{
  		'Content-Length': body.length,
  		'Content-Type': 'text/html' 
	});
	res.send(body);
});

router.get('/bad', function(req, res)
{
	res.redirect('/login.html');
});

module.exports = router;
