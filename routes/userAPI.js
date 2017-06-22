var express = require('express');
var router = express.Router();

var userService = require('../services/userService');

//
// User API
//

router.get('/', function(req, res)
{
    res.json(req.user);
});

router.get('/campaigns', function(req, res, reportError)
{
    userService.getAllCampaigns(req.user._id, function (error, campaigns)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send(campaigns);
    })
});

module.exports = router;