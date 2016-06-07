(function($){

'use strict';

var InventoryDetailCtrl = function($filter, $sce, item, jsonld, inventory, Config){

  var self = this;
  var mainCarousel = $('#cjp-main-carousel');
  var thumbCarousel = $('#cjp-thumb-carousel');
  var flag = false;
  var duration = 300;

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
  //TODO: Make this real

  self.viewedLast30Days = 42;

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

  //console.log(self.jsonld);


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
      '$filter',
      '$sce',
  		'item',
      'jsonld',
      'inventory',
      'Config',
  		InventoryDetailCtrl
	])
  .directive('jsonld', ['$filter', '$sce', jsonldDirective]);

})(window.jQuery);