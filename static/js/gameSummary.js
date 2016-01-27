define([
	'./base.js',
	'./view.js',
	'./gameReview.js',
	'./history.js'
	], function (base, View, gameReview, history) {
	'use strict';

	var gameSummary = {};

	function handleRecommendationTotalOverflow(value) {
        var intRecTotal = parseInt(value['recommendations']['total']);
        if(intRecTotal >= 1000000) {
            value['recommendations']['total'] = (Math.floor((intRecTotal / 1000000)*10)/10).toFixed(1) + "m";
        } else if (intRecTotal >= 10000) {
            value['recommendations']['total'] = (Math.floor((intRecTotal / 1000)*10)/10).toFixed(1) + "k";
        }
	}

	gameSummary.init = function () {
		$.extend(gameSummary, base);
		gameSummary.viewClass = '.oneGame';
		gameSummary.view = new View(gameSummary.viewClass);

		gameReview.init();
	}

	gameSummary.render = function (data) {
		history.setHistory(data);

		var view = gameSummary.view;

		var newData = gameSummary.deepCopy(data);
		var ratingArray = newData['metacritic']['rating'].split(' ');

		newData['metacritic']['cssClass'] = ratingArray.length > 1 ? ratingArray[1].toLowerCase() : ratingArray[0].toLowerCase();

		handleRecommendationTotalOverflow(newData);

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
			var parentLength = parseInt($('._description').parent().css("max-height"));
			var childLength = $('._description').height() + 46;
			$('._description').parent().css({
				'max-height': childLength > parentLength ? childLength : parentLength
			});
			$(this).hide();
			return false;
		});
	}

	return gameSummary;
});
