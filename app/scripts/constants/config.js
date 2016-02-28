(function(){

'use strict';

angular
	.module('jsonpApp')
	.constant('Config',{
  		listUrl: 'http://live-uat.cdemo.com/jsonp/',
  		photoListUrl: 'http://live-uat.cdemo.com/jsonp/photos/',
  		imageUrl: 'http://static.cdemo.com/',
  		partyId: 7596
	});

})();