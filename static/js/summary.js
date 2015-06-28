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

		summary.getProfileData(summary.steamId)
			.then(function(data) {
				profileView.update(data);
			});

		summary.getFriendsData(summary.steamId)
			.then(function(data) {
				friendsView.update(data);
			});
	}

	summary.getProfileData = function(steamId) {
		return smz.request('/api/id/'+ steamId);
	}

	summary.getFriendsData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/friends');
	}

	summary.getGamesData = function(steamId) {
		return smz.request('/id/'+steamId+'/games');
	}


	return summary;
});