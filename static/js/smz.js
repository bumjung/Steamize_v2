define([], function () {
	'use strict';

	var smz = {};

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