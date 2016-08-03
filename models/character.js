var mongoose = require('mongoose');

var characterSchema = new mongoose.Schema(
{
	userID: String,
    name: String,
    class: String,
    level: String,
    background: String,
    playerName: String,
    race: String,
    alignment: String,
    exp: Number,
    proficiencyBonus: Number,
    strength: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false},
    	athletics: {type: Boolean, required: true, default: false}
    },
    dexterity: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false},
    	acrobatics: {type: Boolean, required: true, default: false},
    	sleightOfHand: {type: Boolean, required: true, default: false},
    	stealth: {type: Boolean, required: true, default: false}
    },
    constitution: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false}
    },
    intelligence: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false},
    	arcana: {type: Boolean, required: true, default: false},
    	history: {type: Boolean, required: true, default: false},
    	investigation: {type: Boolean, required: true, default: false},
    	nature: {type: Boolean, required: true, default: false},
    	religion: {type: Boolean, required: true, default: false}
    },
    wisdom: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false},
    	animalHandling: {type: Boolean, required: true, default: false},
    	insight: {type: Boolean, required: true, default: false},
    	medicine: {type: Boolean, required: true, default: false},
    	perception: {type: Boolean, required: true, default: false},
    	survival: {type: Boolean, required: true, default: false}
    },
    charisma: {
    	score: Number,
    	modifier: Number,
    	save: {type: Boolean, required: true, default: false},
    	intimidation: {type: Boolean, required: true, default: false},
    	persuasion: {type: Boolean, required: true, default: false},
    	performance: {type: Boolean, required: true, default: false},
    	deception: {type: Boolean, required: true, default: false}
    },
    passivePerception: Number,
    armorClass: Number,
	initiative: Number,
    speed: String,
    hitPoints: Number,
    maxHitPoints: Number,
    tempHitPoints: Number,
    features: [],
	proficiencies: [],
	languages: [],
	personality: String,
	ideals: String,
	bonds: String,
	flaws: String,
	attacks: [{
		name: String,
		bonus: Number,
		damage: String,
		damageType: String
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
    npc: {type: Boolean, required: true, default: false}
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