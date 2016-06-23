var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new mongoose.Schema(
{
	user_id: String,
    name: String,
    class: String,
    level: Number,
    background: String,
    player_name: String,
    race: String,
    alignment: String,
    exp: Number,
    proficiency_bonus: Number,
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
    	sleight_of_hand: {type: Boolean, required: true, default: false},
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
    	animal_handling: {type: Boolean, required: true, default: false},
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
    passive_perception: Number,
    armor_class: Number,
    speed: Number,
    hitPoints: Number,
    max_hitPoints: Number,
    temp_hitPoints: Number,
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
		type: String
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
});

characterSchema.methods.createNewCharacter = function(character)
{
	this.name = character.name;
	this.class = character.class;
	this.level = character.level;
	this.background = character.background;
	this.player_name = character.player_name;
	this.race = character.race;
	this.alignment = character.alignment;
	this.exp = character.exp;
	this.proficiency_bonus = character.proficiency_bonus;

	this.strength.score = character.strength.score;
	this.strength.modifier = calculateMod(character.strength.score);
	this.strength.save = character.strength.save;
	this.strength.athletics = character.strength.athletics;
	this.dexterity.score = character.dexterity.score;
	this.dexterity.modifier = calculateMod(character.dexterity.score);
	this.dexterity.save = character.dexterity.save;
	this.dexterity.acrobatics = character.dexterity.acrobatics;
	this.dexterity.sleight_of_hand = character.dexterity.sleight_of_hand;
	this.dexterity.stealth = character.dexterity.stealth;
	this.constitution.score = character.constitution.score;
	this.constitution.modifier = calculateMod(character.constitution.score);
	this.constitution.save = character.constitution.save;
	this.intelligence.score = character.intelligence.score;
	this.intelligence.modifier = calculateMod(character.intelligence.score);
	this.intelligence.save = character.intelligence.save;
	this.intelligence.arcana = character.intelligence.arcana;
	this.intelligence.history = character.intelligence.history;
	this.intelligence.investigation = character.intelligence.investigation;
	this.intelligence.nature = character.intelligence.nature;
	this.intelligence.religion = character.intelligence.religion;
	this.wisdom.score = character.wisdom.score;
	this.wisdom.modifier = calculateMod(character.wisdom.score);
	this.wisdom.save = character.wisdom.save;
	this.wisdom.animal_handling = character.wisdom.animal_handling;
	this.wisdom.insight = character.wisdom.insight;
	this.wisdom.medicine = character.wisdom.medicine;
	this.wisdom.perception = character.wisdom.perception;
	this.wisdom.survival = character.wisdom.survival;
	this.charisma.score = character.charisma.score;
	this.charisma.modifier = calculateMod(character.charisma.score);
	this.charisma.save = character.charisma.save;
	this.charisma.intimidate = character.charisma.intimidate;
	this.charisma.persuasion = character.charisma.persuasion;
	this.charisma.performance = character.charisma.performance;
	this.charisma.deception = character.charisma.deception;

	this.passive_perception = 10 + this.wisdom.perception;
	this.armor_class = character.armor_class;
	this.speed = character.speed;
	this.hitPoints = character.max_hitPoints;
	this.max_hitPoints = character.max_hitPoints;
	this.features = character.features;
	this.proficiencies = character.proficiencies;
	this.languages = character.languages;
	this.personality = character.personality;
	this.ideals = character.ideals;
	this.bonds = character.bonds;
	this.flaws = character.flaws;
	this.attacks = character.attacks;
	this.money = character.money;
	this.equipment = character.equipment;

	//this.save();
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
	return mod;
};

mongoose.model('Character', characterSchema);