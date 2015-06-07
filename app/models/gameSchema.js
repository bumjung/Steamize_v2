var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var achievementSchema = new Schema({
    appId: Number,
    achievements: [{
    	name: String,
    	displayName: String,
    	description: String,
    	icon: String,
    	iconGray: String
    }]
});

var GameSchema = mongoose.model('Schema', achievementSchema);

module.exports = GameSchema