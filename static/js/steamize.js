define([
	'./smz.js',
	'./view.js'
	], function (smz, View) {
	'use strict';

	var steamize = {};

	steamize.init = function(data) {
		this.render(data)
			.then(function() {
				var imageSelector = $('#imageContainer').find('._img');
				for (var i = 0; i < imageSelector.length; i++) {
					$(imageSelector[i]).on('mouseenter', function () {
						var gamesDetail = $(this).children('._gamesDetail');
						gamesDetail.removeClass('hide');
					});
					$(imageSelector[i]).on('mouseleave', function () {
						var gamesDetail = $(this).children('._gamesDetail');

						gamesDetail.addClass('hide');
					});
				}
			});
	}

	steamize.render = function (data) {
		$.extend(steamize, data);
		var profileView = new View('.userInfo');
		var gamesView = new View('#imageContainer');
		var summaryView = new View('.userSummary');

		steamize.getProfileData(steamize.steamId)
			.then(function(data) {
				profileView.update(data);
			});

		return steamize.getGamesData(steamize.steamId)
			.then(function(data) {
				gamesView.update(data);
				var result = {
					success: 1,
					view: {
						template: '/src/core/mvc/view/summary.ejs'
					}
				}
				var summary = {};

				summary['totalAchievementsCompleted'] = data['view']['data']['totalAchievementsCompleted'];
				summary['totalPlayedTime'] = data['view']['data']['totalPlayedTime'];
				summary['totalCost'] = data['view']['data']['totalCost'];
				result['view']['data'] = summary;

				return summaryView.update(result);
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


	return steamize;
});