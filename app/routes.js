'use strict';

var Q = require('q');
var _ = require('underscore');

var routes = function (app, router, Account, AccountController, ProfileController, FriendsController, GamesController, GamesDetailController, GameReviewController) {
	// application -------------------------------------------------------------
	app.get('/', function (req, res) {
	    res.render('index', {view:{}});
	});

    app.get('/:steam_id', function(req, res) {
        var steamId = req.params.steam_id;
        AccountController.getSteamIdNumberFromString(steamId)
            .then(function (steamNumId) {
                var data = {};
                if (steamNumId === -1) {
                    res.status(404)
                        .send('Not found');
                } else {
                    data['steamId'] = steamNumId;
                }

                Account._init(data['steamId'], AccountController)
                    .then(function () {
                        res.render('steamize', {view: data});
                    });
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
            Account.setSteamId(req.params.steam_id);
            ProfileController.getPlayerSummaries(req.params.steam_id)
                .then(function (response) {
                    res.json(response);
                });
        });

    router.route('/id/:steam_id/friends')
        .get(function (req, res) {
            Account.setSteamId(req.params.steam_id);
            FriendsController.getFriendsList(req.params.steam_id)
                .then(function (response) {
                    res.json(response);
                });
        });

    router.route('/id/:steam_id/games')
        .get(function (req,res) {
            Account.setSteamId(req.params.steam_id);
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
                                tempResponse['description']     = gamesDetail['gamesDetail'][appId]['description'];
                                tempResponse['priceOverview']   = gamesDetail['gamesDetail'][appId]['priceOverview'];
                                tempResponse['platforms']       = gamesDetail['gamesDetail'][appId]['platforms'];
                                tempResponse['metacritic']      = gamesDetail['gamesDetail'][appId]['metacritic'];
                                tempResponse['categories']      = gamesDetail['gamesDetail'][appId]['categories'];
                                tempResponse['genres']          = gamesDetail['gamesDetail'][appId]['genres'];
                                tempResponse['screenshots']     = gamesDetail['gamesDetail'][appId]['screenshots'];
                                tempResponse['recommendations'] = gamesDetail['gamesDetail'][appId]['recommendations'];
                                
                                response['view']['data']['games'].push(tempResponse);
                            }
                        }

                        res.json(response);
                    }
                });
        });

        router.route('/id/:steam_id/reviews/:appId')
            .get(function (req,res) {
                Account.setSteamId(req.params.steam_id);
                var gamesList = Account.getGamesList();

                GameReviewController.getGameReview(gamesList, req.params.appId)
                    .then(function (response) {
                        res.json(response);
                    });
            });

    app.use('/api', router);

};

module.exports = routes;