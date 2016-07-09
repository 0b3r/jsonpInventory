(function($){

'use strict';


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

.run(['$rootScope', '$state', '$stateParams', '$window', '$location', function($rootScope, $state, $stateParams, $window, $location) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

        if($window.ga){
            $rootScope.$on('$stateChangeSuccess', function () {
                $window.ga('send', 'pageview', $location.path());
            });
        }
        

}])
.directive('owlCarousel', function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {

            

            scope.initCarousel = function(element) {

                var defaultOptions;


                var customOptions = scope.$eval($(element).attr('data-options'));

                if(customOptions.updateSize){
                    defaultOptions = {
                        navText: [
                            '<i class="glyphicon glyphicon-chevron-left"></i>',
                            '<i class="glyphicon glyphicon-chevron-right"></i>'
                        ],
                        onResized: function(e){
                            var baseElement = $(e.target).children('.owl-stage-outer').children('.owl-stage').children('.owl-item');
                            var minHeight = parseInt(baseElement.eq(0).css('height'));
                            baseElement.each(function () {
                                var thisHeight = parseInt($(this).css('height'));
                                minHeight=(minHeight<=thisHeight?minHeight:thisHeight);

                            });
                            $(e.target).children('.owl-stage-outer').css('height',minHeight+'px');
                        }
                    };
                }else{
                    defaultOptions = {
                        navText: [
                            '<i class="glyphicon glyphicon-chevron-left"></i>',
                            '<i class="glyphicon glyphicon-chevron-right"></i>'
                        ],
                    };
                }

                for(var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }

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
                //TODO: Add imageonload on children elements for efficency
            }
        }
    };
}])
.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var baseElement = element.parents('.owl-stage').children('.owl-item');
                var minHeight = parseInt(baseElement.eq(0).css('height'));

                if(attrs.imageonload !== 'initSize'){
                    
                    baseElement.each(function () {
                        var thisHeight = parseInt($(this).css('height'));
                        minHeight=(minHeight<=thisHeight?minHeight:thisHeight);

                    });
                }
                element.parents('.owl-stage-outer').css('height',minHeight+'px');
            });
        }
    };
})
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
        if(Config.env === 'prd'){
            cssInjector.add('https://s3-us-west-2.amazonaws.com/jsonp/styles/cjpvendor.css');
            cssInjector.add('https://s3-us-west-2.amazonaws.com/jsonp/styles/cjpcore.css');
        }else{
            Config.listUrl = 'http://live-uat.cdemo.com/jsonp/';
            Config.photoListUrl = 'http://live-uat.cdemo.com/jsonp/photos/';
            Config.detailUrl = 'http://live-uat.cdemo.com/jsonp/detail/';
            Config.configlUrl = 'http://live-uat.cdemo.com/jsonp/config/';
            Config.contactUrl = 'http://live-uat.cdemo.com/jsonp/contact/';
            Config.jsonldUrl = 'http://live-uat.cdemo.com/jsonp/jsonld/';
            Config.specialsUrl = 'http://live-uat.cdemo.com/jsonp/jsonld/';
        }
    }
  };
});


angular.element(document).ready(function() {
  angular.bootstrap(document, ['jsonpApp']);
});

})(window.jQuery);