define([
	'./base.js'
	], function (base) {
	'use strict';

	var history = {};

	history.init = function (games, gameSummary) {
		$.extend(history, base);

		window.onpopstate = function(e){
		    if (e.state && !e.state.showLibrary) {
		    	games.hideLibrary();
		    	if (!gameSummary.isRendered()) {
					sz.steamize.page = 'gameSummary';
		    		gameSummary.render(e.state.data);
		    	}
		    } else {
		    	games.showLibrary();
		    }
		};
	}

	history.isRenderGameSummary = function () {
		return sz.steamize.page === 'gameSummary';
	}

	history.setHistory = function (data) {
		// if user directly linked to appid, don't set history
		if (sz.steamize.page !== 'gameSummary') {
			window.history.pushState({showLibrary : false, data: data}, "", sz.steamize.url+'/'+data['appId']);
		} else {
			// your work is finished
			sz.steamize.page = '';
		}
	}

	return history;
});