define([
	'./steamize.js'], function(steamize) {
	var startup = {
		load: function (sz) {
			var fcn = this[$('body').data('name')];
			fcn(sz);
		},

		steamize: function (sz) {
			$(document).ready(function () {
				steamize.init(sz.steamize);
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