var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    host: String,
    players: [],
    createdAt: {type: Number, required: true, default: Date.now},
    active: Boolean
});

// hash the password
encounterSchema.methods.addPlayer = function(player) 
{
    this.players.push(player);
    this.save();
};

mongoose.model('Encounter', encounterSchema);