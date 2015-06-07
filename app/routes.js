var request = require('request');
var key 	= require('../config/key').key;
var database = require('../app/database');

var routes = function(app, router){
	// application -------------------------------------------------------------
	app.get('/', function(req, res) {
	    res.render('index.html');
	});

	// routes ======================================================================

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next();
    });

    router.route('/id/:steam_id')
        .get (function(req, res) {
            request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+key+'&steamids='+req.params.steam_id, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            });
        });

    router.route('/id/:steam_id/friends')
        .get (function(req, res) {
            request('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+key+'&steamid='+req.params.steam_id+'&relationship=friend', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            });
        });

    router.route('/id/:steam_id/games')
        .get (function(req,res) {
            request('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+key+'&steamid='+req.params.steam_id+'&include_appinfo=1', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var body = JSON.parse(body);
                    var games = body.response.games;

                    var visibleGames = [];
                    var schemaRequests = 0;
                    var achievementResponses = [];
                    var achievementRequests = 0;

                    for (var i = 0; i < games.length; i++) {
                        if (games[i].has_community_visible_stats) {
                            visibleGames.push(games[i]);
                        }
                    }
                    for (var i = 0; i < visibleGames.length; i++) {
                        (function(i) {
                            database.checkGameSchemaExists(games[i].appid, function(exists) {
                                if(!exists) {
                                    console.log('Adding new Game Schema for: ' + games[i].appid);
                                    request('http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key='+key+'&appid='+games[i].appid, function(error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            var body = JSON.parse(body);
                                            var response = {
                                                appId: games[i].appid
                                            }
                                            if (body.game && body.game.availableGameStats) {
                                                response['achievements'] = body.game.availableGameStats.achievements;
                                            } else {
                                                response['achievements'] = [];
                                            }

                                            database.saveGameSchema(response);
                                        }
                                    });
                                }
                            });

                            request('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid='+games[i].appid+'&key='+key+'&steamid='+req.params.steam_id, function (error, response, body) {
                                achievementRequests++;
                                if (!error && response.statusCode == 200) {
                                    var body = JSON.parse(body);
                                    achievementResponses.push({
                                        name: body.playerstats.gameName,
                                        app_id: games[i].appid,
                                        achievements: body.playerstats.achievements
                                    });
                                }
                                   
                                if (achievementRequests === visibleGames.length) {
                                    res.json(achievementResponses);
                                }
                            });
                        }(i));
                    }
                }
            });
        });

    router.route('/id/:steam_id/:app_id')
        .get (function(req,res) {
            request('http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid='+req.params.app_id+'&key='+key+'&steamid='+req.params.steam_id, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
              }
            });
        });

    app.use('/api', router);

};

module.exports = routes;