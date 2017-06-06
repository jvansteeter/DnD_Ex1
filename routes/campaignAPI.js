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
var formidable = require('formidable');
var path = require('path');

//
//  Campaign API
//  /api/campaign
//

router.get('/encounter/:campaign_id', function(req, res)
{
    Encounter.find({ campaignId: req.params.campaign_id, $or: [ { active : true }, { hostId : req.user._id } ] }, function(error, encounters)
    {
        if (error)
        {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(encounters);
    });
});

router.get('/all', function(req, res)
{
    Campaign.find({}, function(error, campaigns)
    {
        if (error)
        {
            res.status(500).send("Error finding encounters");
            return;
        }

        res.json(campaigns);
    });
});

router.get('/:campaign_id', function(req, res)
{
    Campaign.findById(req.params.campaign_id, function(error, campaign)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        res.json(campaign);
    });
});

router.get('/adventurers/:campaign_id', function(req, res)
{
    Campaign.findById(req.params.campaign_id, function(error, campaign)
    {
        if (error)
        {
            res.status(500).send("Error finding campaign");
            return;
        }

        CampaignUser.find({campaignId : campaign._id}, function(error, campaignUsers)
        {
            if (error)
            {
                res.status(500).send("Error finding campaign Users");
                return;
            }

            var adventurerIDs = [];
            for (var i = 0; i < campaignUsers.length; i++)
            {
                adventurerIDs.push(campaignUsers[i].userId);
            }

            User.find({_id : {$in : adventurerIDs }}, function(error, users)
            {
                if (error)
                {
                    res.status(500).send("Error finding users");
                    return;
                }

                var adventurerNames = [];
                for (var i = 0; i < users.length; i++)
                {
                    adventurerNames.push(users[i].first_name);
                }

                res.json(adventurerNames);
            });
        });
    });
});

router.get('/post/:campaign_id', function(req, res)
{
    CampaignPost.find({campaignId : req.params.campaign_id}, function(error, campaignPosts)
    {
        if (error)
        {
            res.status(500).send(error);
            return;
        }

        res.json(campaignPosts);
    });
});

router.post('/create', function(req, res)
{
    var campaign = new Campaign();
    campaign.addHost(req.user._id);
    campaign.title = req.body.title;
    campaign.description = req.body.description;
    campaign.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving campaign");
            return;
        }

        var campaignUser = new CampaignUser();
        campaignUser.userId = req.user._id;
        campaignUser.campaignId = campaign._id;

        campaignUser.save(function(error)
        {
            if (error)
            {
                res.status(500).send("Error saving campaign user relation");
                return;
            }

            res.send("OK");
        });
    })
});

router.post('/join/', function(req, res)
{
    CampaignUser.findOrCreate(
        {
            userId: req.user._id,
            campaignId: req.body.campaignId
        }, function(error, campaignUser)
        {
            if (error)
            {
                res.status(500).send("Error finding or creating campaign user relation");
                return;
            }

            campaignUser.save(function(error)
            {
                if (error)
                {
                    res.status(500).send("Error saving campaign user relation");
                    return;
                }

                res.send("OK");
            });
        });
});

router.post('/post', function(req, res)
{
    var post = new CampaignPost();
    post.userId = req.user._id;
    post.author = req.user.first_name + " " + req.user.last_name;
    post.authorPhoto = req.user.profilePhotoURL;
    post.campaignId = req.body.campaignId;
    post.content = req.body.content;
    post.save(function(error)
    {
        if (error)
        {
            res.status(500).send("Error saving post");
            return;
        }

        res.send("OK");
    })
});

module.exports = router;