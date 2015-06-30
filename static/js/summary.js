define([
	'./smz.js',
	'./view.js'
	], function (smz, View) {
	'use strict';

	var summary = {};

	summary.init = function(data) {
		$.extend(summary, data);
		var profileView = new View('profile');
		var friendsView = new View('friends');
		var gamesView = new View('games');
		var gamesDetailView = new View('gamesDetail');

		summary.getProfileData(summary.steamId)
			.then(function(data) {
				profileView.update(data);
			});

		summary.getFriendsData(summary.steamId)
			.then(function(data) {
				friendsView.update(data);
			});

		summary.getGamesData(summary.steamId)
			.then(function(data) {
				gamesView.update(data);
			});
		summary.getGamesDetailData(summary.steamId)
			.then(function(data) {
				gamesDetailView.update(data);
			});
	}

	summary.getProfileData = function(steamId) {
		return smz.request('/api/id/'+ steamId);
	}

	summary.getFriendsData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/friends');
	}

	summary.getGamesData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/games');
	}

	summary.getGamesDetailData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/gameDetails')
	}


	return summary;
});