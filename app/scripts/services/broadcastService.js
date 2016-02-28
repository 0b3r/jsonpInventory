(function(){

'use strict';

angular
	.module('jsonpApp')
	.factory('BroadcastService', ['$rootScope', function($rootScope) {
    	return {
        	send: function(msg, data) {
            	$rootScope.$broadcast(msg, data);
        	}
    	};
	}]);

})();