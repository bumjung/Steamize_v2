'use strict';

var profileController = function($scope){
	this.$scope= $scope;
	init();
}

$.extend(profileController.prototype, {
	init: function(){
		this.$scope.test = "hello";
	}
});
