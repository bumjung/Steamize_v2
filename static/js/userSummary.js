define([
	'./base.js',
	'./view.js'
	], function (base, View) {
	'use strict';

	var userSummary = {};

	userSummary.init = function () {
		$.extend(userSummary, base);
		userSummary.view = new View('.userSummary');
	}

	userSummary.render = function (data) {
		var view = userSummary.view;
		var viewData = userSummary.deepCopy(data['view']['data']);

		var newData = {};
		newData['totalAchievementsCompleted'] = viewData['totalAchievementsCompleted'];
		newData['totalPlayedTime'] = viewData['totalPlayedTime'];
		newData['totalCost'] = viewData['totalCost'].toFixed(2);

		view.setData(newData);
		view.setTemplate('/src/core/mvc/view/summary.ejs');
		var response = view.getResponse();

		view.update(response);
	}

	return userSummary;
});