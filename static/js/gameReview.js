define([
	'./base.js',
	'./view.js'
	], function (base, View) {
	'use strict';

	var gameReview = {};

	gameReview.init = function () {
		$.extend(gameReview, base);
		gameReview.view = new View('.gameReview');
	}

	gameReview.render = function (data) {
		var view = gameReview.view;
		var newData = gameReview.deepCopy(data['view']['data']);

		view.setData(newData);
		view.setTemplate(data['view']['template']);
		var response = view.getResponse();

		view.update(response)
			.then(function () {
				gameReview.renderContentHtml(data['view']['data']);
			});
	}

	gameReview.renderContentHtml = function (data) {
		for(var i=0; i<Math.min(4, data['reviews'].length); i++) {
			$('.reviews .review:nth-child('+i+') .content').html($.parseHTML(data['reviews'][i]['content']));
		}
	}
	return gameReview;
});
