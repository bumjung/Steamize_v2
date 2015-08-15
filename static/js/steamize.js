define([
	'./base.js',
	'./smz.js',
	'./view.js',
	'./games.js',
	'./profile.js'
	], function (base, smz, View, games, profile) {
	'use strict';

	var steamize = {};

	steamize.init = function (data) {
		$.extend(steamize, base);

		smz.initSubmit();
		profile.init();
		games.init();

		this.render(data);
	}

	steamize.submit = function () {
		smz.submit();
	}

	steamize.render = function (data) {
		$.extend(steamize, data);
		var summaryView = new View('.userSummary');

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profile.render(data);
			});

		steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				games.render(data);

				var summary = {};
				summary['totalAchievementsCompleted'] = data['view']['data']['totalAchievementsCompleted'];
				summary['totalPlayedTime'] = data['view']['data']['totalPlayedTime'];
				summary['totalCost'] = data['view']['data']['totalCost'].toFixed(2);
				
				summaryView.setTemplate('/src/core/mvc/view/summary.ejs');
				summaryView.setData(summary);
				var response = summaryView.getResponse();
				
				summaryView.update(response);
			});
	}


	return steamize;
});