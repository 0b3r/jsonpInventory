(function(){

'use strict';

angular
	.module('jsonpApp')
	.constant('Config',{
  		listUrl: 'http://live-uat.cdemo.com/jsonp/',
  		photoListUrl: 'http://live-uat.cdemo.com/jsonp/photos/',
  		detailUrl: 'http://live-uat.cdemo.com/jsonp/detail/',
      configlUrl: 'http://live-uat.cdemo.com/jsonp/config/',
  		imageUrl: 'http://static.cdemo.com/',
  		partyId: 0,
  		youtubePreviewImgUrl: 'http://img.youtube.com/vi/',
  		carouselPreviewSize: 250
	});

})();