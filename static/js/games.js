define([
	'./base.js',
	'./view.js',
	'./pagination.js',
	'./gameSummary.js'
	], function (base, View, pagination, gameSummary) {
	'use strict';

	var games = {};

	games.init = function () {
		$.extend(games, base);
		games.view = new View('#imageContainer');

		gameSummary.init();
	}

	games.render = function (data) {
		var view = games.view;
		var newData = games.deepCopy(data['view']['data']);
		
		newData['limit'] = Math.min(Math.floor(newData['games'].length/3), 3);
		newData['maxGamesLength'] = Math.min(newData['games'].length, 15);

		view.setData(newData);
		view.setTemplate(data['view']['template']);

		var response = view.getResponse();

		view.update(response)
			.then(function() {
				games.addListenersToImages(newData, 0);
			});

		pagination.init(games, data);
	}

	games.loadMore = function (startIndex, data) {
		var view = games.view;
		view.append(data)
			.then(function() {
				games.addListenersToImages(data['view']['data'], startIndex);
			});
	}

	games.addListenersToImages = function (data, startIndex) {
		var imageSelector = $('#imageContainer').find('._img');
		for (var i = startIndex; i < imageSelector.length; i++) {
			$(imageSelector[i]).on('mouseenter', function () {
				var gamesDetail = $(this).find('._gamesDetail');
				gamesDetail.removeClass('hide');

				var gamesDiscount = $(this).find('._discountPercent');
				if (gamesDiscount) {
					gamesDiscount.addClass('hide');
				}
			});
			$(imageSelector[i]).on('mouseleave', function () {
				var gamesDetail = $(this).find('._gamesDetail');
				gamesDetail.addClass('hide');

				var gamesDiscount = $(this).find('._discountPercent');
				if (gamesDiscount) {
					gamesDiscount.removeClass('hide');
				}
			});
			$(imageSelector[i]).on('click', function () {
				var index = $(this).data('index');
				gameSummary.render(data['games'][index - startIndex]);
			});
		}
	}

	games.preloadImagesByIndex = function (newData, start, end) {
		for (var i=start; i < end; i++) {
			var temp = new Array();
			var images = new Array();

			for(var j=0; j < newData['games'][i]['screenshots'].length; j++) {
				temp.push(newData['games'][i]['screenshots'][j]['path_full']);
			}

			for (var i = 0; i < images.length; i++) {
				images[i] = new Image();
				images[i].src = images[i];
			}
		}
	}

	return games;
});