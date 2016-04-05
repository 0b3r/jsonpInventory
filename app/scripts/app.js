(function($){

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
}])
.directive('owlCarousel', function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
              // provide any default options you want
                var defaultOptions = {
                };
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for(var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                $(element).owlCarousel(defaultOptions);
            };
        }
    };
})
.directive('owlCarouselItem', [function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);


angular.element(document).ready(function() {
  angular.bootstrap(document, ['jsonpApp']);
});

})(window.jQuery);