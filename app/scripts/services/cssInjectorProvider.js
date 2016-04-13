(function(){
'use strict';

angular.module('jsonpApp')
.provider('cssInjector', ['$interpolateProvider', function($interpolateProvider) {
	var singlePageMode = false;

	function CssInjector($compile, $rootScope, $rootElement){
        var head = angular.element(document.getElementsByTagName('head')[0]), scope;
        $rootScope.$on('$locationChangeStart', function(){
            if(singlePageMode === true){
                removeAll();
            }
                
        });

        var _initScope = function(){
            if(scope === undefined){
                scope = $rootElement.scope();
            }
        };


        var addStylesheet = function(href){
            _initScope();

            if(scope.injectedStylesheets === undefined){
                scope.injectedStylesheets = [];
                head.append(
                    $compile('<link data-ng-repeat="stylesheet in injectedStylesheets" data-ng-href="' + $interpolateProvider.startSymbol() + 'stylesheet.href' + $interpolateProvider.endSymbol() + '" rel="stylesheet" />')(scope)
                    ); 
            }else{
                for(var i in scope.injectedStylesheets){
                    if(scope.injectedStylesheets[i].href === href){
                        return;  
                    }    
                }
            }
            scope.injectedStylesheets.push({href: href});
        };

		var remove = function(href){
			_initScope();

			if(scope.injectedStylesheets){
				for(var i = 0; i < scope.injectedStylesheets.length; i++){
					if(scope.injectedStylesheets[i].href === href){
						scope.injectedStylesheets.splice(i, 1);
						return;
					}
				}
			}
		};

        var removeAll = function(){
            _initScope();

            if(scope.injectedStylesheets !== undefined){
                scope.injectedStylesheets = [];
            }
                 
        };

        return {
            add: addStylesheet,
			remove: remove,
            removeAll: removeAll
        };
	}

	this.$get = ['$compile', '$rootScope', '$rootElement', function($compile, $rootScope, $rootElement){
		return new CssInjector($compile, $rootScope, $rootElement);
	}];

	this.setSinglePageMode = function(mode){
		singlePageMode = mode;
		return this;
	};
}]);
})();



