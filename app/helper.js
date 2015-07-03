'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');

var Helper = {};

Helper.MAX_DEMO_ACHIEVEMENTS = 5;

Helper.sendRequest = function (url) {
    var deferred = Q.defer();

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            deferred.reject(false);
        }
    });

    return deferred.promise;
}

Helper.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Helper.compare = function (a,b) {
  if (a.playtime_forever < b.playtime_forever)
    return 1;
  if (a.playtime_forever > b.playtime_forever)
    return -1;
  return 0;
}

Helper.formatGamesJSON = function (userGameSchemas) {
	var newUserGameSchema = {
		games: [],
		totalPlayedTime: 0
	};
	var totalPlayedTime = 0;

	// sort by decreasing order
	userGameSchemas.sort(Helper.compare);

	for (var i = 0; i < userGameSchemas.length; i++) {
		var demoAchievements = [];
		var alreadyInDemo = {};

		totalPlayedTime += userGameSchemas[i]['playtime_forever'];

		// @TODO: 	- Implement this into a generic function
		// 			- if < 5 completed achievements, fill up the rest with uncompleted using generic fcn
		if (userGameSchemas[i]['achievements']['completed'].length > Helper.MAX_DEMO_ACHIEVEMENTS) {
			for (var j = 0; j < Helper.MAX_DEMO_ACHIEVEMENTS; j++) {
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
	return newUserGameSchema;
}

module.exports = Helper;