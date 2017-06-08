var clientApp = angular.module('clientApp');

clientApp.service('EncounterService', function ($http, $q, Profile, socket, $uibModal) {
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
    encounterService.map_transform = {x: 0, y: 0, scale: 1};
    encounterService.canvas_state = {res_x: 0, res_y: 0, clear_offset: 1000};

    encounterService.selected_note_uid = null;

    encounterService.modalCharacters = null;
    var characterModal = null;

    encounterService.init = function (inputID) {
        encounterService.encounterID = inputID;
        var deferred = $q.defer();
        Profile.async().then(function () {
            $http.get('api/encounter/' + encounterService.encounterID).success(function (data) {
                encounterService.update().then(function () {
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    };

    /***********************************************************************************************
     * NOTATION FUNCTIONS
     ***********************************************************************************************/
    encounterService.addNote = function () {
        var url = 'api/encounter/addmapnotation/' + encounterService.encounterState._id;
        $http.get(url).then(function () {
            socket.emit('update:encounter');
            encounterService.update();
        });
    };

    encounterService.removeNote = function (note) {
        var url = 'api/encounter/removemapnotation/' + encounterService.encounterState._id;
        var data = {
            mapNotationId: note._id
        };
        $http.post(url, data).then(function () {
            socket.emit('update:encounter');
            encounterService.update();
        });
    };

    encounterService.updateNote = function (note) {
        console.log('EncounterService updateNote');
        var url = 'api/encounter/updatemapnotation';
        var data = {
            mapNotation: note
        };
        $http.post(url, data).then(function () {
            socket.emit('update:encounter');
            encounterService.update();
        })
    };


    /***********************************************************************************************
     * ENCOUNTER FUNCTIONS
     ***********************************************************************************************/
    encounterService.update = function () {
        var deferred = $q.defer();

        var url = 'api/encounter/encounterstate/' + encounterService.encounterID;

        $http.get(url).success(function (data) {
            encounterService.encounterState = data;
            encounterService.updateHasRun = true;
            deferred.resolve();
        }).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    };

    encounterService.setUpdateHasRunFlag = function (value) {
        this.updateHasRun = value;
    };


    encounterService.isHost = function () {
        return encounterService.encounterState.hostId === Profile.getUserId();
    };

    /***********************************************************************************************
     * PLAYER FUNCTIONS
     ***********************************************************************************************/
    encounterService.updatePlayer = function (index) {
        var player = encounterService.encounterState.players[index];
        var url = 'api/encounter/updateplayer';
        var data = {
            player: player
        };
        $http.post(url, data).success(function (data) {
            socket.emit('update:player', encounterService.encounterState.players[index]);
        });
    };
    encounterService.listModalGetCharacters = function(){
        var url = 'api/character/all/' + Profile.getUserId();
        $http.get(url).success(function (data) {
            encounterService.modalCharacters = data.characters;
        });
    };

    encounterService.getModalCharacters = function(){
        return encounterService.modalCharacters;
    };

    encounterService.addCharacter = function(scope){
        characterModal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/listCharactersModal.html',
            scope: scope,
            size: ''
        });
    };

    encounterService.listModalSelectCharacter = function(index){
        // var encounterId = $scope.encounterState._id;

        var url = 'api/encounter/addcharacter/' + encounterService.encounterState._id;
        var data =
        {
            characterId: encounterService.modalCharacters[index]._id
        };

        $http.post(url, data).success(function (data) {
            socket.emit('update:encounter');
            encounterService.update();
            characterModal.close();
        });
    };


    /***********************************************************************************************
     * MAP FUNCTIONS
     ***********************************************************************************************/
    encounterService.sendMapData = function (mapResX, mapResY, mapDimX, mapDimY) {
        var url = 'api/encounter/updatemapdata/' + encounterService.encounterID;

        var data = {
            mapDimX: mapDimX,
            mapDimY: mapDimY,
            mapResX: mapResX,
            mapResY: mapResY
        };

        $http.post(url, data).success(function (data) {

        }).error(function () {

        })
    };

    /***********************************************************************************************
     * SOCKET FUNCTIONS
     ***********************************************************************************************/
    socket.on('update:encounter', function (data) {
        encounterService.update();
    });


    return encounterService;
});