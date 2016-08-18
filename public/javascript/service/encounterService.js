var clientApp = angular.module('clientApp');

clientApp.factory('Encounter', function ($http, $q, Profile)
{
    var encounterService = {};
    var encounterID;

    encounterService.encounterState = {};
    encounterService.updateHasRun = false;

    encounterService.init = function(inputID)
    {
        encounterID = inputID;
        var deferred = $q.defer();
        Profile.async().then(function()
        {
            $http.get('api/encounter/' + encounterID).success(function(data)
            {
                encounterService.update().then(function()
                {
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    };

    encounterService.update = function()
    {
        var deferred = $q.defer();

        var url = 'api/encounter/gamestate/' + encounterID;

        $http.get(url).success(function(data)
        {
            encounterService.encounterState = data;
            encounterService.updateHasRun = true;
            deferred.resolve();
        }).error(function()
        {
            deferred.reject();
        });

        return deferred.promise;
    };

    encounterService.isHost = function()
    {
        if (encounterService.encounterState.hostID === Profile.getUserID())
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    return encounterService;
});