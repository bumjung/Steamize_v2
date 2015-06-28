define([
	'./summary.js'], function(summary) {
	var startup = {
		load: function (sz) {
			var fcn = this[$('body').data('name')];
			fcn(sz);
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

	return startup;
});