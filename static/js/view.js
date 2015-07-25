define([], function () {
	'use strict';

	var view = function (name) {
		this.el = name;
		this.template = '';
		this.data = {};
       	$(this.el).html('waiting...');
	};

	$.extend(view.prototype, {
		update: function (v) {
			var dfd = $.Deferred();
			var self = this;
			
			if(v.view.template) {
				$.get(v.view.template, function (template) {
					var func = ejs.compile(template);
		           	var html = func(v.view.data);
		           	$(self.el).html(html);
		           	dfd.resolve(true);
			    });
			} else {
				$(self.el).html("Error loading template...");
				dfd.resolve(false);
			}

			return dfd.promise();
		},

		append: function (v) {
			var dfd = $.Deferred();
			var self = this;
			
			if(v.view.template) {
				$.get(v.view.template, function (template) {
					var func = ejs.compile(template);
		           	var html = func(v.view.data);
		           	$(self.el).append(html);
		           	dfd.resolve(true);
			    });
			} else {
				$(self.el).html("Error loading template...");
				dfd.resolve(false);
			}

			return dfd.promise();
		},

		getResponse: function () {
			return {
				success: 1,
				view: {
					data: this.data,
					template: this.template
				}
			};
		},

		getTemplate: function () {
			return this.template;
		},

		getData: function () {
			return this.data;
		},

		setTemplate: function (template) {
			this.template = template;
		},

		setData: function (data) {
			this.data = data;
		}
	});

	return view;
});