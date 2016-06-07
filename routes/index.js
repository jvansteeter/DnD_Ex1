var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  	if (req.path === '/' || req.path === '/login.html')
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

module.exports = router;
