'use strict';

if(process.env.NODE_ENV == 'dev') {
	var key = require('../config/key').key;
} else {
	var key = process.env.STEAM_KEY;
}

var URL = {
	API_URL_USER: 'http://api.steampowered.com/ISteamUser',
	API_URL_STATS: 'http://api.steampowered.com/ISteamUserStats',
	API_URL_PLAYER: 'http://api.steampowered.com/IPlayerService',
	API_URL_API: 'http://store.steampowered.com/api',
	API_URL_REVIEW: 'http://store.steampowered.com/appreviews',	

	getSteamIdNumberFromString: function (steamId) {
		return this.API_URL_USER + '/ResolveVanityURL/v0001/?key='+key+'&vanityurl='+steamId;
	},
	getOwnedGames: function(steamId) {
		return this.API_URL_PLAYER + '/GetOwnedGames/v0001/?key='+key+'&steamid='+steamId+'&include_played_free_games=1&include_appinfo=1';
	},
	getPlayerSummaries: function(steamId) {
		return this.API_URL_USER + '/GetPlayerSummaries/v0002/?key='+key+'&steamids='+steamId;
	},
	getFriendsList: function(steamId) {
		return this.API_URL_USER + '/GetFriendList/v0001/?key='+key+'&steamid='+steamId+'&relationship=friend';
	},
	getPlayerAchievements: function(appId, steamId) {
		return this.API_URL_STATS + '/GetPlayerAchievements/v0001/?appid='+appId+'&key='+key+'&steamid='+steamId;
    },
    getSchemaForGame: function(appId) {
    	return this.API_URL_STATS + '/GetSchemaForGame/v2/?key='+key+'&appid='+appId;
	},
	getAppDetails: function(appId) {
		return this.API_URL_API + '/appdetails/?appids='+appId+'&key='+key+'&cc=US&l=english&v=1%20HTTP/1.1';
	},
	getGameReview: function(appId) {
		return this.API_URL_REVIEW + '/' + appId;
	}
}

module.exports = URL;