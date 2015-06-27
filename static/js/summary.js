define([], function () {
	'use strict';

	var summary = {};

	summary.init = function(data) {
		$.extend(summary, data);

		summary.getProfileData(summary.steamId)
			.then(function(data) {
				console.log(data);
			});
	}

	summary.getProfileData = function(steamId) {
		var dfd = $.Deferred();

		$.ajax({
			'url': '/api/id/'+ summary.steamId,
			'type': 'GET'
		})
		.done(function (data, textStatus, jqXHR) {
			dfd.resolve(data);
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			dfd.reject(errorThrown);
		});

		return dfd.promise();
	}
	return summary;
});