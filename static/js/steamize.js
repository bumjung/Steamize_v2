define([
	'./smz.js',
	'./view.js'
	], function (smz, View) {
	'use strict';

	var steamize = {};

	steamize.init = function(data) {
		$.extend(steamize, data);
		var profileView = new View('.userInfo');
		var gamesView = new View('#imageContainer');
		var summaryView = new View('.userSummary');

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profileView.update(data);
			});

		var gamesPromise = steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				gamesView.update(data);
				return data;
			});
			
		var gamesDetailPromise = steamize.getGamesDetailData(steamize.steamId)
			.then(function(data) {
				return data;
			});

		$.when(gamesPromise, gamesDetailPromise).done(function (games, gamesDetail) {
			if(games['success'] === 1 && gamesDetail['success'] === 1) {
				var result = {
					success: 1,
					view: {
						template: '/src/core/mvc/view/summary.ejs'
					}
				}
				var data = {};
				data['totalAchievementsCompleted'] = games['view']['data']['totalAchievementsCompleted'];
				data['totalPlayedTime'] = games['view']['data']['totalPlayedTime'];
				data['totalCost'] = gamesDetail['view']['data']['totalCost'];

				result['view']['data'] = data;
				summaryView.update(result);
			} else {
				console.log('err');
			}
		});
	}

	steamize.getProfileData = function(steamId) {
		return smz.request('/api/id/'+ steamId);
	}

	steamize.getFriendsData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/friends');
	}

	steamize.getGamesData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/games');
	}

	steamize.getGamesDetailData = function(steamId) {
		return smz.request('/api/id/'+steamId+'/gameDetails')
	}


	return steamize;
});