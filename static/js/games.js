define([
	'./base.js',
	'./view.js',
	'./pagination.js'
	], function (base, View, pagination) {
	'use strict';

	var games = {};

	games.init = function () {
		$.extend(games, base);
		games.view = new View('#imageContainer');
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
				games.addListenersToImages(0);
			});

		pagination.init(games, data);
	}

	games.loadMore = function (startIndex, data) {
		var view = games.view;
		view.append(data)
			.then(function() {
				games.addListenersToImages(startIndex);
			});
	}

	games.addListenersToImages = function (startIndex) {
		var imageSelector = $('#imageContainer').find('._img');
		for (var i = startIndex; i < imageSelector.length; i++) {
			$(imageSelector[i]).on('mouseenter', function () {
				var gamesDetail = $(this).children('._gamesDetail');
				gamesDetail.removeClass('hide');
			});
			$(imageSelector[i]).on('mouseleave', function () {
				var gamesDetail = $(this).children('._gamesDetail');

				gamesDetail.addClass('hide');
			});
		}
	}

	return games;
});