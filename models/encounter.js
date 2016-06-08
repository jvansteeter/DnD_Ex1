var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterSchema = new mongoose.Schema(
{
    title: String,
    description: String,
    host: String,
    players: [],
    active: Boolean
},
{
	timestamps : true
});

// hash the password
encounterSchema.methods.addPlayer = function(player) 
{
    this.players.push(player);
};

mongoose.model('Encounter', encounterSchema);