define([], function () {
	'use strict';

	var index = {};

	index.init = function(data){
		$.extend(index, data);
	}

	index.submit = function(steamID) {
			var submitForm = $('#steamIDForm');
			var submitInput = submitForm.find('.steamIDInput');

			window.location.href = '/id/'+submitInput.val();
		}
});