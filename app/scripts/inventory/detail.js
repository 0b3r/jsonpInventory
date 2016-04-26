(function($){

'use strict';

var InventoryDetailCtrl = function($filter, $sce, item, inventory, Config){

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
      self.previewGallery.push({
        url: Config.imageUrl + self.item.record_id + '/' + Config.carouselPreviewSize + '/' + photo.photo_name,
        alt: photo.seo_alt,
        title: photo.seo_title
      });
      self.mainGallery.push({
        url: Config.imageUrl + self.item.record_id + '/1024/' + photo.photo_name,
        alt: photo.seo_alt,
        title: photo.seo_title
      });
    });
  }

  //console.log(inventory);

  self.similarItems = inventory.filter(function(item){
    return self.item.similar_records.indexOf(item.record_id) !== -1;
  });

  console.log(self.similarItems);



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

})(window.jQuery);