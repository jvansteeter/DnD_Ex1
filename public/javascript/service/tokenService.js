var clientApp = angular.module('clientApp');

clientApp.factory('TokenService', function (ImageLoader, $q)
{
	var tokenService = {};

	tokenService.tokens = {};

	tokenService.getPlayerIconById = function(playerId)
	{
		var deferred = $q.defer();
		var url = 'api/image/encounterplayer/';
		var cached = false;

		for (var id in tokenService.tokens)
		{
			if (id === playerId)
			{
				cached = true;
				deferred.resolve(tokenService.tokens[id]);
			}
		}

		// var tokenImage = new Image();
		// tokenImage.src = "api/image/encounterplayer/" + playerId;
		// tokenService.tokens[playerId] = tokenImage;
		// var tokenSrc = url + playerId;
		// ImageLoader.loadImage(tokenSrc).then(function(loadedSrc)
		// {
		// 	tokenService.tokens[playerId] = loadedSrc;
		// 	deferred.resolve(loadedSrc);
		// });

		if (!cached)
		{
			var img = new Image();
			img.onload = function()
			{
				var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext('2d').drawImage(img,0,0);
				var dataURI = canvas.toDataURL('image/png');

				console.log(dataURI);
				tokenService.tokens[playerId] = dataURI;
				deferred.resolve(dataURI);
			};
			img.src = url + playerId;
		}

		return deferred.promise;
	};

	return tokenService;
});