var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var steamIdSchema = new Schema({
    steamIdString: String,
    steamIdNumber: String
});

var GameSchema = mongoose.model('SteamIdSchema', steamIdSchema);

module.exports = GameSchema;