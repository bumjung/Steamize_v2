'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var FriendsController = function () {
};

FriendsController.prototype = _.extend(BaseController.prototype, {
    getFriendsList: function (steamId) {
        var self = this;
        var url = URL.getFriendsList(steamId);
            
        return this.sendRequest(url).then(function (body) {
            body = JSON.parse(body);

            if (body && body['friendslist']) {
                var list = body['friendslist']['friends'];

                var promises = [];

                for (var i = 0; i < list.length; i++) {
                    (function (i) {
                        if (list[i]['relationship'] === 'friend') {
                            promises.push(
                                self.getFriendsDetails(list[i]['steamid'])
                            );
                        }
                    }(i));
                }
            }
            
            return Q.allSettled(promises);
        }).then(function (promise) {
            var result = [];

            for(var i = 0; i < promise.length; i++) {
                if (promise[i]['state'] === 'fulfilled') {
                    result.push(promise[i]['value'])
                }
            }

            if (result.length > 0) {
                return {
                    success: 1,
                    view: {
                        data: { friends: result },
                        template: '/src/core/mvc/view/friends.ejs'
                    }
                };
            } else {
                return { success: 0 };
            }
        });
    },

    getFriendsDetails: function (steamId) {
        var url = URL.getPlayerSummaries(steamId);

        return this.sendRequest(url).then(function (body) {
            body = JSON.parse(body);
            var response = {};

            if (body['response'] && body['response']['players'].length === 1) {
                response = body['response']['players'][0];
            }

            return response;
        });
    }
});

module.exports = FriendsController;