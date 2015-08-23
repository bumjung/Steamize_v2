'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../steamUrl');

var ProfileController = function (Redis) {
    this.Redis = Redis;
    // cache for 5 minutes
    this.CACHE_EXPIRE = 60 * 5;
};

ProfileController.prototype = _.extend(BaseController.prototype, {
	getPlayerSummaries: function (steamId) {
        var self = this;
        var url = URL.getPlayerSummaries(steamId);
        
        return this.sendRequestAndCache(url, 'getPlayerSummaries_'+steamId, self.CACHE_EXPIRE).then(function (body) {
            body = JSON.parse(body);

            if (body['response'] && body['response']['players'].length === 1) {
                var response = {};
                var data = body['response']['players'][0];

                response['avatarfull']      = data['avatarfull'];
                response['personaname']     = data['personaname'];
                response['personastate']    = data['personastate'];
                response['steamid']         = data['steamid'];

                return {
                    success: 1,
                    view: {
                        data: response,
                        template: '/src/core/mvc/view/profile.ejs'
                    }
                };
            } else {
                return { success: 0 };
            }
        });
    }
});

module.exports = ProfileController;