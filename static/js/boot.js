define([
	'./summary.js'], function(summary) {
	var boot = {
		load: function (sz) {
			// dynamically call
			this.summary(sz);
		},

		summary: function (sz) {
			$(document).ready(function () {
				summary.init(sz.summary);
			});
		},

		index: function () {
			$(document).ready(function () {
				index.init(sz.index);
			});
		}
	}

	return boot;
});