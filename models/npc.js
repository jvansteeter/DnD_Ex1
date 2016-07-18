var mongoose = require('mongoose');

var npcSchema = new mongoose.Schema(
    {
        userID: String,
        name: String,
        descriptors: String,
        description: String,
        strength: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        dexterity: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        constitution: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        intelligence: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        wisdom: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        charisma: {
            score: Number,
            modifier: Number,
            save: {type: Number, required: false, default: 0}
        },
        passivePerception: Number,
        armorClass: Number,
        hitPoints: Number,
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
        status: [],
        npc: {type: Boolean, required: true, default: true}
    });

npcSchema.methods.generateNPC = function()
{
    this.strength.modifier = calculateMod(this.strength.score);
    this.dexterity.modifier = calculateMod(this.dexterity.score);
    this.constitution.modifier = calculateMod(this.constitution.score);
    this.intelligence.modifier = calculateMod(this.intelligence.score);
    this.wisdom.modifier = calculateMod(this.wisdom.score);
    this.charisma.modifier = calculateMod(this.charisma.score);

    this.passivePerception = 10 + this.wisdom.modifier;

    this.save();
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
    }

    return saves;
}

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