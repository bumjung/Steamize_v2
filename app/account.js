'use strict';

var Q = require('q');
var _ = require('underscore');
var URL = require('../config/steamUrl');

var Account = function() {
	this.steamId = null;
	this.gamesList = [];
}

_.extend(Account.prototype, {

	_init: function(steamId, AccountController) {
		var self = this;
		self.setSteamId(steamId);

		return AccountController.getOwnedGames(steamId)
			.then(function (ownedGames) {
            	self.setGamesList(ownedGames);
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
	}
});

module.exports = Account;