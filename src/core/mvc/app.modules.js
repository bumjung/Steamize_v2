define([
		'./config',
		'./service/SteamServices',
		'./controller/AchievementController',
		'./controller/FriendsController',
		'./controller/GameController',
		'./controller/ProfileController'
	], function(config, steamService, achievementController, friendsController, gameController, profileController){
	'use strict'

	var app = angular.module('mainApp', ['ngRoute']);
	app.config(config);

	app.service('SteamService', ['$http', steamService]);

	app.controller('AchievementController', achievementController)
		.controller('FriendsController', friendsController)
		.controller('GameController', gameController)
		.controller('ProfileController', profileController);
});