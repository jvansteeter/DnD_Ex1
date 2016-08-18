var mongoose = require('mongoose');

var encounterSchema = new mongoose.Schema(
{
    title: String,
    campaignID: String,
    description: String,
    hostID: String,
    hostName: String,
    players: [],
    createdAt: {type: Number, required: true, default: Date.now},
    initialized: {type: Boolean, default: false},
    mapURL: String,
    active: Boolean,
    mapImageURI: String,
    mapTileSize: Number,
    mapResX: Number,
    mapResY: Number,
    mapDimX: Number,
    mapDimY: Number
});

encounterSchema.methods.addPlayer = function(player)
{
    this.players.push(player);
    this.save();
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