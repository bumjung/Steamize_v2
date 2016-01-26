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
			newData['inGame'] = true;
			newData['personastate'] = newData['gameextrainfo'];
		} else {
			newData['inGame'] = false;
			newData['personastate'] = newData['personastate'] > 0 ? profile.PLAYER_STATUS[newData['personastate']] : "";
		}

		view.setData(newData);
		view.setTemplate(data['view']['template']);
		var response = view.getResponse();

		view.update(response);
	}

	return profile;
});
