var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  	if (req.session.user == null)
    {
// if user is not logged-in redirect back to login page //
        console.log('User not logged in');
        res.redirect('/login.html');
    }   
});

module.exports = router;
