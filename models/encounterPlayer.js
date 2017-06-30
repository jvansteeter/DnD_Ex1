var mongoose = require('mongoose');

var encounterPlayerSchema = new mongoose.Schema(
{
    name: String,
    userId: String,
    iconURL: String,
    initiative: Number,
    armorClass: Number,
    hitPoints: Number,
    maxHitPoints: Number,
    passivePerception: Number,
    speed: Number,
    actions: [],
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
    npc: Boolean,
    mapX: Number,
    mapY: Number
});

encounterPlayerSchema.methods.damage = function(damage)
{
	this.hitPoints = this.hitPoints - damage;
};

encounterPlayerSchema.methods.toggleVisible = function()
{
	this.visible = !this.visible;
};

encounterPlayerSchema.methods.setPlayer = function(player)
{
    // for (var value in player)
    // {
    //     if (value !== 'actions')
    //     {
    //         this[value] = player[value];
    //     }
    // }
    // this.actions = [];
    // for (var i = 0; i < player.actions.length; i++)
    // {
    //     this.actions.push(player.actions[i]);
    // }

    this.name = player.name;
    this.iconURL = player.iconURL;
    this.initiative = player.initiative;
    this.armorClass = player.armorClass;
    this.hitPoints = player.hitPoints;
    this.maxHitPoints = player.maxHitPoints;
    this.passivePerception = player.passivePerception;
    this.speed = player.speed;
    this.status = player.status;
    this.visible = player.visible;
    this.saves = player.saves;
    this.mapX = player.mapX;
    this.mapY = player.mapY;
    this.actions = [];
    for (var i = 0; i < player.actions.length; i++)
    {
        this.actions.push(player.actions[i]);
    }
};

mongoose.model('EncounterPlayer', encounterPlayerSchema);