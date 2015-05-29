'use strict';

angular
    .module('mainApp')
    .service('SteamService', ['$http', steamService]);

function steamService($http){
    return {
        getProfileById : function(id) {
            return $http.get('/api/id/'+id);
        }, 
        getProfileByStrId : function(strId) {
            return $http.get('/api/id/'+strId);
        },
        getFriends : function(id) {
            return $http.get('/api/id/'+id+'/friends');
        },
        getAchievements : function(id){
            return $http.get('/api/id/'+id+'/games');
        },
        getGameStats : function(id, appId){
            return $http.get('/api/id/'+id+'/'+appId);
        }
    };
}