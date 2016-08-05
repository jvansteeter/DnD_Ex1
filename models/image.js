var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new mongoose.Schema(
{
    title: String,
    file: { data: Buffer, contentType: String }
});

mongoose.model('Image', imageSchema);