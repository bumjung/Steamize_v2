'use strict';

var Q = require('q');
var mongoose = require('mongoose');
var GameSchema = require('./model/gameSchema');
var SteamIdSchema = require('./model/steamIdSchema');

var Database = {
	saveGameSchema: function (schema) {
		var deferred = Q.defer();

		var newSchema = new GameSchema({
		    appId: schema.appId,
		    achievements: schema.achievements
		});

		newSchema.save(function(err) {
			if (err) throw err;
			
			deferred.resolve(true);
		});

		return deferred.promise;
	},

	checkGameSchemaExists: function (appId) {
		var deferred = Q.defer();
		GameSchema.count({'appId' : appId}, function(err, count) {
			if (err) throw err;
			
			if(count === 1){
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
		});

		return deferred.promise;
	},

	getGameSchema: function (appId) {
		var deferred = Q.defer();
		GameSchema.findOne({'appId' : appId}, function(err, schema) {
			if (err) throw err;

			deferred.resolve(schema);
		});

		return deferred.promise;
	},

	saveSteamIdNumberFromString: function (steamIdString, steamIdNumber) {
		var deferred = Q.defer();

		var newSchema = new SteamIdSchema({
		    'steamIdString': steamIdString,
		    'steamIdNumber': steamIdNumber
		});

		newSchema.save(function(err) {
			if (err) throw err;
			
			deferred.resolve(steamIdNumber);
		});

		return deferred.promise;
	},

	checkSteamIdNumberFromStringExists: function (steamIdString) {
		var deferred = Q.defer();

		SteamIdSchema.count({'steamIdString' : steamIdString}, function(err, count) {
			if (err) throw err;
			
			if(count === 1){
				deferred.resolve(true);
			} else {
				deferred.resolve(false);
			}
		});

		return deferred.promise;
	},

	getSteamIdNumberFromString: function (steamIdString) {
		var deferred = Q.defer();

		SteamIdSchema.findOne({'steamIdString' : steamIdString}, function(err, schema) {
			if (err) throw err;

			deferred.resolve(schema['steamIdNumber']);
		});

		return deferred.promise;
	}
}

module.exports = Database;