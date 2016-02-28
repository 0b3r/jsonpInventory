(function(){

'use strict';

angular
	.module('jsonpApp')
	.service('CompareService', ['BroadcastService', function(BroadcastService){

		var compareItems = [];

		this.add = function(item){
			compareItems.push(item);
			BroadcastService.send('compare.update', compareItems);
			console.log(item);
		};

		this.get = function(){
			return compareItems;
		};

		this.reset = function(){
			compareItems = [];
			BroadcastService.send('compare.update', compareItems);
		};
	}]);
})();