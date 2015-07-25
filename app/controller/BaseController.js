'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');

var BaseController = function () {};

_.extend(BaseController.prototype, {

	sendRequest: function (url, cacheKey) {
		var self = this;
		if (cacheKey) {
			return self.Redis.getCache(cacheKey)
	            .then(function (body) {
	                return body;
	            },
	            function () {
	            	return self._sendRequest(url).then(function (body) {
	                    return body;
	                })
	                .then(function (data) {
	                    return self.Redis.setCache(cacheKey, data);
	                });
	            });
        }

    	return self._sendRequest(url).then(function (body) {
            return body;
        });
	},

	_sendRequest: function (url) {
	    var deferred = Q.defer();

	    request(url, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            deferred.resolve(body);
	        } else {
	            deferred.reject(body);
	        }
	    });

	    return deferred.promise;
	}
});

module.exports = BaseController;
