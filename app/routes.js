'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');
var key 	= require('../config/key').key;
var database = require('../app/database');
var URL = require('../config/steamUrl');
var hp = require('./helper.js');

function saveGameSchema(appId) {
    return database.checkGameSchemaExists(appId).then(function (exists) {
        if(!exists) {
            var url = URL.getSchemaForGame(appId);

            hp.sendRequest(url).then(function (body) {
                var body = JSON.parse(body);
                var response = {
                    appId: appId
                }
                if (body.game && body.game.availableGameStats) {
                    response['achievements'] = body.game.availableGameStats.achievements;
                } else {
                    response['achievements'] = [];
                }

                return database.saveGameSchema(response);
            });
        } else {
            return false;
        }
    });
}
function getUserGameSchemas(promise) {
    var getSchemaPromises = _.map(promise, function (arr) {
        if(arr.state === 'fulfilled' && arr.value) {
            return database.getGameSchema(arr.value.appId).then(function (schema) {
                _.map(schema.achievements, function (achievement) {
                    achievement['achieved'] = arr.value[achievement['name']];
                });

                return schema;
            });
        }
    });
    return Q.all(getSchemaPromises);
}
function getPlayerAchievements(appId, steamId) {
    var url = URL.getPlayerAchievements(appId, steamId);
    
    return hp.sendRequest(url).then(function (body) {
        var body = JSON.parse(body);

        var response = {
            name: body.playerstats.gameName,
            appId: appId
        };

        _.map(body.playerstats.achievements, function (achievement) {
            response[achievement['apiname']] = achievement['achieved'];
        });
        
        return response;
    })
}
function getAppDetails(appId) {
    var url = URL.getAppDetails(appId);

    return hp.sendRequest(url).then(function (body){
        var body = JSON.parse(body);

        return body[appId]['data'];
    });
}


var routes = function (app, router, Account) {
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
        .post(function (req, res){
            Account._init(req.params.steam_id).then(function () {
                // redirect to /id/:steam_id
                res.json({
                    success: 1,
                    redirect: '/id/'+Account.getSteamId()
                });
            });
        })

        .get(function (req, res) {
            var url = URL.getPlayerSummaries(req.params.steam_id);
            hp.sendRequest(url).then(function (body) {
                res.json(JSON.parse(body));
            });
        });

    router.route('/id/:steam_id/friends')
        .get(function (req, res) {
            var url = URL.getFriendsList(req.params.steam_id);
            hp.sendRequest(url).then(function (body) {
                res.json(JSON.parse(body));
            });
        });

    router.route('/id/:steam_id/games')
        .get(function (req,res) {
            var games = Account.getGamesList();
            var promises = [];

            for (var i = 0; i < games.length; i++) {
                if (games[i].has_community_visible_stats) {
                    (function (i) {
                        promises.push(
                            saveGameSchema(games[i].appid),
                            getPlayerAchievements(games[i].appid, req.params.steam_id)
                        );
                    }(i));
                }
            }

            var result = [];

            Q.allSettled(promises).then(function (promise) {
                getUserGameSchemas(promise).then(function (schemas) {
                    res.json(_.compact(schemas));
                });
            });
        });

    router.route('/id/:steam_id/gameDetails')
        .get(function (req,res){
            var games = Account.getGamesList();
            var promises = [];

            for (var i = 0; i < games.length; i++) {
                if (games[i].has_community_visible_stats) {
                    (function(i) {
                        promises.push(
                            getAppDetails(games[i].appid)
                        );
                    }(i));
                }
            }

            Q.allSettled(promises).then(function (promise) {
                res.json(promise);
            });
        });

    app.use('/api', router);

};

module.exports = routes;