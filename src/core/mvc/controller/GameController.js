'use strict';

var gameController = function($scope, SteamService) {
	this.$scope = $scope;
	init();
}

$.extend(gameController.prototype, {
	init: function(){}
});
