define([
	'./index.js',
	'./steamize.js'
	], function(index, steamize) {
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

		index: function (sz) {
			$(document).ready(function () {
				index.init(sz.index);
			});
		}
	}

	return startup;
});