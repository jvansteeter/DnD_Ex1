var mongoose = require('mongoose');

var npcSchema = new mongoose.Schema(
    {
        userID: String,
        name: String,
        descriptors: String,
        description: String,
        strength: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        dexterity: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        constitution: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        intelligence: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        wisdom: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        charisma: {
            score: {type: Number, default: 0},
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        passivePerception: {type: Number, default: 0},
        armorClass: {type: Number, default: 0},
        hitPoints: {type: Number, default: 1},
        speed: String,
        features: [],
        specials: [{
            name: String,
            description: String
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
        attacks: [{
            name: String,
            bonus: Number,
            damage: String,
            damageType: String
        }],
        actions: [{
            name: String,
            description: String
        }],
        status: []
    });

npcSchema.methods.setNPC = function(npc)
{
    for (var value in npc)
    {
        this[value] = npc[value];
    }
    this.generateNPC();
};

npcSchema.methods.generateNPC = function()
{
    this.strength.modifier = calculateMod(this.strength.score);
    this.dexterity.modifier = calculateMod(this.dexterity.score);
    this.constitution.modifier = calculateMod(this.constitution.score);
    this.intelligence.modifier = calculateMod(this.intelligence.score);
    this.wisdom.modifier = calculateMod(this.wisdom.score);
    this.charisma.modifier = calculateMod(this.charisma.score);

    this.passivePerception = 10 + this.wisdom.modifier;
};

npcSchema.methods.getSaves = function()
{
    var saves = {
        strength : this.strength.save,
        dexterity : this.dexterity.save,
        constitution : this.constitution.save,
        intelligence : this.intelligence.save,
        wisdom : this.wisdom.save,
        charisma : this.charisma.save
    };

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

mongoose.model('NPC', npcSchema);