(function(){

'use strict';

var InventoryListCtrl = function($scope, $filter, Config, inventory, layoutConfig, filterFilter, currencyFilter, CompareService){

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
  self.refineAccordionStatus = {};
  self.viewType = 'list';

  self.sortByFilter = [
    { title: 'Sort By', predicate: '', reverse: false },
    { title: 'Price [ Low to High ]', predicate: 'price', reverse: false },
    { title: 'Price [ High to Low ]', predicate: 'price', reverse: true },
    { title: 'Make [ A - Z ]', predicate: 'make', reverse: false },
    { title: 'Make [ Z - A ]', predicate: 'make', reverse: true },
    { title: 'Model [ A - Z ]', predicate: 'model', reverse: false },
    { title: 'Model [ Z - A ]', predicate: 'model', reverse: true },
    { title: 'Year [ Low - High ]', predicate: 'year', reverse: false },
    { title: 'Year [ High - Low ]', predicate: 'year', reverse: true }
  ];

  self.priceFilter =  function(type){
    var map = (self.inventory || []).map(
      function(w){return w.price;
    });
    var min = Math.min.apply(null, map);
    var max = Math.max.apply(null, map);
    if(type === 'filter'){
      return {
        ceil: max,
        floor: min,
        hideLimitLabels: true,
        translate: function (value) {
            return currencyFilter(value, undefined, 0);
        }
      };
    }else{
      return {
        min: min,
        max: max
      };
    }
    
  };

  self.search = {
    sort: self.sortByFilter[0],
    price: self.priceFilter('init')
  };

  self.resetFilter = function(){
    self.search = {
      sort: self.sortByFilter[0],
      price: self.priceFilter('init')
    };
  };

  self.getOptionsFor = function(propName){
    return (self.inventory || [])
      .map(function(w){return w[propName];})
      .filter(function(w, idx, arr){ return arr.indexOf(w) === idx; });
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
    interior: {data: [], type: 'check', title: 'Interior Color'},
    price: {data: [], type: 'slider', title: 'Price'}
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

  function byRange(fieldName, minValue, maxValue) {
    if (minValue === undefined){
      minValue = Number.MIN_VALUE;
    }
    if (maxValue === undefined){ 
      maxValue = Number.MAX_VALUE;
    }

    return function predicateFunc(item) {
      return minValue <= item[fieldName] && item[fieldName] <= maxValue;
    };
  }


  $scope.$watch(function(){
    return self.search;
  }, function (newVal) {
    console.log(newVal);
    self.filtered = $filter('filter')(self.inventory, newVal.searchQuery);
    self.filtered = $filter('filter')(self.filtered, filterByProperties);
    self.filtered = $filter('filter')(self.filtered, byRange('price', newVal.price.min, newVal.price.max));
    self.filtered = $filter('orderBy')(self.filtered, newVal.sort.predicate, newVal.sort.reverse);
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

var ItemGridCtrl = function($scope, $uibModal, Config){

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

var itemGridDirective = function(){
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'views/inventory/item-grid.html',
    replace: true,
    controller: [
      '$scope',
      '$uibModal',
      'Config',
      ItemGridCtrl
    ]
  };
};

var compareButtonCtrl = function($scope, CompareService){

  $scope.comparing = CompareService.get();
  $scope.compareButton = {
    text: 'Compare',
    class: ''
  };

  angular.forEach($scope.comparing, function(item){
    if(item.record_id === $scope.compareItem.record_id){
        $scope.compareButton.text = 'Comparing';
        $scope.compareButton.class = 'cjp-compare-disable';
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
        updateCompareButton.class = 'cjp-compare-disable';
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
    template: '<a ng-class="compareButton.class" class="cjp-action-button" ng-click="addCompare(compareItem)"><span class="glyphicon glyphicon-ok"></span>{{ compareButton.text }}</a>',
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
    '$filter',
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
  .directive('itemGrid', [itemGridDirective])
  .directive('compareButton', [compareButtonDirective]);

})();