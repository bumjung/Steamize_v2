'use strict';

var Q = require('q');

var Redis = function (client) {
	this.client = client;
	this.EXPIRE_TIME = 10;
};

Redis.prototype.setExpireTime = function (time) {
	this.EXPIRE_TIME = time;
}

Redis.prototype.setCache = function (key, value) {
	var deferred = Q.defer();
	var self = this;

	this.client.setex(key, self.EXPIRE_TIME, value, function () {
		deferred.resolve(value);
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