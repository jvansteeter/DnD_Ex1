var clientApp = angular.module('clientApp');

clientApp.factory('socket', function($rootScope)
{
	var socket = io.connect();
	var service = {};

	service.on = function (eventName, callback) 
	{
  		socket.on(eventName, function () 
  		{  
    		var args = arguments;
    		$rootScope.$apply(function () 
    		{
      			callback.apply(socket, args);
    		});
  		});
	};

	service.emit = function (eventName, data, callback) 
	{
  		socket.emit(eventName, data, function () 
  		{
    		var args = arguments;
    		$rootScope.$apply(function () 
    		{
      			if (callback) 
      			{
        			callback.apply(socket, args);
      			}
    		});
  		})
	};

	return service;


  	/*return 
  	{
    	on: function (eventName, callback) 
    	{
      		socket.on(eventName, function () 
      		{  
        		var args = arguments;
        		$rootScope.$apply(function () 
        		{
          			callback.apply(socket, args);
        		});
      		});
    	},
    	emit: function (eventName, data, callback) 
    	{
      		socket.emit(eventName, data, function () 
      		{
        		var args = arguments;
        		$rootScope.$apply(function () 
        		{
          			if (callback) 
          			{
            			callback.apply(socket, args);
          			}
        		});
      		})
    	}
  	};*/
});