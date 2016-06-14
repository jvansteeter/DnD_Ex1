var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterPlayerSchema = new mongoose.Schema(
{
    name: String,
    initiative: Number,
    armorClass: Number,
    hitPoints: Number,
    maxHitPoints: Number,
    npc: Boolean
});

encounterPlayerSchema.methods.hit = function(hit)
{
	this.hitPoints = this.hitPoints + hit;
};

mongoose.model('EncounterPlayer', encounterPlayerSchema);