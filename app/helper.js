'use strict';

var Q = require('q');
var _ = require('underscore');
var request = require('request');

var Helper = {};

Helper.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Helper.compareGames = function (a,b) {
  if (a.playtime_forever < b.playtime_forever)
    return 1;
  if (a.playtime_forever > b.playtime_forever)
    return -1;
  return 0;
}

module.exports = Helper;