var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  	res.redirect('/login');
});

router.get('/login', function(req, res) 
{
	res.redirect('/login.html');
});

router.get('/bad', function(req, res)
{
	res.redirect('/login.html');
});

module.exports = router;
