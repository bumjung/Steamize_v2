'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');
var database = require('../database');

var AccountController = function (Redis) {
	this.Redis = Redis;
	this.Redis.setExpireTime(60 * 60 * 12);
};

AccountController.prototype = _.extend(BaseController.prototype, {
	getSteamIdNumberFromString: function (steamId) {
		var self = this;

		return database.checkSteamIdNumberFromStringExists(steamId)
			.then(function (exists) {
				if (exists) {
					return database.getSteamIdNumberFromString(steamId);
				} else {
					var url = URL.getSteamIdNumberFromString(steamId);

					return self.sendRequest(url, 'getSteamIdNumberFromString_'+steamId).then(function (body) {
            			var body = JSON.parse(body);

            			if (body['response'] && body['response']['success'] === 1) {
            				return database.saveSteamIdNumberFromString(steamId, body['response']['steamid']);
            			} else {
            				var regex = /^([0-9]){17}$/;
            				if (regex.test(steamId)) {
            					return steamId;
            				} else {
            					return -1;
            				}
            			}
					});
				}
			});
	},

	getOwnedGames: function (steamId) {	
		var url = URL.getOwnedGames(steamId);
		
		return this.sendRequest(url, 'getOwnedGames_'+steamId).then(function (body) {
            var body = JSON.parse(body);
            return body['response']['games'];
        });
	}
});

module.exports = AccountController;