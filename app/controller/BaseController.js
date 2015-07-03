'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');

var BaseController = function () {};

_.extend(BaseController.prototype, {

	sendRequest: function (url) {
	    var deferred = Q.defer();

	    request(url, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            deferred.resolve(body);
	        } else {
	            deferred.reject(false);
	        }
	    });

	    return deferred.promise;
	}
});

module.exports = BaseController;
