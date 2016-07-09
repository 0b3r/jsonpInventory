(function(){

'use strict';

angular
	.module('jsonpApp')
	.constant('Config',{
  		listUrl: 'http://live.cdemo.com/jsonp/',
  		photoListUrl: 'http://live.cdemo.com/jsonp/photos/',
  		detailUrl: 'http://live.cdemo.com/jsonp/detail/',
      configlUrl: 'http://live.cdemo.com/jsonp/config/',
      contactUrl: 'http://live.cdemo.com/jsonp/contact/',
      jsonldUrl: 'http://live.cdemo.com/jsonp/jsonld/',
      specialsUrl: 'http://live.cdemo.com/jsonp/specials/',
  		imageUrl: 'http://static.cdemo.com/',
  		partyId: 0,
  		youtubePreviewImgUrl: 'http://img.youtube.com/vi/',
  		carouselPreviewSize: 250,
      filterSold: false
	});

})();