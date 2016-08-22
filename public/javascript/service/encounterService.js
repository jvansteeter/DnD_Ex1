var clientApp = angular.module('clientApp');

clientApp.factory('Encounter', function ($http, $q, Profile)
{
    var encounterService = {};

    encounterService.encounterState = {};
    encounterService.updateHasRun = false;

    encounterService.init = function (inputID)
    {
        encounterService.encounterID = inputID;
        var deferred = $q.defer();
        Profile.async().then(function ()
        {
            $http.get('api/encounter/' + encounterService.encounterID).success(function (data)
            {
                encounterService.update().then(function ()
                {
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    };

    encounterService.update = function ()
    {
        var deferred = $q.defer();

        var url = 'api/encounter/encounterstate/' + encounterService.encounterID;

        $http.get(url).success(function (data)
        {
            encounterService.encounterState = data;
            encounterService.updateHasRun = true;
            deferred.resolve();
        }).error(function ()
        {
            deferred.reject();
        });

        return deferred.promise;
    };

    encounterService.isHost = function ()
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

    encounterService.sendMapData = function (mapResX, mapResY, mapDimX, mapDimY)
    {
        var url = 'api/encounter/updatemapdata/' + encounterService.encounterID;

        var data = {
            mapDimX: mapDimX,
            mapDimY: mapDimY,
            mapResX: mapResX,
            mapResY: mapResY
        };

        $http.post(url, data).success(function (data)
        {

        }).error(function ()
        {

        })
    };

    encounterService.connect = function ()
    {
        var id = Profile.getUserID();
        var username = Profile.getFirstName() + " " + Profile.getLastName();
        var url = 'api/encounter/connect/' + encounterService.encounterID;
        var data = {
            id: id,
            username: username
        };
        $http.post(url, data).success(function(data)
        {
            encounterService.update();
        });
    };

    encounterService.disconnect = function()
    {
        console.log("disconnecting user");
        var url = 'api/encounter/disconnect/' + encounterService.encounterID;
        var data = {
            id: Profile.getUserID()
        };
        $http.post(url, data).success(function(data)
        {
            encounterService.update();
        });
    };

    return encounterService;
});