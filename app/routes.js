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
        if (!exists) {
            var url = URL.getSchemaForGame(appId);

            hp.sendRequest(url).then(function (body) {
                var body = JSON.parse(body);
                var response = {
                    appId: appId
                }
                if (body['game'] && body['game']['availableGameStats']) {
                    response['achievements'] = body['game']['availableGameStats']['achievements'];
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
        if (arr['state'] === 'fulfilled' && arr['value']) {
            return database.getGameSchema(arr['value']['appId']).then(function (schema) {
                _.map(schema['achievements'], function (achievement) {
                    achievement['achieved'] = arr['value'][achievement['name']];
                });
                return {
                    name: arr['value']['name'],
                    playtime_forever: arr['value']['playtime_forever'],
                    appId: schema['appId'],
                    achievements: schema['achievements']
                };
            });
        }
    });
    return Q.all(getSchemaPromises);
}
function getPlayerAchievements(game, steamId) {
    var url = URL.getPlayerAchievements(game['appid'], steamId);

    return hp.sendRequest(url).then(function (body) {
        var body = JSON.parse(body);
        var response = {
            name: body['playerstats']['gameName'],
            playtime_forever: game['playtime_forever'],
            appId: game['appid']
        };

        _.map(body.playerstats.achievements, function (achievement) {
            response[achievement['apiname']] = achievement['achieved'];
        });
        
        return response;
    })
}
function getAppDetails(appId) {
    var url = URL.getAppDetails(appId);

    return hp.sendRequest(url).then(function (body) {
        var body = JSON.parse(body);

        return body[appId]['data'];
    });
}

function getFriendsDetails(steamId) {
    var url = URL.getPlayerSummaries(steamId);
    return hp.sendRequest(url).then(function (body) {
        body = JSON.parse(body);
        var response = {};

        if (body['response'] && body['response']['players'].length === 1) {
            response = body['response']['players'][0];
        }

        return response;
    });
}

var routes = function (app, router, Account) {
	// application -------------------------------------------------------------
	app.get('/', function (req, res) {
	    res.render('index');
	});

    app.get('/id/:steam_id', function(req, res) {
        var data = {
            steamId: req.params.steam_id
        }

        Account._init(req.params.steam_id).then(function () {
            res.render('summary', {view: data});
        });
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
            var url = URL.getPlayerSummaries(req.params.steam_id);
            
            hp.sendRequest(url).then(function (body) {
                    body = JSON.parse(body);

                    if (body['response'] && body['response']['players'].length === 1) {
                        res.json({
                            success: 1,
                            view: {
                                data: body['response']['players'][0],
                                template: '/src/core/mvc/view/profile.ejs'
                            }
                        });
                    } else {
                        res.json({ success: 0 });
                    }
                });
        });

    router.route('/id/:steam_id/friends')
        .get(function (req, res) {
            var url = URL.getFriendsList(req.params.steam_id);
            
            hp.sendRequest(url).then(function (body) {
                body = JSON.parse(body);

                if (body && body['friendslist']) {
                    var list = body['friendslist']['friends'];

                    var promises = [];

                    for (var i = 0; i < list.length; i++) {
                        (function (i) {
                            if (list[i]['relationship'] === 'friend') {
                                promises.push(
                                    getFriendsDetails(list[i]['steamid'])
                                );
                            }
                        }(i));
                    }


                    Q.allSettled(promises).then(function (promise) {
                        var result = [];

                        for(var i = 0; i < promise.length; i++) {
                            if (promise[i]['state'] === 'fulfilled') {
                                result.push(promise[i]['value'])
                            }
                        }

                        if (result.length > 0) {
                            res.json({
                                success: 1,
                                view: {
                                    data: { friends: result },
                                    template: '/src/core/mvc/view/friends.ejs'
                                }
                            });
                        } else {
                            res.json({ success: 0 })
                        }
                    });
                }
            });
        });

    router.route('/id/:steam_id/games')
        .get(function (req,res) {
            var games = Account.getGamesList();
            var promises = [];

            for (var i = 0; i < games.length; i++) {
                if (games[i]['has_community_visible_stats']) {
                    (function (i) {
                        promises.push(
                            saveGameSchema(games[i]['appid']),
                            getPlayerAchievements(games[i], req.params.steam_id)
                        );
                    }(i));
                }
            }

            var result = [];

            Q.allSettled(promises).then(function (promise) {
                return getUserGameSchemas(promise)
            }).then(function (schemas) {
                schemas = _.compact(schemas);
                if (schemas.length > 0) {
                    schemas = hp.formatGamesJSON(schemas);

                    res.json({
                        success: 1,
                        view: {
                            data: { games: schemas },
                            template: '/src/core/mvc/view/games.ejs'
                        }
                    });
                } else {
                    res.json({ success: 0 });
                }
            });
        });

    router.route('/id/:steam_id/gameDetails')
        .get(function (req,res){
            var games = Account.getGamesList();
            var promises = [];

            for (var i = 0; i < games.length; i++) {
                if (games[i]['has_community_visible_stats']) {
                    (function(i) {
                        promises.push(
                            getAppDetails(games[i]['appid'])
                        );
                    }(i));
                }
            }

            Q.allSettled(promises).then(function (promise) {
                var gamesDetailData = _.map(promise, function (arr) {
                    var value = arr['value'];
                    if(arr['state'] === 'fulfilled' && value) {
                        return {
                            id: value['steam_appid'],
                            name: value['name'],
                            price_overview: value['price_overview'],
                            platforms: value['platforms'],
                            metacritic: value['metacritic'],
                            categories: value['categories'],
                            genres: value['genres'],
                            background: value['background']
                        }
                    } else {
                        return false;
                    }
                });
                
                gamesDetailData = _.compact(gamesDetailData);

                if(gamesDetailData.length > 0) {
                    res.json({
                        success: 1,
                        view: {
                            data: { gamesDetail: gamesDetailData },
                            template: '/src/core/mvc/view/gamesDetail.ejs'
                        }
                    });
                } else {
                    res.json({ success: 0 });
                }
            });
        });

    app.use('/api', router);

};

module.exports = routes;