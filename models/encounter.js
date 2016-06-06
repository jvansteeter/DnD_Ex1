var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterSchema = new mongoose.Schema(
{
    title: String,
    date: Date,
    description: String,
    host: String,
    players: [],
    active: Boolean
});

// hash the password
encounterSchema.methods.addPlayer = function(player) 
{
    this.players.push(player);
};

mongoose.model('Encounter', encounterSchema);