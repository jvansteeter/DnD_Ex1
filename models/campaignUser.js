var mongoose = require('mongoose');

var campaignPostSchema = new mongoose.Schema(
{
    userID: String,
    campaignID: String
});

mongoose.model('CampaignUser', campaignPostSchema);