(function(){

'use strict';

angular
	.module('jsonpApp')
	.service('JsonpService', ['$http', '$q', 'Config', function($http, $q, Config){
		var listCache, configCache, specialsCache;
		var detailCache = [];
		var jsonldCache = [];
		var photoCache = [];
		var inventoryListUrl = Config.listUrl+Config.partyId+'?callback=JSON_CALLBACK';
		var specialsUrl = Config.specialsUrl+Config.partyId+'?callback=JSON_CALLBACK';
		var configUrl = Config.configlUrl+Config.partyId+'?callback=JSON_CALLBACK';

		function prepareInventoryList(data){
			var cleaned = [];
			angular.forEach(data, function(item){
				if(item.primary_photo){
					var imageName = item.primary_photo.split('/');
					if(parseInt(imageName[imageName.length - 2]) === 1024){
						item.imageOptimized = true;
					}else{
						item.imageOptimized = false;
					}
					item.imageName = imageName[imageName.length - 1];
				}
				
				item.price = parseFloat(item.price);
				item.year = parseInt(item.year);
				if(item.title.indexOf('SOLD') > -1){
					item.isSold = item.title.indexOf('SOLD') > -1;

					if(!Config.filterSold){
						Config.filterSold = true;
					}
				}else{
					item.isSold = false;
				}
				
				this.push(item);
			}, cleaned);

			return cleaned;
		}

		function prepareSpecials(data){

			var cleaned = [];
			angular.forEach(data, function(item){
				
				  var pricing = item.postfix_expression.split(','); 
				  item.monthly_payment = parseInt(item.monthly_payment);
				  item.apr_downpayment = parseInt(item.apr_downpayment);
				  item.apr_rate = parseFloat(item.apr_rate);
				  item.apr_term = parseInt(item.apr_term);
				  item.savingsPrice = pricing[1];
				  item.savingsOff = pricing[0];
				  item.zero_down_monthly_payment = parseInt(item.zero_down_monthly_payment);
				  item.buy_now_price = parseInt(item.buy_now_price);
				
				this.push(item);
			}, cleaned);

			return data;
		}

		this.getConfig = function(){
			var d = $q.defer();
			if(Config.partyId){
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
				
			}else{
				d.reject('No Id Present!');
			}

			return d.promise;
		};

		this.getInventoryList = function(){
			var d = $q.defer();
			if(Config.partyId){
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
			}else{
				d.reject('No Id Present!');
			}
			return d.promise;
		};

		this.getInventoryPhotoList = function(itemId){
			var d = $q.defer();
			
			if(Config.partyId){
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
			}else{
				d.reject('No Id Present!');
			}
			return d.promise;
		};

		this.getInventoryDetail = function(itemId){
			var d = $q.defer();
			
			if(Config.partyId){
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
			}else{
				d.reject('No Id Present!');
			}
			return d.promise;
		};	

		this.getSpecials = function(){
			
			var d = $q.defer();
			if(Config.partyId){

				if(specialsCache){
					console.log('asd',specialsCache);
					d.resolve(specialsCache);
				}
				else{
					$http.jsonp(specialsUrl).then(
						function success(response){

							if(!specialsCache){
								specialsCache = prepareSpecials(response.data);
							}
	          				d.resolve(specialsCache);
						},
						function failure(reason){
							d.reject(reason);
						}
					);
				}
			}else{
				d.reject('No Id Present!');
			}
			return d.promise;
		};

		this.getInventoryJsonld = function(itemId){
			var d = $q.defer();
			
			if(Config.partyId){
				if((jsonldCache.length > 0) && jsonldCache[itemId]){
					d.resolve(jsonldCache[itemId]);
				}else{
					$http.jsonp(Config.jsonldUrl+itemId+'?callback=JSON_CALLBACK').then(
						function success(response){
							if((jsonldCache.length === 0) || !jsonldCache[itemId]){
								jsonldCache[itemId] = response.data;
							}
	          				d.resolve(jsonldCache[itemId]);
						},
						function failure(reason){
							d.reject(reason);
						}
					);
				}
			}else{
				d.reject('No Id Present!');
			}
			return d.promise;
		};

	}]);

})();