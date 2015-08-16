'use strict';

var Q = require('q');
var _ = require('underscore');

var BaseController = require('./BaseController');
var URL = require('../steamUrl');

var GameReviewController = function (Redis) {
    this.Redis = Redis;
    // cache for 1 week
    this.Redis.setExpireTime(60 * 60 * 24 * 7);
};

GameReviewController.prototype = _.extend(BaseController.prototype, {
    getGameReview: function (gameList, appId) {
    	var self = this;
        var url = URL.getGameReview(appId);

        return this.sendRequest(url, 'getGameReview_'+appId).then(function (body) {
        	var body = JSON.parse(body);
        	var parsedReview = self.parseReviewHtml(body['html']);
        	parsedReview['appId'] = appId;


        	var response = {
        		success: 1, 
        		view: {
        			data: {
        				reviews: parsedReview
        			},
        			template: '/src/core/mvc/view/gameReview.ejs'
        		}
        	}

        	return response;
        });
    },

    parseReviewHtml: function (data) {
		var reviews = [];

		var re = /<div class="content">([\s\S]*?)<div/gm;
		var count = 0;
		var match = re.exec(data);

		while(match) { 
			reviews[count] = {};
			reviews[count]['content'] = match[1].trim();
			count++;
			match = re.exec(data);
		};

		count = 0;
		var re = /<img src="http:\/\/store.akamai.steamstatic.com\/public\/shared\/images\/userreviews\/([\s\S]*?)"/gm;
		match = re.exec(data);
		while(match) {
			if (match[1].trim() === 'icon_thumbsUp_v6.png') {
				reviews[count]['review'] = 'positive';
			} else {
				reviews[count]['review'] = 'negative';
			}
			count++;
			match = re.exec(data);
		};

		return reviews;
    }
});

module.exports = GameReviewController;