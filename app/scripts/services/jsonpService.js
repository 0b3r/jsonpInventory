(function(){

'use strict';

angular
	.module('jsonpApp')
	.service('JsonpService', ['$http', '$q', 'Config', function($http, $q, Config){
		var listCache, configCache;
		var detailCache = [];
		var photoCache = [];
		var inventoryListUrl = Config.listUrl+Config.partyId+'?callback=JSON_CALLBACK';
		var configUrl = Config.configlUrl+Config.partyId+'?callback=JSON_CALLBACK';

		function prepareInventoryList(data){
			var cleaned = [];
			angular.forEach(data, function(item){
				var imageName = item.primary_photo.split('/');
				if(parseInt(imageName[imageName.length - 2]) === 1024){
					item.imageOptimized = true;
				}else{
					item.imageOptimized = false;
				}
				item.imageName = imageName[imageName.length - 1];
				item.price = parseFloat(item.price);
				item.year = parseInt(item.year);
				this.push(item);
			}, cleaned);

			return cleaned;
		}

		this.getConfig = function(){
			var d = $q.defer();
			if(configCache){
				d.resolve(configCache);
			}
			else{
				$http.jsonp(configUrl).then(
					function success(response){
						if(!configCache){
							configCache = response.data[0];
						}
          				d.resolve(configCache);
					},
					function failure(reason){
						d.reject(reason);
					}
				);
			}
			return d.promise;
		};

		this.getInventoryList = function(){
			var d = $q.defer();
			if(listCache){
				d.resolve(listCache);
			}
			else{
				$http.jsonp(inventoryListUrl).then(
					function success(response){
						if(!listCache){
							listCache = prepareInventoryList(response.data);
						}
          				d.resolve(listCache);
					},
					function failure(reason){
						d.reject(reason);
					}
				);
			}
			return d.promise;
		};

		this.getInventoryPhotoList = function(itemId){
			var d = $q.defer();
			
			if((photoCache.length > 0) && photoCache[itemId]){
				d.resolve(photoCache[itemId]);
			}else{
				$http.jsonp(Config.photoListUrl+itemId+'?callback=JSON_CALLBACK').then(
					function success(response){
						if((photoCache.length === 0) || !photoCache[itemId]){
							photoCache[itemId] = response.data;
						}
          				d.resolve(photoCache[itemId]);
					},
					function failure(reason){
						d.reject(reason);
					}
				);
			}
			return d.promise;
		};

		this.getInventoryDetail = function(itemId){
			var d = $q.defer();
			
			if((detailCache.length > 0) && detailCache[itemId]){
				d.resolve(detailCache[itemId]);
			}else{
				$http.jsonp(Config.detailUrl+itemId+'?callback=JSON_CALLBACK').then(
					function success(response){
						if((detailCache.length === 0) || !detailCache[itemId]){
							detailCache[itemId] = response.data;
						}
          				d.resolve(detailCache[itemId]);
					},
					function failure(reason){
						d.reject(reason);
					}
				);
			}
			return d.promise;
		};	

	}]);

})();