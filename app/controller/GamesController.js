'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var database = require('../database');
var URL = require('../../config/steamUrl');
var Helper = require('../helper.js');

var GamesController = function () {
	this.MAX_DEMO_ACHIEVEMENTS = 5;
};

GamesController.prototype = _.extend(BaseController.prototype, {

	getFullGameSchema: function (Account) {
		var self = this;
        var games = Account.getGamesList();
        var promises = [];

        for (var i = 0; i < games.length; i++) {
            (function (i) {
                promises.push(
                    self.saveGameSchema(games[i]['appid']),
                    self.getPlayerAchievements(games[i], Account.getSteamId())
                );
            }(i));
        }

        var result = [];

        return Q.allSettled(promises).then(function (promise) {
            return self.getUserGameSchemas(promise);
        }).then(function (schemas) {
            schemas = _.compact(schemas);
            var cleanSchemas = [];
            for (var i = 0; i < schemas.length; i++) {
            	if (schemas[i]['state'] === 'fulfilled' && schemas[i]['value']) {
            		cleanSchemas.push(schemas[i]['value']);
            	}
            }
            if (cleanSchemas.length > 0) {
                cleanSchemas = self.formatGamesJSON(cleanSchemas);

                return {
                    success: 1,
                    view: {
                        data: { 
                            games: cleanSchemas['games'],
                            totalPlayedTime: (cleanSchemas['totalPlayedTime']/60),
                            totalAchievementsCompleted: cleanSchemas['totalAchievementsCompleted']
                        },
                        template: '/src/core/mvc/view/games.ejs'
                    }
                };
            } else {
                return { success: 0 };
            }
        });
	},
	
	getUserGameSchemas: function (promise) {
	    var getSchemaPromises = _.map(promise, function (arr) {
	        if (arr['state'] === 'fulfilled' && _.isObject(arr['value'])) {
	            return database.getGameSchema(arr['value']['appId']).then(function (schema) {
	                var completedAchievements = [];
	                var uncompletedAchievements = [];

	                if (schema && schema['achievements']) {
		                for (var i = 0; i < schema['achievements'].length; i++) {
		                    schema['achievements'][i]['achieved'] = arr['value'][schema['achievements'][i]['name']];
		                    if (schema['achievements'][i]['achieved'] === 1) {
		                        completedAchievements.push(schema['achievements'][i]);
		                    } else {
		                        uncompletedAchievements.push(schema['achievements'][i]);
		                    }
		                }
	            	}
	                return {
	                    name: arr['value']['name'],
	                    playtime_forever: arr['value']['playtime_forever'],
	                    appId: arr['value']['appId'],
	                    achievements: {
	                        completed: completedAchievements,
	                        uncompleted: uncompletedAchievements
	                    }
	                };
	            });
	        } else {
	        	return false;
	        }
	    });

	    return Q.allSettled(getSchemaPromises);
	},

	getPlayerAchievements: function (game, steamId) {
	    var url = URL.getPlayerAchievements(game['appid'], steamId);

	    return this.sendRequest(url).then(function (body) {
	        var body = JSON.parse(body);
	        var response = {
	            name: body['playerstats']['gameName'],
	            playtime_forever: game['playtime_forever'],
	            appId: game['appid']
	        };

	        if (body['playerstats'] && body['playerstats']['success'] && body['playerstats']['achievements']) {
		        for (var i = 0; i < body['playerstats']['achievements'].length; i++) {
		            response[body['playerstats']['achievements'][i]['apiname']] = body['playerstats']['achievements'][i]['achieved'];
		        };
		    }
	        
	        return response;
	    });
	},

	saveGameSchema: function (appId) {
		var self = this;

	    return database.checkGameSchemaExists(appId).then(function (exists) {
	        if (!exists) {
	            var url = URL.getSchemaForGame(appId);
	            
	            return self.sendRequest(url).then(function (body) {
	                var body = JSON.parse(body);
	                var response = {
	                    appId: appId
	                }
	                if (body['game'] && body['game']['availableGameStats']) {
	                    response['achievements'] = body['game']['availableGameStats']['achievements'];
	                } else {
	                    response['achievements'] = [];
	                }

	                return database.saveGameSchema(response);
	            });
	        } else {
	            return false;
	        }
	    });
	},

	formatGamesJSON: function (userGameSchemas) {
		var self = this;

		var newUserGameSchema = {
			games: [],
			totalPlayedTime: 0,
			totalAchievementsCompleted: 0
		};
		var totalPlayedTime = 0;
		var totalAchievementsCompleted = 0;

		// sort by decreasing order
		userGameSchemas.sort(Helper.compareGames);
		for (var i = 0; i < userGameSchemas.length; i++) {
			var demoAchievements = [];
			var alreadyInDemo = {};

			totalPlayedTime += userGameSchemas[i]['playtime_forever'];
			totalAchievementsCompleted += userGameSchemas[i]['achievements']['completed'].length;

			// @TODO: 	- Implement this into a generic function
			// 			- if < 5 completed achievements, fill up the rest with uncompleted using generic fcn
			if (userGameSchemas[i]['achievements']['completed'].length > self.MAX_DEMO_ACHIEVEMENTS) {
				for (var j = 0; j < self.MAX_DEMO_ACHIEVEMENTS; j++) {
					do {
						var rnd = Helper.getRandomInt(0, userGameSchemas[i]['achievements']['completed'].length-1);
					} while(alreadyInDemo[rnd]);

					demoAchievements.push(userGameSchemas[i]['achievements']['completed'][rnd]);
					alreadyInDemo[rnd] = 1;
				}
			} else {
				demoAchievements = userGameSchemas[i]['achievements']['completed'];
			}


			newUserGameSchema['games'].push({
				name: userGameSchemas[i]['name'],
				playTimeForever: userGameSchemas[i]['playtime_forever'],
				achievementCount: userGameSchemas[i]['achievements']['completed'].length + userGameSchemas[i]['achievements']['uncompleted'].length,
				demoAchievements: demoAchievements
			});
		}

		newUserGameSchema['totalPlayedTime'] = totalPlayedTime;
		newUserGameSchema['totalAchievementsCompleted'] = totalAchievementsCompleted;
		return newUserGameSchema;
	}
});

module.exports = GamesController;