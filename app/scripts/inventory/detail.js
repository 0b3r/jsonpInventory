(function($){

'use strict';

var InventoryDetailCtrl = function($window, $filter, $sce, $uibModal, item, jsonld, inventory, Config){

  var self = this;
  var mainCarousel = $('#cjp-main-carousel');
  var thumbCarousel = $('#cjp-thumb-carousel');
  var flag = false;
  var duration = 300;
  //var hasAnalytics = $window.ga ? true : false;

  mainCarousel.on('changed.owl.carousel', function (e) {
    if (!flag) {
        flag = true;
        thumbCarousel.trigger('to.owl.carousel', [e.item.index, duration, true]);
        flag = false;
    }
  });

  thumbCarousel.on('click', '.owl-item', function(){
    $('.owl-item').removeClass('synced');
    $(this).addClass('synced');
    mainCarousel.trigger('to.owl.carousel', [$(this).index(), duration, true]);
  })
  .on('changed.owl.carousel', function (e) {
    if (!flag) {
        flag = true;        
        mainCarousel.trigger('to.owl.carousel', [e.item.index, duration, true]);
        flag = false;
    }
  });

  self.item = item;
  self.jsonld = jsonld;
  self.today = new Date();
  self.leftInStock = $filter('filter')(inventory, {model: self.item.model}).length;
  self.detailSettings = {
    imageBaseURL: Config.imageUrl,
    previewSize: Config.carouselPreviewSize
  };

  self.viewedLast30Days = 42;

  console.log(self.item);

  if(angular.isString(self.item.video_id) && (self.item.video_id !== '')){
    self.videoEmbedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + self.item.video_id);
    self.item.videoPreviewImg = Config.youtubePreviewImgUrl + self.item.video_id + '/0.jpg';
  }

  self.previewGallery = [];
  self.mainGallery = [];
  if(angular.isArray(self.item.general_photo_list) && (self.item.general_photo_list.length > 0)){

    angular.forEach(self.item.general_photo_list, function(photo){
      var previewPhotoUrl = photo.photo_name.indexOf('http') > -1 ? photo.photo_name : Config.imageUrl + self.item.record_id + '/' + Config.carouselPreviewSize + '/' + photo.photo_name;
      var mainPhotoUrl = photo.photo_name.indexOf('http') > -1 ? photo.photo_name : Config.imageUrl + self.item.record_id + '/1024/' + photo.photo_name;
      self.previewGallery.push({
        url: previewPhotoUrl,
        alt: photo.seo_alt,
        title: photo.seo_title
      });
      self.mainGallery.push({
        url: mainPhotoUrl,
        alt: photo.seo_alt,
        title: photo.seo_title
      });
    });
  }

  

  self.similarItems = inventory.filter(function(item){
    return self.item.similar_records.indexOf(item.record_id) !== -1 && !item.isSold;
  });

  self.openPhotoList = function(itemId){
    $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'template/pic-modal.html',
      controller: 'PhotoListCtrl',
      resolve: PhotoListCtrl.resolve(itemId)
    });
  };

  self.openVideo = function(url){
    $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'template/video-modal.html',
      controller: VideoViewCtrl,
      resolve: VideoViewCtrl.resolve(url)
    });
  };

  self.openConditionPhotos = function(condition_list){
    console.log(condition_list)
    $uibModal.open({
      animation: true,
      size: 'lg',
      templateUrl: 'template/pic-modal.html',
      controller: DamagePhotosCtrl,
      resolve: {
        ConditionList: function () {
          return condition_list;
        }
      }
    });
  };

};

var DamagePhotosCtrl = function($scope, $uibModalInstance, ConditionList){
  $scope.conditionList = ConditionList;
  $scope.gallery = [];

  angular.forEach(ConditionList, function(condition){
    $scope.gallery.push({
      url: condition.photo_name,
      alt: condition.seo_alt,
      title: condition.seo_title
    });
  });

  $scope.ok = function(){
    $uibModalInstance.close();
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
};

//DamagePhotosCtrl.resolve = 


var VideoViewCtrl = function($scope, $uibModalInstance, videoUrl){
  $scope.videoUrl = videoUrl;

  $scope.ok = function(){
    $uibModalInstance.close();
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
};

VideoViewCtrl.resolve = function(url){
  return {
    videoUrl: url
  };
};

var PhotoListCtrl = function($scope, $uibModalInstance, Config, Photos, itemId){
  $scope.photos = Photos;
  $scope.itemId = itemId;
  $scope.baseUrl = Config.imageUrl;
  $scope.gallery = [];

  angular.forEach(Photos, function(photo){
    var mainPhotoUrl = photo.photo_name.indexOf('http') > -1 ? photo.photo_name : Config.imageUrl + itemId + '/1024/' + photo.photo_name;
    $scope.gallery.push({
      url: mainPhotoUrl,
      alt: photo.seo_alt,
      title: photo.seo_title
    });
  });

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
  
InventoryDetailCtrl.resolve = {
  item: [
    'JsonpService',
    '$stateParams', 
    function(JsonpService, $stateParams){
      return JsonpService.getInventoryDetail($stateParams.item_id)
      .then(function(response){
        return response[0];
      });
    }
  ],
  jsonld: [
    'JsonpService',
    '$stateParams', 
    function(JsonpService, $stateParams){
      return JsonpService.getInventoryJsonld($stateParams.item_id)
      .then(function(response){
        return response;
      });
    }
  ],
  inventory: [
    'JsonpService', 
    function(JsonpService){
      return JsonpService.getInventoryList()
      .then(function(response){
        return response;
      });
    }
  ]
};

var jsonldDirective = function($filter, $sce){
  return {
    restrict: 'E',
    scope: {
      json: '=json'
    },
    template: function() {
      return '<' + 'script type="application/ld+json" ng-bind-html="onGetJson()">' + '<' + '/script>';
    },
    replace: true,
    link: function(scope){
      console.log(scope.json);
      scope.onGetJson = function() {
        return $sce.trustAsHtml($filter('json')(scope.json));
      };
    },
  };
};

angular
	.module('InventoryDetail', [])
	.config(['$stateProvider', function($stateProvider){
  		$stateProvider
    		.state('inventory_detail',{
      			url: '/view-detail/:detail_url-:item_id',
      			templateUrl: 'views/inventory/detail.html',
      			controllerAs: 'inventoryDetail',
      			controller: 'InventoryDetailCtrl',
      			resolve: InventoryDetailCtrl.resolve
    		});
	}])
	.controller('InventoryDetailCtrl', [
      '$window',
      '$filter',
      '$sce',
      '$uibModal',
  		'item',
      'jsonld',
      'inventory',
      'Config',
  		InventoryDetailCtrl
	])
  .directive('jsonld', ['$filter', '$sce', jsonldDirective]);

})(window.jQuery);