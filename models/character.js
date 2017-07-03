var mongoose = require('mongoose');

var characterSchema = new mongoose.Schema(
{
	userId: String,
    name: {type: String, default: ""},
	iconURL: String,
    class: String,
    level: String,
    background: String,
    playerName: String,
    race: String,
    alignment: String,
    exp: Number,
    proficiencyBonus: {type: Number, default: 0},
    strength: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false},
    	athletics: {type: Boolean, default: false}
    },
    dexterity: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false},
    	acrobatics: {type: Boolean, default: false},
    	sleightOfHand: {type: Boolean, default: false},
    	stealth: {type: Boolean, default: false}
    },
    constitution: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false}
    },
    intelligence: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false},
    	arcana: {type: Boolean, default: false},
    	history: {type: Boolean, default: false},
    	investigation: {type: Boolean, default: false},
    	nature: {type: Boolean, default: false},
    	religion: {type: Boolean, default: false}
    },
    wisdom: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false},
    	animalHandling: {type: Boolean, default: false},
    	insight: {type: Boolean, default: false},
    	medicine: {type: Boolean, default: false},
    	perception: {type: Boolean, default: false},
    	survival: {type: Boolean, default: false}
    },
    charisma: {
    	score: {type: Number, default: 1},
    	modifier: Number,
    	save: {type: Boolean, default: false},
    	intimidation: {type: Boolean, default: false},
    	persuasion: {type: Boolean, default: false},
    	performance: {type: Boolean, default: false},
    	deception: {type: Boolean, default: false}
    },
    passivePerception: Number,
    armorClass: Number,
	initiative: Number,
    speed: {type: Number, default: 0},
    hitPoints: Number,
    maxHitPoints: {type: Number, default: 1},
    tempHitPoints: Number,
    features: [],
	proficiencies: [],
	languages: [],
	personality: String,
	ideals: String,
	bonds: String,
	flaws: String,
	actions: [{
		name: String,
		range: {type: Number, default: 0},
		details: String
	}],
	money: {
		copper: Number,
		silver: Number,
		electrum: Number,
		gold: Number,
		platinum: Number
	},
	equipment: [{
		item: String,
		quantity: Number
	}],
    status: [],
    npc: {type: Boolean, default: false}
}, {strict: false});

characterSchema.methods.setCharacter = function(character)
{
	for (var value in character)
	{
		this[value] = character[value];
	}
	this.generateCharacter();
};

characterSchema.methods.generateCharacter = function()
{
	this.strength.modifier = calculateMod(this.strength.score);
	this.dexterity.modifier = calculateMod(this.dexterity.score);
	this.constitution.modifier = calculateMod(this.constitution.score);
	this.intelligence.modifier = calculateMod(this.intelligence.score);
	this.wisdom.modifier = calculateMod(this.wisdom.score);
	this.charisma.modifier = calculateMod(this.charisma.score);
	
	if (this.wisdom.perception)
	{
		this.passivePerception = 10 + this.wisdom.modifier + this.proficiencyBonus;
	}
	else 
	{
		this.passivePerception = 10 + this.wisdom.modifier;
	}
};

characterSchema.methods.getSaves = function()
{
	var saves = {
		strength : this.strength.modifier,
		dexterity : this.dexterity.modifier,
		constitution :  this.constitution.modifier,
		intelligence : this.intelligence.modifier,
		wisdom : this.wisdom.modifier,
		charisma : this.charisma.modifier
	};
	if (this.strength.save)
	{
		saves.strength += this.proficiencyBonus;
	}
	if (this.dexterity.save)
	{
		saves.dexterity += this.proficiencyBonus;
	}
	if (this.constitution.save)
	{
		saves.constitution += this.proficiencyBonus;
	}
	if (this.intelligence.save)
	{
		saves.intelligence += this.proficiencyBonus;
	}
	if (this.wisdom.save)
	{
		saves.wisdom += this.proficiencyBonus;
	}
	if (this.charisma.save)
	{
		saves.charisma += this.proficiencyBonus;
	}
	
	return saves;
};

var calculateMod = function(score)
{
	var mod = 0;
	if (score >= 10)
	{
		mod = (score - 10) / 2;
	}
	else
	{
		mod = (score - 11) / 2;
	}
	return Math.floor(mod);
};

mongoose.model('Character', characterSchema);