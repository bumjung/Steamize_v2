define([
	'./smz.js'
	], function (smz) {
	'use strict';

	var index = {};

	index.init = function (data) {
		$.extend(index, data);
		smz.initSubmit();
	}

	return index;
});