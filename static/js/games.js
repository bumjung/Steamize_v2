define([
	'./base.js',
	'./view.js',
	'./pagination.js'
	], function (base, View, pagination) {
	'use strict';

	var games = {};;

	games.init = function () {
		$.extend(games, base);
		games.gamesView = new View('#imageContainer');
	}

	games.render = function (data) {
		var gamesView = games.gamesView;

		pagination.init(games, data);

		gamesView.update(data)
			.then(function() {
				addListenersToImages(0);
			});
	}

	games.loadMore = function (startIndex, data) {
		var gamesView = games.gamesView;
		gamesView.append(data)
			.then(function() {
				addListenersToImages(startIndex);
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