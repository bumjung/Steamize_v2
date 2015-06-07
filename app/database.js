'use strict';

var mongoose = require('mongoose');
var GameSchema = require('./models/gameSchema');

var Database = {
	saveGameSchema: function(Q, schema) {
		var deferred = Q.defer();

		var newSchema = new GameSchema({
		    appId: schema.appId,
		    achievements: schema.achievements
		});

		newSchema.save(function(err){
			if (err) throw err;

			deferred.resolve(true);
		});

		return deferred.promise;
	},

	checkGameSchemaExists: function(Q, appId) {
		var deferred = Q.defer();
		GameSchema.count({"appId" : appId}, function(err, count){
			if (err) throw err;
			
			if(count === 1){
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
		});

		return deferred.promise;
	}
}

module.exports = Database;