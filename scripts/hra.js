'use strict';

angular
  .module('harmonyHosted.service', [])
/**
 * @ngdoc service
 * @name HRAService
 * @description A service is responsible for retrieving address.
 */
  .provider('HRAService', function(){
	  /**
	   * @ngdoc property
	   * @name _params
	   * @description default settings for the service.
	   */
	  var _params = {
		serviceURL: "/harmony/rest/", //Default Harmony's Restful service URL.
		minimumInputLength: 5,  //Minimum length of a given input when the implementation starts sending requests. 
		waitMillis : 300 //Number of milliseconds without and input before the implementation starts sending requests.
	  }
	  
	  var SOTs = {'AU': 'AUPAF', 'NZ': 'NZPAF'};

	  /**
	   * @ngdoc method
	   * @name setParams
	   * @param {object} An object storing customized settings.
	   * @description A method which is responsible to override default service settings.
	   * 
	   * {@link _params} 
	   */
	  this.setParams = function(params){
		  for(var key in params){
			  var value = params[key];
			  //TODO validation. E.g. number is NaN or negative, note about 0 and false.
			  _params[key] = value;
		  }

		  //console.debug(_params);
	  }

	  /**
	   * @override
	   */
	  this.$get = function($http, $q, $interval, $log){
		  return new HRAService($http, $q, $interval, $log);
	  }

	  function HRAService($http, $q, $interval, $log){
		  var that = this;
		  var timer;

		  /**
		   * @ngdoc function
		   * @name getFullAddress
		   * @param {string} a partial address.
		   * @param {authToken} a authentication token (OPTIONAL). 
		   * 
		   * TODO maybe pass a settings to override the default settings.
		   * {@link setParams} 
		   */
		  this.getFullAddress = function(val, countryCode, authToken){
			  var	token = authToken || _params.authToken,
			  		deferred = $q.defer(),
			  		locale = (countryCode ? countryCode.toUpperCase() : undefined) || 'AU';
			  
			  $interval.cancel(timer);

			  if (!token || token.trim().length == 0){
				  deferred.reject({'data': {'status': 'AUTH_REQUIRED'}});
			  } else if (val.length < _params.minimumInputLength){
				  deferred.reject({'data': {'status': 'INSUFFICIENT_REQUEST'}});
			  } else {
				  var encodedAuth = btoa(token);
				  var url = _params.serviceURL + locale.toLowerCase() + '/address?callback=JSON_CALLBACK&fullAddress=' 
				  				+ val + '&Authorization=Basic+'
				  				+ encodedAuth + '&sourceOfTruth=' + SOTs[locale];
				  timer = $interval(function(){
					  $log.debug('Sending a request back to the Restful service ...');
				  }, _params.waitMillis, 1);
				  return timer.then(function(){return $http.jsonp(url)})
			  }

			  $log.debug('HRA fast-failed response!');
			  return deferred.promise;
		  }

		  /**
		   * @ngdoc function
		   * @name getAddress
		   * @param {string} a partial address.
		   * @returns {object} a promise storing list of possible addresses returned by HRA service.
		   * @description This function is a convenient method which is desgined to work with AngularJs's 
		   * 'typehead' plug-in, it will transform data (if available) returned from the service to what the
		   * plug-in expects. 
		   * 
		   */
		  this.getAddress = function(val, countryCode){
			  var _supportedCountries = ['AU', 'NZ'];
			  if (!countryCode 
					  || _supportedCountries.indexOf(countryCode.toUpperCase()) == -1){
				  return [];
			  }
			  
			  return that.getFullAddress(val, countryCode).then(function(resp) {
				  var addresses=[];
				  angular.forEach(resp.data.payload, function(item){
					  addresses.push(item.fullAddress);
				  });

				  return addresses;
			  });
		  }
	  }
  });
