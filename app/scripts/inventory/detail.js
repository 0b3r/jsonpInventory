(function(){

'use strict';

var InventoryDetailCtrl = function($filter, $sce, item, inventory, Config){

  var self = this;

  self.item = item;
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
  if(angular.isArray(self.item.general_photo_list) && (self.item.general_photo_list.length > 0)){
    angular.forEach(self.item.general_photo_list, function(photo){
      self.previewGallery.push({
        url: Config.imageUrl + self.item.record_id + '/' + Config.carouselPreviewSize + '/' + photo.photo_name,
        alt: photo.seo_alt,
        title: photo.seo_title
      });
    });
  }

  console.log(self.previewGallery);
	console.log(self.item);

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
      'inventory',
      'Config',
  		InventoryDetailCtrl
	]);

})();