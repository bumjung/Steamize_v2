define([
	'./base.js',
	'./smz.js',
	'./view.js',
	'./games.js'
	], function (base, smz, View, games, pagination) {
	'use strict';

	var steamize = {};

	steamize.init = function (data) {
		$.extend(steamize, base);

		smz.initSubmit();
		games.init();

		this.render(data);
	}

	steamize.submit = function () {
		smz.submit();
	}

	steamize.render = function (data) {
		$.extend(steamize, data);
		var profileView = new View('.userInfo');
		var summaryView = new View('.userSummary');

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profileView.update(data);
			});

		steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				games.render(data);

				var summary = {};
				summary['totalAchievementsCompleted'] = data['view']['data']['totalAchievementsCompleted'];
				summary['totalPlayedTime'] = data['view']['data']['totalPlayedTime'];
				summary['totalCost'] = data['view']['data']['totalCost'];
				
				var response = steamize.createViewResponse('/src/core/mvc/view/summary.ejs', summary);

				summaryView.update(response);
			});
	}


	return steamize;
});