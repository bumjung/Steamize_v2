define([
	'./base.js',
	'./smz.js',
	'./view.js',
	'./games.js',
	'./profile.js',
	'./userSummary.js',
	'./gameSummary.js'
	], function (base, smz, View, games, profile, userSummary, gameSummary) {
	'use strict';

	var steamize = {};

	steamize.init = function (data) {
		$.extend(steamize, base);

		smz.initSubmit();
		profile.init();
		games.init(steamize.steamId);
		userSummary.init();

		window.onpopstate = function(e){
		    if (e.state) {
		    	if (e.state.showLibrary) {
		    		games.showLibrary();
		    	} else {
		    		games.hideLibrary();
		    	}
		    }
		};

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
				if (steamize.page === 'gameSummary') {
					if (steamize.appId > 0) {
						games.hideLibrary();
						var renderData = {};
						var gamesData = data['view']['data']['games'];
						for (var i=0; i<gamesData.length; i++) {
							if (gamesData[i]['appId'] == steamize.appId) {
								renderData = gamesData[i];
								break;
							}
						}
						gameSummary.render(renderData);
					}
				} else {
					games.render(data);
				}
				userSummary.render(data);
			});
	}


	return steamize;
});