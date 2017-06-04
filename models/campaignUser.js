var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var campaignPostSchema = new mongoose.Schema(
{
    userId: String,
    campaignId: String
});

campaignPostSchema.plugin(findOrCreate);

mongoose.model('CampaignUser', campaignPostSchema);