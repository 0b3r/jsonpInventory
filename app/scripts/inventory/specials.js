'use strict';

(function(){

// var specials = [{"id": 1, "end_date": "October 30, 2016","buy_now_price": "16000.00", "monthly_payment": "139.00", "description": "This is the description of the vehicles special", "zero_down": true, "title": "New Title 2016 Lexus ES 350", "price": "0.00", "inventory_redirect_url": null, "scolling_text": "Scrolling test goes here.", "postfix_expression": "listing_price,1000,-", "template_id": 1, "apr_rate": "1.90", "inventory_filter": {"status": 1, "has_comment": "N/A", "year_manufactured": [{"text": "2016", "value": "2016"}], "has_damage": "N/A", "is_certified": "N/A", "trim_level": [], "transmission": [], "make": [{"text": "Lexus", "value": "Lexus"}], "has_video": "N/A", "condition_id": "N/A", "engine": [], "duplicate": false, "has_price": "N/A", "drivetrain": [], "has_sale_price": "N/A", "real_photo_count": "N/A", "model_search": [{"text": "ES 350", "make": "Lexus", "value": "ES 350"}]}, "fine_print": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in mauris at lectus pellentesque sagittis. Nullam tortor felis, convallis at rhoncus vel, tempus et ligula. Duis ut est at erat scelerisque suscipit. Mauris dapibus et neque in maximus. Vestibulum erat ex, faucibus vitae ex a, bibendum dictum orci. Suspendisse arcu nibh, eleifend posuere nisl in, pellentesque commodo urna. Sed et posuere magna, at pulvinar sem. Nunc at augue a odio dictum dictum. Proin id nisi in sem rutrum feugiat. Fusce vitae mauris in leo sollicitudin mollis eget suscipit enim. Nulla mollis orci at nisl venenatis viverra. Nullam vulputate lacinia diam et efficitur. Praesent facilisis tincidunt orci, tristique scelerisque orci cursus et. Proin ullamcorper leo sem, non euismod mauris sodales vitae. Proin risus arcu, tristique tristique tempor a, pharetra ut velit.\n\nDonec quis elit at leo luctus commodo. Nam vel lorem elementum, interdum ipsum at, sodales urna. Aliquam sed libero tortor. Duis posuere auctor turpis. Cras sed odio feugiat diam elementum elementum. Suspendisse ut arcu at metus dapibus dapibus non ac leo. Aenean mauris urna, commodo vitae lobortis non, dictum vitae massa. Nunc semper id lacus in accumsan. Cras facilisis bibendum nunc. Praesent a nulla vitae erat viverra consectetur vitae sit amet leo. In sollicitudin vel diam sit amet gravida. Cras vestibulum, tellus nec vulputate pharetra, ligula leo placerat nulla, non lacinia ante risus in sem.", "apr_downpayment": "999.00", "apr_term": "36.00", "zero_down_monthly_payment": "289.00", "tag_line": "Lease with APR 1.9% for only 36 months!", "msrp": "19778.00", "primary_listing_photo": "http://static.cdemo.com/65177053/1024/new-and-used-auto-new-2016-lexus-nx-200t-awd-4dr-1260754-primary-listing-photo-Image.jpg", "telephone": "(780) 851-1624"}];

// for(var i=0; i<specials.length;i++){


//   var pricing = specials[i].postfix_expression.split(','); 
//   specials[i].monthly_payment = parseInt(specials[i].monthly_payment);
//   specials[i].apr_downpayment = parseInt(specials[i].apr_downpayment);
//   specials[i].apr_rate = parseFloat(specials[i].apr_rate);
//   specials[i].apr_term = parseInt(specials[i].apr_term);
//   specials[i].savingsPrice = pricing[1];
//   specials[i].savingsOff = pricing[0];
//   specials[i].zero_down_monthly_payment = parseInt(specials[i].zero_down_monthly_payment);
//   specials[i].buy_now_price = parseInt(specials[i].buy_now_price);

// }

var InventorySpecialsCtrl = function($state, specials){ 

  var self = this;
  console.log(specials);
  self.specials = specials;

  self.pricingTitle = {
    sale_price: 'Sale Price',
    listing_price: 'Selling Price',
    msrp: 'MSRP',
    invoice_price: 'Cost Price',
  };

  self.filterInventory = function(params){
    $state.go('inventory_list',{specialFilter: params});
  };
};

InventorySpecialsCtrl.resolve = {
  specials: [
    'JsonpService', 
    function(JsonpService){
      return JsonpService.getSpecials()
      .then(function(response){
        return response;
      });
    }
  ]
};

var getSpecialModalCtrl = function($scope, $window, $http, $uibModalInstance, Config, special){

  $scope.params = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: '',
    url: ''
  };

  $scope.submitMsg = '';
  $scope.submitClass = 'alert-success';

  var hasAnalytics = $window.ga ? true : false;

  $scope.get = function () {

    var sendUrl = Config.sendSpecialUrl+special+'?callback=JSON_CALLBACK';
    $http.jsonp(sendUrl, {params:$scope.params}).then(
      function success(response){
        if(response.data.msg === 'ok'){
          $scope.submitClass = 'alert-success';
          $scope.submitMsg = 'Thank you!  We will be in touch shortly!';
          if(hasAnalytics){
            $window.ga('send', 'event', 'button', 'submit', 'Special Lead Submitted Successfully');
          }
          $('#cjp-submit-eprice-msg').fadeIn().delay(3000).fadeOut(function(){
            $uibModalInstance.close('success');
          });
        }
        
      },
      function failure(){
        $scope.submitClass = 'alert-danger';
        $scope.submitMsg = 'Opps!  Something seems to have gone wrong.  Try again later.';
        if(hasAnalytics){
          $window.ga('send', 'event', 'button', 'submit', 'Listing Lead Submission Failed');
        }
        $('#cjp-submit-eprice-msg').fadeIn().delay(3000).fadeOut(function(){
          $uibModalInstance.close('fail');
        });
      }
    );
    


  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

var getSpecialCtrl = function($scope, $window, $uibModal){

  var hasAnalytics = $window.ga ? true : false;

  $scope.open = function(){
    
    if(hasAnalytics){
      $window.ga('send', 'event', 'button', 'click', 'Special Lead Initiated');
    }

    $uibModal.open({
      templateUrl: 'views/inventory/get-special.html',
      size: 'lg',
      controller: [
        '$scope',
        '$window',
        '$http',
        '$uibModalInstance',
        'Config',
        'special',
        getSpecialModalCtrl
      ],
      resolve: {
        special: function(){
          return $scope.special;
        }
      }
    });
  };

};

var getSpecialDirective = function(){
  return {
    restrict: 'E',
    scope: {
      special: '=specialId',
    },
    template: '<button class="btn btn-lg btn-block btn-success cjp-s1-get-btn" ng-click="open()">'+
            'Get Special <span style="float: right;" class="glyphicon glyphicon-chevron-right"></span></button>',
    replace: true,
    controller: [
      '$scope',
      '$window',
      '$uibModal',
      getSpecialCtrl
    ]
  };
};


angular
	.module('InventorySpecials', [])
	.config(['$stateProvider', function($stateProvider){
  		$stateProvider
    		.state('inventory_specials',{
      			url: '/specials',
      			templateUrl: 'views/inventory/specials.html',
      			controllerAs: 'inventorySpecials',
      			controller: 'InventorySpecialsCtrl',
      			resolve: InventorySpecialsCtrl.resolve
    		});
	}])
  .controller('InventorySpecialsCtrl', [
    '$state',
    'specials',
    InventorySpecialsCtrl
  ])
  .directive('getSpecial', [getSpecialDirective]);

  })();