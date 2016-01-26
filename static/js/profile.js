define([
	'./base.js',
	'./view.js'
	], function (base, View) {
	'use strict';

	var profile = {};

	profile.PLAYER_STATUS = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to Trade', 'Looking to Play'];

	profile.init = function () {
		$.extend(profile, base);
		profile.view = new View('.userInfo');
	}

	profile.render = function (data) {
		var view = profile.view;
		var newData = profile.deepCopy(data['view']['data']);
		
		newData['stateClass'] = profile.PLAYER_STATUS[newData['personastate']].split(' ').join('_').toLowerCase();
		if (newData['gameextrainfo']) {
			newData['personastate'] = newData['gameextrainfo'];
		} else {
			newData['personastate'] = profile.PLAYER_STATUS[newData['personastate']];
		}

		view.setData(newData);
		view.setTemplate(data['view']['template']);
		var response = view.getResponse();

		view.update(response);
	}

	return profile;
});