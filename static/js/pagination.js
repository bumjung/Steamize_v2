define([
	'./base.js',
	'./view.js',
	'./games.js'
	], function (base, View, games) {
	'use strict';

	var pagination = {};

	pagination.NEXT_COUNT = 15;
	pagination.index = 0;
	pagination.data = [];

	pagination.init = function (games, data) {
		$.extend(pagination, base);
		pagination.setData(data);
		pagination.setIndex(15);
		pagination.games = games;
		pagination.view = new View('.moreGames');

		pagination.updateLoadMore();
	}

	pagination.render = function (data) {
		var view = pagination.view;
		var pagData = pagination.getData();
		var data = {
			gamesLength: pagData['view']['data']['games'].length,
			index: data
		}
		
		view.setTemplate('/src/core/mvc/view/loadMore.ejs');
		view.setData(data);
		var response = view.getResponse();

		pagination.view.update(response)
			.then(function () {
				$('._loadMore').on('click', function () {
					pagination.next();
				});
			});
	}

	pagination.next = function () {
		var startPagination = pagination.getIndex();
		var nextIndex = pagination.getNextIndex();

		pagination.setIndex(nextIndex);
		pagination.updateGamesList(startPagination);
		pagination.updateLoadMore();
	}

	pagination.updateGamesList = function (startPagination) {
		var data = pagination.getData()['view']['data'];
		var subGames = data['games'].slice(startPagination, pagination.getIndex());
		var view = pagination.view;

		view.setTemplate('/src/core/mvc/view/gamesMore.ejs');
		view.setData({ games: subGames });
		var response = view.getResponse();

		pagination.games.loadMore(startPagination, response);
	}

	pagination.updateLoadMore = function () {
		pagination.render(pagination.getIndex());
	}

	pagination.getNextIndex = function () {
		return Math.min(pagination.getIndex() + pagination.NEXT_COUNT, pagination.getData()['view']['data']['games'].length);
	}

	pagination.getData = function () {
		return pagination.data;
	}
	pagination.getIndex = function () {
		return pagination.index;
	}

	pagination.setData = function (data) {
		pagination.data = data;
	}
	pagination.setIndex = function (index) {
		pagination.index = index;
	}

	return pagination;
});