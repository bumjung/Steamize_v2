define([
	'./base.js',
	'./smz.js',
	'./view.js',
	'./games.js',
	'./profile.js',
	'./userSummary.js'
	], function (base, smz, View, games, profile, userSummary) {
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

		window.history.pushState({"showLibrary" : true},"", window.location.pathname);

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profile.render(data);
			});

		steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				games.render(data);
				userSummary.render(data);
			});
	}


	return steamize;
});