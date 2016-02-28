(function(){

'use strict';

var InventoryDetailCtrl = function(InventoryList){
	this.headerText = 'New Lexus for Sale in Edmonton, AB';
  	this.inventory = InventoryList;
  	console.log(this.inventory);
  	this.curPage = 0;
  	this.pageSize = 20;
  
  
  	this.search = {
    	searchQuery: ''
  	};
  
  
  	this.numberOfPages = function(length) {
	 	return Math.ceil((length ? length : this.inventory.length) / this.pageSize);
	};
  
  	this.range = function(n) {
    	return new Array(n);
  	};
};
  
InventoryDetailCtrl.resolve = {
  InventoryList: [
    'JsonpService', 
    function(JsonpService){
      return JsonpService.getInventoryList()
      .then(function(response){
        return response;
      });
    }
  ]
};

angular
	.module('InventoryDetail', [])
	.config(['$stateProvider', function($stateProvider){
  		$stateProvider
    		.state('inventory_detail',{
      			url: '/view-detail/:detail_url-:item_id',
      			templateUrl: 'views/inventory/detail.html',
      			//template: '<h1>Testing</h1>',
      			controllerAs: 'inventoryDetail',
      			controller: 'InventoryDetailCtrl',
      			resolve: InventoryDetailCtrl.resolve
    		});
	}])
	.controller('InventoryDetailCtrl', [
  		'InventoryList',
  		InventoryDetailCtrl
	]);

})();