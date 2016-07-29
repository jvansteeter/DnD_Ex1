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
    saves: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number
    },
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

encounterPlayerSchema.methods.setPlayer = function(player)
{
    // this.name = player.name;
    // this.userID = player.userID;
    // this.initiative = player.initiative;
    // this.armorClass = player.armorClass;
    // this.hitPoints = player.hitPoints;
    // this.maxHitPoints = player.maxHitPoints;
    // this.passivePerception = player.passivePerception;
    // this.status = player.status;
    // this.visible = player.visible;
    for (var value in player)
    {
        this[value] = player[value];
    }
    this.save();
};

mongoose.model('EncounterPlayer', encounterPlayerSchema);