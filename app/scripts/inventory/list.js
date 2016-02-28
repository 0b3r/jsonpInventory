(function(){

'use strict';

var InventoryListCtrl = function($scope, Config, InventoryList, filterFilter, currencyFilter, CompareService){
  var self = this;
  self.headerText = 'New Lexus for Sale in Edmonton, AB';
	self.inventory = InventoryList;
	self.currentPage = 1;
  self.totalItems = self.inventory.length;
  self.itemsPerPage = 20;
  self.compareInventory = [];
  self.showCompare = false;
  self.imageBaseUrl = Config.imageUrl;

  self.test = currencyFilter(12.29, '$', 0, true);


  $scope.$on('compare.update', function(event, args){
    self.compareInventory = args;
  });

  self.goCompare = function(){
    self.showCompare = true;
  };


  self.resetCompare = function(){
    self.showCompare = false;
    CompareService.reset();
  };

	self.noOfPages = function(){
    return Math.ceil(self.totalItems / self.itemsPerPage);
  };


	self.search = {};

  $scope.$watch('self.search', function (newVal) {
    self.filtered = filterFilter(self.items, newVal);
    if(self.filtered){
      self.totalItems = self.filtered.length;
    }
    self.noOfPages = self.noOfPages();
    self.currentPage = 1;
  }, true);
  
};
  
InventoryListCtrl.resolve = {
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

var PhotoListCtrl = function($scope, $uibModalInstance, Config, Photos, itemId){
	$scope.photos = Photos;
  $scope.itemId = itemId;
  $scope.baseUrl = Config.imageUrl;
  console.log($scope.photos);
  console.log($scope.itemId );
  console.log(Config);

	$scope.ok = function(){
		$uibModalInstance.close();
	};

	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};
};

PhotoListCtrl.resolve = function(itemId){
  return {
    itemId: itemId,
 	  Photos: [
  		'JsonpService',
  		function(JsonpService){
        return JsonpService.getInventoryPhotoList(itemId).then(function(response){
  				return response;
        });
  		}
    ]
  };
};


var ItemCardCtrl = function($scope, $uibModal, Config){

  $scope.imageBaseUrl = Config.imageUrl;

  $scope.openPhotoList = function(itemId){
    $uibModal.open({
      animation: true,
      templateUrl: 'template/pic-modal.html',
        controller: 'PhotoListCtrl',
          resolve: PhotoListCtrl.resolve(itemId)
    });
  };
};

var itemCardDirective = function(){
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/inventory/item-card.html',
    replace: true,
    controller: [
      '$scope',
      '$uibModal',
      'Config',
      ItemCardCtrl
    ]
  };
};

var compareButtonCtrl = function($scope, CompareService){

  $scope.comparing = CompareService.get();
  $scope.compareButton = {
    text: 'Compare',
    disable: false
  };

  angular.forEach($scope.comparing, function(item){
    if(item.record_id === $scope.compareItem.record_id){
        $scope.compareButton.text = 'Comparing';
        $scope.compareButton.disable = true;
    }
  });


  
  $scope.addCompare = function(item){
    CompareService.add(item);
  };
 

  $scope.$on('compare.update', function(event, args){
    $scope.comparing = args;
    var updateCompareButton = {
      text: 'Compare',
      disable: false
    };
    angular.forEach($scope.comparing, function(item){
      if(item.record_id === $scope.compareItem.record_id){
        updateCompareButton.text = 'Comparing';
        updateCompareButton.disable = true;
      }
    });
    $scope.compareButton = updateCompareButton;
    //console.log($scope.comparing);
  });

};

var compareButtonDirective = function(){
  return {
    restrict: 'E',
    scope: {
      compareItem: '=item',
    },
    template: '<button style="width: 20%;" class="btn btn-default" ng-disabled="compareButton.disable" ng-click="addCompare(compareItem)">{{ compareButton.text }}</button>',
    replace: true,
    controller: [
      '$scope',
      'CompareService',
      compareButtonCtrl
    ]
  };
};


angular
	.module('InventoryList', [])
	.config(['$stateProvider', function($stateProvider){
  		$stateProvider
    		.state('inventory_list',{
      			url: '/',
      			templateUrl: 'views/inventory/list.html',
      			//template: '<h1>Testing</h1>',
      			controllerAs: 'inventoryList',
      			controller: 'InventoryListCtrl',
      			resolve: InventoryListCtrl.resolve
    		});
	}])
	.controller('InventoryListCtrl', [
    '$scope',
    'Config',
  	'InventoryList',
    'filterFilter',
    'currencyFilter',
    'CompareService',
  	InventoryListCtrl
	])
	.controller('PhotoListCtrl', [
		'$scope',
		'$uibModalInstance',
    'Config',
		'Photos',
    'itemId',
		PhotoListCtrl
	])
  .directive('itemCard', [itemCardDirective])
  .directive('compareButton', [compareButtonDirective]);

})();