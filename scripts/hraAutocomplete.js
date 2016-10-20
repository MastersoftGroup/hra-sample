'use strict';

angular.module( "hraAutocomplete", [])
	.directive('hraAutocomplete', ['$http','$parse', function($http, $parse) { 
	return {
		restrict: 'AE',
		replace: true,
		template: '<input type="text" />',
		require: 'ngModel',
		controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
			init($scope,  $attrs, $http);
		}],

		compile: function (element, attrs) {
			var modelAccessor = $parse(attrs.ngModel);

			return function (scope, element, attrs, controller) {
				var mappedItems = [];
				var hraDelay = attrs.hraDelay||500;
				var hraMinLength = attrs.hraMinLength||3;
				var sot = attrs.hraSot||"AUPAF";
				var locale = "au";

				if(sot == "NZPAF") {
					locale = "nz";
				}

				element.autocomplete({
					minLength: hraMinLength,   
					delay: hraDelay,  

					source: function (request, response) {
						var url = scope.baseUrl+'/harmony/rest/' + locale+ '/address?callback=JSON_CALLBACK&fullAddress=' +  request.term
						+'&Authorization=Basic+' + scope.encodedAuth + '&sourceOfTruth=' + sot + "&transactionID=" + scope.transactionId;
						$http.jsonp(url)
						.success(function (data) {
							if(data.status == "SUCCESS") {  
								mappedItems = $.map(data.payload, function (p) {
									return{
										label: p.fullAddress,
									};
								});
							}

							return response(mappedItems);
						});
					},

					select: function (event, ui) {
						event.preventDefault();
						$(this).val(ui.item.label);	
					},

					change: function (event, ui) {
						var
						currentValue = element.val(),
						matchingItem = null;

						for (var i = 0; i < mappedItems.length; i++) {
							if (mappedItems[i].label === currentValue) {
								matchingItem = mappedItems[i].label;
								break;
							}
						}                        

						if (!matchingItem) {
							scope.$apply(function (scope) {
								modelAccessor.assign(scope, null);
							});
						}
					}
				});

			}
		}

	}
	
	function init($scope,  $attrs, $http) {
		$scope.encodedAuth = btoa($attrs.hraLogin);
		$scope.baseUrl = $attrs.hraUrl||"https://hosted.mastersoftgroup.com";  
		$http.jsonp( $scope.baseUrl+'/harmony/rest/au/generateID?callback=JSON_CALLBACK' + '&Authorization=Basic+' +  $scope.encodedAuth).then(function(resp) {
			if (resp.data.status = 'SUCCESS'){
				$scope.transactionId = resp.data.payload
			} else {
				$scope.transactionId = "";
			}
		});		        	


	}

}]);
