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
var campaignService = require('../services/campaignService');

//
//  Campaign API
//  /api/campaign
//

router.get('/encounter/:campaign_id', function(req, res, reportError)
{
    campaignService.getAllEncounters(req.params.campaign_id, req.user._id, function (error, encounters)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json(encounters);
    })
});

router.get('/all', function(req, res, reportError)
{
    campaignService.getAll(function (error, campaigns)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json(campaigns);
	})
});

router.get('/:campaign_id', function(req, res, reportError)
{
    campaignService.getById(req.params.campaign_id, function (error, campaign)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json(campaign);
    })
});

router.get('/adventurers/:campaign_id', function(req, res, reportError)
{
    campaignService.getAdventurers(req.params.campaign_id, function (error, adventurers)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json(adventurers);
    });
});

router.get('/posts/:campaign_id', function(req, res, reportError)
{
    campaignService.getPosts(req.params.campaign_id, function (error, campaignPosts)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.json(campaignPosts);
    })
});

router.post('/create', function(req, res, reportError)
{
    campaignService.createNewCampaign(req.body.title, req.body.description, req.user._id, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send("OK");
    })
});

router.post('/join', function(req, res, reportError)
{
    campaignService.join(req.user._id, req.body.campaignId, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send("OK");
	})
});

router.post('/post', function(req, res, reportError)
{
    var author = req.user.first_name + ' ' + req.user.last_name;
    campaignService.addPost(req.user._id, author, req.user.profilePhotoURL, req.body.campaignId, req.body.content, null, null, function (error)
    {
        if (error)
        {
            reportError(error);
            return;
        }

        res.send("OK");
    });
});

module.exports = router;