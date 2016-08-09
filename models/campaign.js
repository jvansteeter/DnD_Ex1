var mongoose = require('mongoose');

var campaignPostSchema = new mongoose.Schema(
{
    hosts: [],
    createdAt: {type: Number, required: true, default: Date.now}
});

campaignPostSchema.methods.addHost = function(host)
{
    this.hosts.push(host);
};

mongoose.model('Campaign', campaignPostSchema);