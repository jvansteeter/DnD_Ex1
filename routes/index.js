var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  	if (req.session.user == null && req.path !== "/login.html")
    {
// if user is not logged-in redirect back to login page //
        console.log('---!!! User not logged in !!!---');
        console.log('Path: ' + req.path);
        res.sendStatus(401);
    }
    else
    {
    	res.redirect('/login.html');
    }   
});

module.exports = router;
