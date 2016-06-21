var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new mongoose.Schema(
{
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
    	save: Boolean,
    	athletics: Boolean
    },
    dexterity: {
    	score: Number,
    	modifier: Number,
    	save: Boolean,
    	acrobatics: Boolean,
    	sleight_of_hand: Boolean,
    	stealth: Boolean
    },
    constitution: {
    	score: Number,
    	modifier: Number,
    	save: Boolean
    },
    intelligence: {
    	score: Number,
    	modifier: Number,
    	save: Boolean,
    	arcana: Boolean,
    	history: Boolean,
    	investigation: Boolean,
    	nature: Boolean,
    	religion: Boolean
    },
    wisdom: {
    	score: Number,
    	modifier: Number,
    	save: Boolean,
    	animal_handling: Boolean,
    	insight: Boolean,
    	medicine: Boolean,
    	perception: Boolean,
    	survival: Boolean
    },
    charisma: {
    	score: Number,
    	modifier: Number,
    	save: Boolean,
    	intimidate: Boolean,
    	persuasion: Boolean,
    	performance: Boolean,
    	deception: Boolean
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
	attacks: [],
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
    npc: Boolean
});

mongoose.model('Character', characterSchema);