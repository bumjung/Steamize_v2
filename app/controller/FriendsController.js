'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var FriendsController = function (Redis) {
    this.Redis = Redis;
};

FriendsController.prototype = _.extend(BaseController.prototype, {
    getFriendsList: function (steamId) {
        var self = this;
        var url = URL.getFriendsList(steamId);
            
        return this.sendRequest(url).then(function (body) {
            body = JSON.parse(body);
            var friends = [];

            if (body && body['friendslist']) {
                var list = body['friendslist']['friends'];

                for (var i = 0; i < list.length; i++) {
                    if (list[i]['relationship'] === 'friend') {
                        friends.push(list[i]['steamid']);
                    }
                }
            }

            return self.getFriendsDetails(friends.join());
        }).then(function (promise) {
            var result = [];

            if (promise.length > 0) {
                return {
                    success: 1,
                    view: {
                        data: { friends: promise },
                        template: '/src/core/mvc/view/friends.ejs'
                    }
                }
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

            if (body['response'] && body['response']['players'].length > 0) {
                response = body['response']['players'];
            }

            return response;
        });
    }
});

module.exports = FriendsController;