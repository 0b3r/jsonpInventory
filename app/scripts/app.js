(function(){

'use strict';

var appContainer = angular.element('#cdjps').parent();
appContainer.append('<state-loader></state-loader><div class="container-fluid" ui-view></div>');

/**
* @ngdoc overview
* @name jsonpApp
* @description
* # jsonpApp
*
* Main module of the application.
*/
angular
	.module('jsonpApp', [
		'ui.router',
		'ui.bootstrap',
	    'ngAnimate',
	    'ngAria',
	    'ngCookies',
	    'ngResource',
	    'ngSanitize',
	    'ngTouch',
	    'InventoryList',
	    'InventoryDetail'
	])

	.config(['$urlRouterProvider', function($urlRouterProvider){
  		$urlRouterProvider.otherwise('/');
	}])

	.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  		$rootScope.$state = $state;
  		$rootScope.$stateParams = $stateParams;
	}]);

angular.element(document).ready(function() {
  angular.bootstrap(document, ['jsonpApp']);
});

})();