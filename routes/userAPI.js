var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs-extra');
var User = mongoose.model('User');
var Encounter = mongoose.model('Encounter');
var EncounterPlayer = mongoose.model('EncounterPlayer');
var Character = mongoose.model('Character');
var Campaign = mongoose.model('Campaign');
var CampaignPost = mongoose.model('CampaignPost');
var CampaignUser = mongoose.model('CampaignUser');
var NPC = mongoose.model('NPC');
var path = require('path');

//
// User API
//

router.get('/', function(req, res)
{
    res.json(req.user);
});

router.get('/campaigns', function(req, res)
{
    CampaignUser.find({userID: req.user._id}, function(error, campaignUsers)
    {
        if (error)
        {
            res.status(500).send("Error finding campaign user relations");
            return;
        }

        var campaignIDs = [];
        for (var i = 0; i < campaignUsers.length; i++)
        {
            campaignIDs.push(campaignUsers[i].campaignID);
        }

        Campaign.find({_id: {$in: campaignIDs}}, function(error, campaigns)
        {
            if (error)
            {
                res.status(500).send("Error finding campaigns");
                return;
            }

            res.send(campaigns);
        });
    });
});

module.exports = router;