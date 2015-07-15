'use strict';

var Q = require('q');
var _ = require('underscore');

var routes = function (app, router, Redis, Account, AccountController, ProfileController, FriendsController, GamesController, GamesDetailController) {
	// application -------------------------------------------------------------
	app.get('/', function (req, res) {
	    res.render('index');
	});

    app.get('/id/:steam_id', function(req, res) {
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
            GamesController.getFullGameSchema(Account)
                .then(function (response) {
                    res.json(response);
                });
        });

    router.route('/id/:steam_id/gameDetails')
        .get(function (req,res){
            GamesDetailController.getFullGamesDetail(Redis, Account)
                .then(function (response) {
                    res.json(response);
                });
        });

    app.use('/api', router);

};

module.exports = routes;