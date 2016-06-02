var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  res.redirect('/login.html');
});

function isLoggedIn(req, res, next)
{
    //console.log("isLoggedIn");
    //console.log("<User>: " + JSON.stringify(req.user));
    if (req.isAuthenticated())
        return next();

    //console.log("not logged in");
    res.sendStatus(401);
};

module.exports = router;
