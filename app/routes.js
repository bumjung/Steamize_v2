'use strict';

var Q = require('q');
var _ = require('underscore');

var routes = function (app, router, Account, AccountController, ProfileController, FriendsController, GamesController, GamesDetailController) {
	// application -------------------------------------------------------------
	app.get('/', function (req, res) {
	    res.render('index', {view:{}});
	});

    app.get('/:steam_id', function(req, res) {
        var data = {
            steamId: req.params.steam_id
        }

        Account._init(req.params.steam_id, AccountController)
            .then(function () {
                res.render('steamize', {view: data});
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
            ProfileController.getPlayerSummaries(req.params.steam_id)
                .then(function (response) {
                    res.json(response);
                });
        });

    router.route('/id/:steam_id/friends')
        .get(function (req, res) {
            FriendsController.getFriendsList(req.params.steam_id)
                .then(function (response) {
                    res.json(response);
                });
        });

    router.route('/id/:steam_id/games')
        .get(function (req,res) {
            Q.allSettled([GamesController.getFullGameSchema(Account), GamesDetailController.getFullGamesDetail(Account)])
                .spread(function (gameSchema, gamesDetail) {
                    if (gameSchema['state'] === 'fulfilled' && gamesDetail['state'] === 'fulfilled' &&
                        gameSchema['value']['success'] === 1 && gamesDetail['value']['success'] === 1)
                    {
                        gameSchema = gameSchema['value']['data'];
                        gamesDetail = gamesDetail['value']['data'];

                        var response = {
                            success: 1,
                            view: {
                                data: {
                                    games: [],
                                    totalPlayedTime: gameSchema['totalPlayedTime'],
                                    totalAchievementsCompleted: gameSchema['totalAchievementsCompleted'],
                                    totalCost: gamesDetail['totalCost']
                                },
                                template: '/src/core/mvc/view/games.ejs'
                            }
                        };

                        for (var i = 0; i < gameSchema['games'].length; i++) {
                            var tempResponse = gameSchema['games'][i];
                            var appId = gameSchema['games'][i]['appId'];
                            if (gamesDetail['gamesDetail'][appId]) {
                                tempResponse['priceOverview'] = gamesDetail['gamesDetail'][appId]['priceOverview'];
                                tempResponse['platforms'] = gamesDetail['gamesDetail'][appId]['platforms'];
                                tempResponse['metacritic'] = gamesDetail['gamesDetail'][appId]['metacritic'];
                                tempResponse['categories'] = gamesDetail['gamesDetail'][appId]['categories'];
                                tempResponse['genres'] = gamesDetail['gamesDetail'][appId]['genres'];
                                tempResponse['background'] = gamesDetail['gamesDetail'][appId]['background'];
                                
                                response['view']['data']['games'].push(tempResponse);
                            }
                        }

                        res.json(response);
                    }
                });
        });

    app.use('/api', router);

};

module.exports = routes;