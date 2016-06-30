var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var encounterPlayerSchema = new mongoose.Schema(
{
    name: String,
    userID: String,
    initiative: Number,
    armorClass: Number,
    hitPoints: Number,
    maxHitPoints: Number,
    passivePerception: Number,
    status: String,
    visible: Boolean,
    npc: Boolean
});

encounterPlayerSchema.methods.hit = function(hit)
{
	this.hitPoints = this.hitPoints + hit;
};

encounterPlayerSchema.methods.toggleVisible = function()
{
	this.visible = !this.visible;
	this.save();
};

mongoose.model('EncounterPlayer', encounterPlayerSchema);