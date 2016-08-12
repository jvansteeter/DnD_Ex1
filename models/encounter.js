var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterSchema = new mongoose.Schema(
{
    title: String,
    campaignID: String,
    description: String,
    hostID: String,
    hostName: String,
    players: [],
    createdAt: {type: Number, required: true, default: Date.now},
    active: Boolean
});

// hash the password
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