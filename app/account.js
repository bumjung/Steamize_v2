'use strict';

var Q = require('q');
var _ = require('underscore');
var URL = require('../config/steamUrl');
var hp = require('./helper.js');

var Account = function() {
	this.steamId = null;
	this.gamesList = [];
	this.whenReady = null;
}

_.extend(Account.prototype, {

	_init: function(steamId) {
		var self = this;
		this.setSteamId(steamId);

		var url = URL.getOwnedGames(steamId);
		
		return hp.sendRequest(url).then(function (body) {
            var body = JSON.parse(body);    
            self.setGamesList(body.response.games);
        });
	},

	getSteamId: function() {
		return this.steamId;
	},

	setSteamId: function(steamId) {
		this.steamId = steamId;
	},

	getGamesList: function() {
		return this.gamesList;
	},

	setGamesList: function(gamesList) {
		this.gamesList = gamesList;
	},

	whenReady: function() {
		return whenReady;
	}
});

module.exports = Account;