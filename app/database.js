var mongoose = require('mongoose');
var GameSchema = require('./models/gameSchema');

var Database = {
	saveGameSchema: function(schema, callback) {
		var newSchema = new GameSchema({
		    appId: schema.appId,
		    achievements: schema.achievements
		});
		newSchema.save(function(err){
			if (err) throw err;
		});
	},

	checkGameSchemaExists: function(appId, callback) {
		GameSchema.count({"appId" : appId}, function(err, count){
			if (err) throw err;
			
			if(count === 1){
				callback(true);
			} else {
				callback(false);
			}
		});
	}
}

module.exports = Database;