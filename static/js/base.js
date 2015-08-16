define([
	'./smz.js',
	], function (smz) {
	'use strict';

	var base = {};

	base.deepCopy = function (obj) {
		return $.extend(true, {}, obj);
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
	
	base.getGameReviewData = function (steamId, appId) {
		return smz.request('/api/id/'+steamId+'/reviews/'+appId);
	}
	return base;
});