define([
	'./smz.js',
	], function (smz) {
	'use strict';

	var base = {};

	base.deepCopy = function (obj) {
		return $.extend(true, {}, obj);
	}

	base.createViewResponse = function(template, data) {
		return {
			success: 1,
			view: {
				data: data,
				template: template
			}
		};
	}

	base.getProfileData = function (steamId) {
		return smz.request('/api/id/'+ steamId);
	}

	base.getFriendsData = function (steamId) {
		return smz.request('/api/id/'+steamId+'/friends');
	}

	base.getGamesData = function (steamId) {
		return smz.request('/api/id/'+steamId+'/games');
	}

	return base;
});