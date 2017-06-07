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

    encounterService.hoverCell = null;

    encounterService.gridEnabled = true;

    encounterService.updateHasRun = false;

    encounterService.tileSize = 50;
    encounterService.map_transform = {x:0, y:0, scale:1};
    encounterService.canvas_state = {res_x:0, res_y: 0, clear_offset: 1000};

    var note_uid_tally = 3;
    encounterService.selected_note_uid = null;
    encounterService.mock_notes = [
    ];

    encounterService.addNote = function()
    {
        var url = 'api/encounter/addmapnotation/' + encounterService.encounterState._id;
        $http.get(url).then(function()
        {
            encounterService.update();
        });

        encounterService.mock_notes.push({
            uid: note_uid_tally,
            userId: '',
            text: 'Default Text',
            color: 'hsla(0,0%,0%,1)',
            cells: []
        });
    };

    encounterService.removeNote = function(note)
    {
        console.log(note);
        var noteId = note._id;
        for(var i = 0; i < encounterService.mock_notes.length; i++)
        {
            if(encounterService.mapNotations[i]._id === noteId)
            {
                var url = 'api/encounter/removemapnotation/' + encounterService.encounterState._id;
                var data = {
                    mapNotationId: noteId
                };
                $http.post(url, data).then(function()
                {
					console.log('Doing a thing');
					encounterService.update();
					// encounterService.mock_notes.splice(i,1);
                })
            }
        }
    };

    encounterService.updateNote = function (note)
    {
        console.log('attempting to update note');
        var url = 'api/encounter/updatemapnotation';
        var data = {
            mapNotation: note
        };
        $http.post(url, data).then(function()
        {
            encounterService.update();
			socket.emit('update:encounter');
        })
    };

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
        if (encounterService.encounterState.hostId === Profile.getUserId())
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

	encounterService.updateMapNotation = function(index)
	{
		var player = encounterService.encounterState.mapNotation[index];
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