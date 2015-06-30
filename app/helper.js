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

Helper.formatGamesJSON = function (json) {
	var newJSON = [];

	for (var i = 0; i < json.length; i++) {
		var demoAchievements = [];
		var alreadyInDemo = {};

		if (json[i].achievements.length > Helper.MAX_DEMO_ACHIEVEMENTS) {
			for (var j = 0; j < Helper.MAX_DEMO_ACHIEVEMENTS; j++) {
				do {
					var rnd = Helper.getRandomInt(0, json[i].achievements.length-1);
				} while(alreadyInDemo[rnd]);

				demoAchievements.push(json[i].achievements[rnd]);
				alreadyInDemo[rnd] = 1;
			}
		} else {
			demoAchievements = json[i].achievements;
		}

		newJSON.push({
			name: json[i]['name'],
			playTimeForever: json[i]['playtime_forever'],
			achievementCount: json[i].achievements.length,
			demoAchievements: demoAchievements
		});
	}

	return newJSON;
}

module.exports = Helper;