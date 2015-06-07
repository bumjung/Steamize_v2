'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');
var key 	= require('../config/key').key;
var database = require('../app/database');

var API_URL_USER = 'http://api.steampowered.com/ISteamUser';
var API_URL_STATS = 'http://api.steampowered.com/ISteamUserStats';
var API_URL_PLAYER = 'http://api.steampowered.com/IPlayerService';

function saveGameSchema(appId) {
    return database.checkGameSchemaExists(Q, appId)
    .then(function (exists) {
        if(!exists) {
            var url = API_URL_STATS + '/GetSchemaForGame/v2/?key='+key+'&appid='+appId;

            sendRequest(url)
            .then(function (body) {
                var body = JSON.parse(body);
                var response = {
                    appId: appId
                }
                if (body.game && body.game.availableGameStats) {
                    response['achievements'] = body.game.availableGameStats.achievements;
                } else {
                    response['achievements'] = [];
                }

                return database.saveGameSchema(Q, response);
            });
        } else {
            return false;
        }
    });
}

function sendRequest(url) {
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

var routes = function (app, router){
	// application -------------------------------------------------------------
	app.get('/', function (req, res) {
	    res.render('index.html');
	});

	// routes ======================================================================

    // middleware to use for all requests
    router.use(function (req, res, next) {
        // do logging
        console.log('Something is happening.');
        next();
    });

    router.route('/id/:steam_id')
        .get(function (req, res) {
            var url = API_URL_USER + '/GetPlayerSummaries/v0002/?key='+key+'&steamids='+req.params.steam_id;
            
            sendRequest(url).then(function (body) {
                res.json(JSON.parse(body));
            });
        });

    router.route('/id/:steam_id/friends')
        .get(function (req, res) {
            var url = API_URL_USER + '/GetFriendList/v0001/?key='+key+'&steamid='+req.params.steam_id+'&relationship=friend';
            
            sendRequest(url).then(function (body){
                res.json(JSON.parse(body));
            });
        });

    router.route('/id/:steam_id/games')
        .get(function (req,res) {
            var url = API_URL_PLAYER + '/GetOwnedGames/v0001/?key='+key+'&steamid='+req.params.steam_id+'&include_appinfo=1';

            sendRequest(url).then (function (body){
                var body = JSON.parse(body);
                var games = body.response.games;

                var promises = [];
                for (var i = 0; i < games.length; i++) {
                    if (games[i].has_community_visible_stats) {
                        (function (i) {
                            promises.push(
                                saveGameSchema(games[i].appid)
                            );
                            
                            var url = API_URL_STATS + '/GetPlayerAchievements/v0001/?appid='+games[i].appid+'&key='+key+'&steamid='+req.params.steam_id;
                            
                            promises.push(
                                sendRequest(url)
                                .then(function (body) {
                                    var body = JSON.parse(body);
                                    var response = {
                                        name: body.playerstats.gameName,
                                        app_id: games[i].appid,
                                        achievements: body.playerstats.achievements
                                    };
                                    return response;
                                })
                            );
                        }(i));
                    }
                }

                var result = [];

                Q.allSettled(promises).then(function (arr) {
                    result = arr.map(function (arr){
                        if(arr.state === 'fulfilled') {
                            return arr.value;
                        }
                    });

                    res.json(_.compact(result));
                });
            });
        });

    router.route('/id/:steam_id/:app_id')
        .get(function (req,res) {
            var url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid='+req.params.app_id+'&key='+key+'&steamid='+req.params.steam_id;

            sendRequest(url).then(function (body){
                res.json(JSON.parse(body));
            });
        });

    app.use('/api', router);

};

module.exports = routes;