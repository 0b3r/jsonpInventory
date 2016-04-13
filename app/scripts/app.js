(function($){

'use strict';

//var appContainer = angular.element('#cdjps').parent();
//appContainer.append('<resolve-loader></resolve-loader><div id="cjp" class="container-fluid" ui-view></div>');

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
    'rzModule',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'InventoryList',
    'InventoryDetail'
])

.config(['$urlRouterProvider', 'cssInjectorProvider', function($urlRouterProvider, cssInjectorProvider){
		$urlRouterProvider.otherwise('/');
        cssInjectorProvider.setSinglePageMode(false);
}])

.run(['$rootScope', '$state', '$stateParams', 'cssInjector', function($rootScope, $state, $stateParams) {
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
}])
.directive('resolveLoader', function($rootScope) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/loader.html',
    link: function(scope, element) {

        $rootScope.$on('$stateChangeStart', function(){
            element.removeClass('ng-hide');
        });

        $rootScope.$on('$stateChangeSuccess', function() {
            element.addClass('ng-hide');
        });
    }
  };
})
.directive('datadriverInventory', function(Config, cssInjector) {

  return {
    restrict: 'E',
    replace: true,
    template: '<div><resolve-loader></resolve-loader><div id="cjp" class="container-fluid" ui-view></div></div>',
    link: function(scope, element) {
        Config.partyId = parseInt(element.data('from'));
        Config.env = element.data('env') || 'prd';
        console.log(Config);
        if(Config.env === 'prd'){
            cssInjector.add('https://s3-us-west-2.amazonaws.com/jsonp/styles/cjpvendor.css');
            cssInjector.add('https://s3-us-west-2.amazonaws.com/jsonp/styles/cjpcore.css');
        }
    }
  };
});


angular.element(document).ready(function() {
  angular.bootstrap(document, ['jsonpApp']);
});

})(window.jQuery);