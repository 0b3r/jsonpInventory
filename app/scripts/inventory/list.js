(function(){

'use strict';

var InventoryListCtrl = function($scope, Config, inventory, layoutConfig, filterFilter, currencyFilter, CompareService){

  var self = this;
  self.headerText = 'New Lexus for Sale in Edmonton, AB';
	self.inventory = inventory;
  self.layoutConfig = layoutConfig;
  //console.log(self.inventory);
	self.currentPage = 1;
  self.totalItems = self.inventory.length;
  self.itemsPerPage = self.layoutConfig.view_limit || 20;
  self.compareInventory = [];
  self.showCompare = false;
  self.imageBaseUrl = Config.imageUrl;
  self.search = {};
  self.refineAccordionStatus = {};


  self.getOptionsFor = function(propName){
    return (self.inventory || []).map(function(w){
      return w[propName];
    }).filter(function(w, idx, arr){
      return arr.indexOf(w) === idx;
    });
  };

  self.getStatsFor = function(propName, propValue){
    return (self.inventory || []).map(function(w){
      return w[propName];
    }).filter(function(w){
      return w === propValue;
    }).length;
  };

  self.refineBarOptions = {
    year: {data: [], type: 'check', title: 'Year'},
    model: {data: [], type: 'check', title: 'Model'},
    exterior: {data: [], type: 'check', title: 'Color'}
  };


  self.refineOptions = {
    category: {data: [], type: 'check', title: 'Vehicle Condition'},
    year: {data: [], type: 'check', title: 'Year'},
    model: {data: [], type: 'check', title: 'Model'},
    body_type: {data: [], type: 'check', title: 'Body Type'},
    trim: {data: [], type: 'check', title: 'Trim'},
    engine: {data: [], type: 'check', title: 'Engine'},
    transmission: {data: [], type: 'check', title: 'Transmission'},
    drivetrain: {data: [], type: 'check', title: 'Drivetrain'},
    exterior: {data: [], type: 'check', title: 'Exterior Color'},
    interior: {data: [], type: 'check', title: 'Interior Color'}
  };

  function noSubFilter(subFilterObj){
    for(var key in subFilterObj){
      if(subFilterObj[key]){
        return false;
      }
    }
    return true;
  }

  function filterByProperties(item){
    var matchesAND = true;
    for(var prop in self.search.optsFilter){
      if(noSubFilter(self.search.optsFilter[prop])){
        continue;
      }
      if(!self.search.optsFilter[prop][item[prop]]){
        matchesAND = false;
        break;
      }
    }
    return matchesAND;
  }


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

	self.getNoOfPages = function(){
    return Math.ceil(self.totalItems / self.itemsPerPage);
  };

  self.noOfPages = self.getNoOfPages();


	

  $scope.$watch(function(){
    return self.search;
  }, function (newVal) {
    self.filtered = filterFilter(self.inventory, newVal.searchQuery);
    self.filtered = filterFilter(self.filtered, filterByProperties);
    if(self.filtered){
      self.totalItems = self.filtered.length;
    }
    self.noOfPages = self.getNoOfPages();
    self.currentPage = 1;
  }, true);
  
};
  
InventoryListCtrl.resolve = {
  inventory: [
    'JsonpService', 
    function(JsonpService){
      return JsonpService.getInventoryList()
      .then(function(response){
        return response;
      });
    }
  ],
  layoutConfig: [
    'JsonpService', 
    function(JsonpService){
      return JsonpService.getConfig()
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
    template: '<a ng-disabled="compareButton.disable" class="cjp-action-button" ng-click="addCompare(compareItem)"><span class="glyphicon glyphicon-ok"></span>{{ compareButton.text }}</a>',
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
  	'inventory',
    'layoutConfig',
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