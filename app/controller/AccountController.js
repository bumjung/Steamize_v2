'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var AccountController = function (Redis) {
	this.Redis = Redis;
	this.Redis.setExpireTime(60 * 60 * 12);
};

AccountController.prototype = _.extend(BaseController.prototype, {
	getOwnedGames: function (steamId) {	
		var url = URL.getOwnedGames(steamId);
		
		return this.sendRequest(url, 'getOwnedGames_'+steamId).then(function (body) {
            var body = JSON.parse(body);
            return body['response']['games'];
        });
	}
});

module.exports = AccountController;