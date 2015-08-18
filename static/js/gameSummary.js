define([
	'./base.js',
	'./view.js',
	'./gameReview.js'
	], function (base, View, gameReview) {
	'use strict';

	var gameSummary = {};

	gameSummary.init = function () {
		$.extend(gameSummary, base);
		gameSummary.viewClass = '.oneGame';
		gameSummary.view = new View(gameSummary.viewClass);

		gameReview.init();
	}

	gameSummary.render = function (data) {
		var view = gameSummary.view;

		var newData = gameSummary.deepCopy(data);
		var ratingArray = newData['metacritic']['rating'].split(' ');
		newData['metacritic']['cssClass'] = ratingArray.length > 1 ? ratingArray[1].toLowerCase() : ratingArray[0].toLowerCase();
		view.setData(newData);
		view.setTemplate('/src/core/mvc/view/gameSummary.ejs');

		var response = view.getResponse();

		gameReview.getGameReviewData(window.sz.steamize.steamId, data.appId)
			.then(function (data) {
				gameReview.render(data);
			});

		return view.update(response)
			.then(function () {			
				$('._description').html($.parseHTML(newData['description']));	
				$('.banner').unslider({
					delay: false,
					keys: true,               //  Enable keyboard (left, right) arrow shortcuts
					dots: true,               //  Display dot navigation
				});

				gameSummary.addListenerToReadMe();
			});
	}

	gameSummary.addListenerToReadMe = function () {
		$('._read-more').on('click', function () {
			$('._description').parent().css({
				'max-height': 999
			});
			$(this).hide();
			return false;
		});
	}

	return gameSummary;
});