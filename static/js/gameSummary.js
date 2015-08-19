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
		// if user directly linked to appid, don't set history
		if (sz.steamize.page !== 'gameSummary') {
			window.history.pushState({showLibrary : false, data: data},"", sz.steamize.url+'/'+data['appId']);
		} else {
			// your work is finished
			sz.steamize.page = '';
		}

		var view = gameSummary.view;

		var newData = gameSummary.deepCopy(data);
		var ratingArray = newData['metacritic']['rating'].split(' ');

		newData['metacritic']['cssClass'] = ratingArray.length > 1 ? ratingArray[1].toLowerCase() : ratingArray[0].toLowerCase();
		
		view.setData(newData);
		view.setTemplate('/src/core/mvc/view/gameSummary.ejs');

		var response = view.getResponse();

		gameReview.getGameReviewData(sz.steamize.steamId, data.appId)
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

	gameSummary.isRendered = function () {
		return $(gameSummary.viewClass).children().length > 0;
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