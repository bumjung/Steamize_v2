'use strict';

var Q = require('q');

var Redis = function (client) {
	this.client = client;
};

Redis.EXPIRE_TIME = 60 * 60 * 24;

Redis.prototype.setCache = function (key, value) {
	var deferred = Q.defer();

	this.client.setex(key, Redis.EXPIRE_TIME, JSON.stringify(value), function () {
		deferred.resolve(true);
	});

	return deferred.promise;
}

Redis.prototype.getCache = function (key) {
	var deferred = Q.defer();

	this.client.get(key, function (err, data) {
		if (data) {
			deferred.resolve(data);
		} else {
			deferred.reject(false);
		}
	});

	return deferred.promise;
}


module.exports = Redis;