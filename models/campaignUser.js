var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var campaignPostSchema = new mongoose.Schema(
{
    userID: String,
    campaignID: String
});

campaignPostSchema.plugin(findOrCreate);

mongoose.model('CampaignUser', campaignPostSchema);