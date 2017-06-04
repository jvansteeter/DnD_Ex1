var mongoose = require('mongoose');

var encounterSchema = new mongoose.Schema(
{
    title: String,
    campaignId: String,
    description: String,
    hostId: String,
    hostName: String,
    players: [],
    createdAt: {type: Number, required: true, default: Date.now},
    initialized: {type: Boolean, default: false},
    hasMap: Boolean,
    mapURL: String,
    active: Boolean,
    connectedUsers: [
        {
            userId: String,
            username: String
        }
    ],

    mapTileSize: Number,
    mapResX: Number,
    mapResY: Number,
    mapDimX: Number,
    mapDimY: Number
});

encounterSchema.methods.addPlayer = function(player, callback)
{
    this.players.push(player);
    this.save(function()
    {
        callback();
    });
};

encounterSchema.methods.removePlayer = function(player)
{
	this.players.splice(this.players.indexOf(player), 1);
	this.save();
};

encounterSchema.methods.setActive = function(active)
{
    this.active = active;
};

mongoose.model('Encounter', encounterSchema);