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
    	intimidate: {type: Boolean, required: true, default: false},
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

mongoose.model('Character', characterSchema);