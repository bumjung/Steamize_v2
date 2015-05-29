'use strict';
	angular
		.module('mainApp')
		.controller('ProfileController', ['$scope', 'SteamService', 
			function ($scope, SteamService){
				$scope.test = "init";
			}]);