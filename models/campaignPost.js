var mongoose = require('mongoose');

var campaignPostSchema = new mongoose.Schema(
    {
        campaignID: String,
        userID: String,
        author: String,
        authorPhoto: String,
        content: String,
        tags: [],
        attachments: [],
        createdAt: {type: Number, required: true, default: Date.now}
    });

campaignPostSchema.methods.addAttachment = function(data)
{
    this.attachments.push(data);
};

mongoose.model('CampaignPost', campaignPostSchema);