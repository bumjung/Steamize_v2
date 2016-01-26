define([
	'./base.js',
	'./smz.js',
	'./view.js',
	'./games.js',
	'./profile.js',
	'./userSummary.js',
	'./gameSummary.js',
	'./history.js'
	], function (base, smz, View, games, profile, userSummary, gameSummary, history) {
	'use strict';

	var steamize = {};

	steamize.init = function (data) {
		$.extend(steamize, base);

		smz.initSubmit();
		profile.init();
		games.init();
		userSummary.init();
		history.init(games, gameSummary);

		this.render(data);
	}

	steamize.submit = function () {
		smz.submit();
	}

	steamize.render = function (data) {
		$.extend(steamize, data);

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profile.render(data);
			});

		steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				userSummary.render(data);

				// redirecting directly to an appid
				if (history.isRenderGameSummary()) {
					var renderData = games.findGameData(data['view']['data'], steamize.appId);

					games.hideLibrary();
					gameSummary.render(renderData);
				}

				// make sure library section is rendered... just in case
				games.render(data);
			});
	}

	return steamize;
});