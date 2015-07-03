'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../../config/steamUrl');

var ProfileController = function () {
};

ProfileController.prototype = _.extend(BaseController.prototype, {
	getPlayerSummaries: function (steamId) {
        var url = URL.getPlayerSummaries(steamId);
        
        return this.sendRequest(url).then(function (body) {
            body = JSON.parse(body);

            if (body['response'] && body['response']['players'].length === 1) {
                return {
                    success: 1,
                    view: {
                        data: body['response']['players'][0],
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