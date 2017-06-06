var clientApp = angular.module('clientApp');

clientApp.factory('EncounterService', function ($http, $q, Profile, socket)
{
    var encounterService = {};

    encounterService.encounterState = {
        mapDimX: 0,
        mapDimY: 0,
        mapResX: 0,
        mapResY: 0
    };

    encounterService.updateHasRun = false;

    encounterService.tileSize = 50;
    encounterService.map_transform = {x:0, y:0, scale:1};
    encounterService.canvas_state = {res_x:0, res_y: 0, clear_offset: 1000};


    encounterService.mock_notes = [
        {
            owner:'bob',
            text:'Fire',
            color:'hsl(0,100%,50%)',
            cells:[
                {x:0, y:1},
                {x:2, y:4}
            ]
        },
        {
            owner:'bob',
            text:'Water',
            color:'hsl(240,100%,50%)',
            cells:[
                {x:3, y:1},
                {x:2, y:2}
            ]
        },
        {
            owner:'bob',
            text:'Lightning',
            color:'hsl(48,100%,50%)',
            cells:[
                {x:1, y:2},
                {x:4, y:3}
            ]
        }
    ];

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

    encounterService.updatePlayer = function(index)
    {
        var player = encounterService.encounterState.players[index];
        var url = 'api/encounter/updateplayer';
        var data = {
            player: player
        };
        $http.post(url, data).success(function(data)
        {
            socket.emit('update:player', encounterService.encounterState.players[index]);
        });
    };

    encounterService.setUpdateHasRunFlag = function(value)
    {
        this.updateHasRun = value;
    };

    encounterService.pushNotes = function(){

    };

    return encounterService;
});