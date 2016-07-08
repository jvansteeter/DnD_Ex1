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

module.exports = router;
