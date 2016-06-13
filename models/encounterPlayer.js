var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encounterPlayerSchema = new mongoose.Schema(
{
    name: String,
    initiative: Number,
    armorClass: Number,
    hitPoints: Number,
    maxHitPoints: Number
});

mongoose.model('EncounterPlayer', encounterPlayerSchema);