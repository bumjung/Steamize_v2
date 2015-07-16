'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var GamesDetailController = function (Redis) {
    this.Redis = Redis;
    this.Redis.setExpireTime(60 * 60 * 24);
};

GamesDetailController.prototype = _.extend(BaseController.prototype, {
    getFullGamesDetail: function (Account) { 
        var self = this;
        var games = Account.getGamesList();
        var promises = [];

        for (var i = 0; i < games.length; i++) {
            (function(i) {
                promises.push(
                    self.getAppDetails(games[i]['appid'])
                );
            }(i));
        }

        return Q.allSettled(promises).then(function (promise) {
            var gamesDetailData = {};
            var costTotal = 0;

            for(var i = 0; i < promise.length; i++) {
                var value = promise[i]['value'];

                if(promise[i]['state'] === 'fulfilled' && value) {
                    var priceOverview = value['price_overview'] ? value['price_overview'] : { currency: 'USD', initial: 0, 'final': 0, discount_percent: 0};
                    priceOverview['initial'] /= 100;
                    priceOverview['final'] /= 100; 
                    var platforms = value['platforms'] ? value['platforms'] : {};
                    var metacritic = value['metacritic'] ? value['metacritic'] : { score: -1 };
                    var categories = value['categories'] ? value['categories'] : {};
                    var genres = value['genres'] ? value['genres'] : {};
                    var background = value['background'] ? value['background'] : {};      
                    
                    // final cost may contain discount value
                    costTotal += priceOverview['initial'];

                    gamesDetailData[value['steam_appid']] = {
                        name: value['name'],
                        priceOverview: priceOverview,
                        platforms: platforms,
                        metacritic: metacritic,
                        categories: categories,
                        genres: genres,
                        background: background
                    };
                }
            };

            if (!_.isEmpty(gamesDetailData)) {
                return {
                    success: 1,
                    data: { 
                        gamesDetail: gamesDetailData,
                        totalCost: Math.round(costTotal * 100) / 100
                    }
                };
            } else {
                return { success: 0 };
            }
        });
    },


    getAppDetails: function (appId) {
        var self = this;
        var url = URL.getAppDetails(appId);

        return self.sendRequest(url, 'getAppDetails_'+appId).then(function (body) {
            var body = JSON.parse(body);
            return body[appId]['data'];
        });
    }
});

module.exports = GamesDetailController;
