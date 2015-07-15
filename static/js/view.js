define([], function () {
	'use strict';

	var view = function (name) {
		this.el = name;
       	$(this.el).html('waiting...');
	};

	$.extend(view.prototype, {
		update: function (v) {
			var self = this;
			if(v.view.template) {
				$.get(v.view.template, function (template) {
					var func = ejs.compile(template);
		           	var html = func(v.view.data);
		           	$(self.el).html(html);
			    });
			} else {
				$(self.el).html("Error loading template...");
			}
		}
	});

	return view;
});