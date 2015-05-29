var request = require('request');
var key 	= require('../config/key').key;

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
        .get(function(req, res){
            request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+key+'&steamids='+req.params.steam_id, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            });
        });

    router.route('/id/:steam_id/friends')
        .get(function(req, res){
            request('http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key='+key+'&steamid='+req.params.steam_id+'&relationship=friend', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                }
            });
        });

    router.route('/id/:steam_id/games')
        .get(function(req,res){
            request('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key='+key+'&steamid='+req.params.steam_id+'&include_appinfo=1', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var body = JSON.parse(body);
                    var games = body.response.games;
                    var responses = [];
                    var completed_requests = 0;
                    var number_of_requests = 0;
                    for(var i = 0; i < games.length; i++){
                        if(games[i].has_community_visible_stats){
                            number_of_requests++;
                        }
                    }
                    for(var i = 0; i < games.length; i++){
                        (function(i){
                            if(games[i].has_community_visible_stats){
                                request('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid='+games[i].appid+'&key='+key+'&steamid='+req.params.steam_id, function (error, response, body) {
                                    completed_requests++;
                                    if (!error && response.statusCode == 200) {
                                        var body = JSON.parse(body);
                                        responses.push({
                                            name: body.playerstats.gameName,
                                            app_id: games[i].appid,
                                            achievements: body.playerstats.achievements});
                                        if(completed_requests === number_of_requests){
                                            res.json(responses);
                                        }
                                    }
                                });
                            }
                        }(i));
                    }
                }
            });
        });

    router.route('/id/:steam_id/:app_id')
        .get(function(req,res){
            request('http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid='+req.params.app_id+'&key='+key+'&steamid='+req.params.steam_id, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
              }
            });
        });

    app.use('/api', router);

};

module.exports = routes;