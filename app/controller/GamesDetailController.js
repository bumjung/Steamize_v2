'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var GamesDetailController = function () {
};

GamesDetailController.prototype = _.extend(BaseController.prototype, {
    getFullGamesDetail: function (Account) { 
        var self = this;   
        var games = Account.getGamesList();
        var promises = [];

        for (var i = 0; i < games.length; i++) {
            if (games[i]['has_community_visible_stats']) {
                (function(i) {
                    promises.push(
                        self.getAppDetails(games[i]['appid'])
                    );
                }(i));
            }
        }

        return Q.allSettled(promises).then(function (promise) {
            var gamesDetailData = [];
            var costTotal = 0;

            for(var i = 0; i < promise.length; i++) {
                var value = promise[i]['value'];

                if(promise[i]['state'] === 'fulfilled' && value) {
                    var priceOverview = value['price_overview'] ? value['price_overview'] : { currency: 'USD', inital: 0, 'final': 0, discount_percent: 0};
                    var platforms = value['platforms'] ? value['platforms'] : {};
                    var metacritic = value['metacritic'] ? value['metacritic'] : { score: -1 };
                    var categories = value['categories'] ? value['categories'] : {};
                    var genres = value['genres'] ? value['genres'] : {};
                    var background = value['background'] ? value['background'] : {};      
                    
                    costTotal += priceOverview['final'];

                    gamesDetailData.push({
                        id: value['steam_appid'],
                        name: value['name'],
                        priceOverview: priceOverview,
                        platforms: platforms,
                        metacritic: metacritic,
                        categories: categories,
                        genres: genres,
                        background: background
                    });
                }
            };

            if(gamesDetailData.length > 0) {
                return {
                    success: 1,
                    view: {
                        data: { 
                            gamesDetail: gamesDetailData,
                            totalCost: (costTotal/100)
                        },
                        template: '/src/core/mvc/view/gamesDetail.ejs'
                    }
                };
            } else {
                return { success: 0 };
            }
        });
    },


    getAppDetails: function (appId) {
        var url = URL.getAppDetails(appId);

        return this.sendRequest(url).then(function (body) {
            var body = JSON.parse(body);
            return body[appId]['data'];
        });
    }
});

module.exports = GamesDetailController;
