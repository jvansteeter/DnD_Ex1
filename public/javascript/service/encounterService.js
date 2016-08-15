var clientApp = angular.module('clientApp');

clientApp.service('Encounter', function ($http, $q, Profile)
{
    var encounterService = {};
    var encounterState;
    var encounterID;

    encounterService.init = function(inputID)
    {
        encounterID = inputID;
        var deferred = $q.defer();
        Profile.async().then(function()
        {
            var user = Profile.getUser();
            Profile.setUser(user);

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
            encounterState = data;
            deferred.resolve();
        }).error(function()
        {
            deferred.reject();
        });

        return deferred.promise;
    };

    encounterService.getEncounterState = function()
    {
        return encounterState;
    };

    encounterService.isHost = function()
    {
        if (encounterState.host == Profile.getUserID())
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