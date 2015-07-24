define([], function () {
	'use strict';

	var smz = {};

	smz.initSubmit = function () {
		var submitForm = $('#steamIDForm');
		submitForm.on('submit', function (e) {
			e.preventDefault();
			smz.submit();
		});
	}

	smz.submit = function () {
		var submitForm = $('#steamIDForm');
		var submitInput = submitForm.find('.steamIDInput');

		window.location.href = '/'+submitInput.val();
	}

	smz.request = function (url, method) {
		var dfd = $.Deferred();

		$.ajax({
			'url': url,
			'type': 'GET'
			})
			.then(function (data, textStatus, jqXHR) {
				dfd.resolve(data);
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				dfd.reject(errorThrown);
			});

		return dfd.promise();
	}

	return smz;
});