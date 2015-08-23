'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');

var BaseController = function () {};

_.extend(BaseController.prototype, {
	sendRequestAndCache: function (url, cacheKey, cacheExpire) {
		var self = this;
		if (cacheKey) {
			return self.Redis.getCache(cacheKey)
	            .then(function (body) {
	                return body;
	            },
	            function () {
	            	return self.sendRequest(url)
		                .then(function (data) {
		                    return self.Redis.setCache(cacheKey, cacheExpire, data);
		                });
	            });
        }

    	return this.sendRequest(url);
	},

	sendRequest: function (url) {
    	return this._sendRequest(url).then(function (body) {
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
