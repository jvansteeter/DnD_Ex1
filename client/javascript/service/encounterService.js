var clientApp = angular.module('clientApp');

clientApp.service('EncounterService', function ($http, $q, Profile, socket, $uibModal) {
    this.encounterState = {
        mapDimX: 0,
        mapDimY: 0,
        mapResX: 0,
        mapResY: 0
    };

    this.hoverCell = null;

    this.gridEnabled = true;

    this.updateHasRun = false;

    this.tileSize = 50;
    this.map_transform = {x: 0, y: 0, scale: 1};
    this.canvas_state = {res_x: 0, res_y: 0, clear_offset: 1000};

    this.selected_note_uid = null;

    this.modalCharacters = null;
    var characterModal = null;

    this.input_mode = 'default';        // default, note
    this.note_mode = 'sphere';          // sphere, --square, --cone
    this.note_size = 0;
    this.note_visibility_states = [];   // {note_id: String, state: {full, ghost, off, locked}}
    this.note_brush_sizes = [];         // {note_id: String, size: Number}

    this.mouse_scn_res = null;
    this.mouse_map_res = null;
    this.mouse_cell = null;
    this.mouse_corner = null;

    this.corner_ratio = 0.35;
    this.corner_threshold = this.tileSize * this.corner_ratio * 0.5;

    this.init = function (inputID) {
        this.encounterID = inputID;
        var deferred = $q.defer();
        Profile.async().then(function () {
            this.update().then(function () {
                deferred.resolve();
            });
        }.bind(this));

        return deferred.promise;
    }.bind(this);


    /***********************************************************************************************
     * NOTATION FUNCTIONS
     ***********************************************************************************************/
    /**
     * Invokes a HTTP request that adds a default note to the encounter on the server, then emits a socket call
     * to provoke updates to all clients
     */
    this.addNote = function ()
    {
        // var url = 'api/encounter/addmapnotation/' + this.encounterState._id;
        socket.emit('add:mapNotation');

        // $http.get(url).then(function ()
        // {
        //     socket.emit('update:encounter');
        //     this.update();
        // }.bind(this));
    }.bind(this);

    /**
     * Invokes a HTTP request that removes a specific note from an encounter, then emits a socket call
     * to provoke updates to all clients
     * @param note: the complete JSON object that represents the note to remove
     */
    this.removeNote = function (note) {
        if(note._id === this.selected_note_uid){
            this.selected_note_uid = null;
            this.input_mode = 'default';
        }

        socket.emit('remove:mapNotation', note);

        // var url = 'api/encounter/removemapnotation/' + this.encounterState._id;
        // var data = {
        //     mapNotationId: note._id
        // };
        // $http.post(url, data).then(function () {
        //     socket.emit('update:encounter');
        //     this.update();
        // }.bind(this));
    }.bind(this);

    /**
     * Invokes a HTTP request that updates a specific note from an encounter, then emits a socket call
     * to provoke updates to all clients
     * @param note: the complete JSON object that represents the note to update
     */
    this.updateNote = function (note)
    {
        var url = 'api/encounter/updatemapnotation';
        var data = {
            mapNotation: note
        };
        $http.post(url, data).then(function ()
        {
			socket.emit('update:mapNotation', note);
        }.bind(this))
    }.bind(this);

    this.getCurrentNote = function () {
        if (this.selected_note_uid === null)
            return null;
        else
            return this.getNoteById(this.selected_note_uid);
    }.bind(this);

    this.getNoteById = function (note_id) {
        for (i = 0; i < this.encounterState.mapNotations.length; i++) {
            if (this.encounterState.mapNotations[i]._id === note_id) {
                return this.encounterState.mapNotations[i];
            }
        }
        return null;
    }.bind(this);

    this.isNoteOwner = function(note){
        return note.userId === Profile.getUserId();
    }.bind(this);

    this.loadNotes = function(){
        var note_found;

        for(i = 0; i < this.encounterState.mapNotations.length; i++){
            var note = this.encounterState.mapNotations[i];
            note_found = false;

            for(j = 0; j < this.note_visibility_states.length; j++){
                var note_state = this.note_visibility_states[j];
                if(note._id === note_state.noteId){
                    note_found = true;

                    // if I am the note owner, don't mess with the note visibility
                    if(this.isNoteOwner(note)){
                        break;
                    }

                    // if I am not the note owner and the note is locked, lock it locally
                    if(!note.canHide){
                        note_state.state = "locked";
                    }
                    else{
                        // otherwise, set it to full
                        note_state.state = "full";
                    }
                    break;
                }
            }
            if(!note_found){
                // add an entry into the note visibility state
                if(note.canHide)
                    this.note_visibility_states.push({noteId: note._id, state: "full"});
                else{
                    if(this.isNoteOwner(note)){
                        this.note_visibility_states.push({noteId: note._id, state: "full"});
                    }
                    else{
                        this.note_visibility_states.push({noteId: note._id, state: "locked"});
                    }
                }
            }
        }
    }.bind(this);

    this.getNoteVisibilityObject = function(note){
        for(var i = 0; i < this.note_visibility_states.length; i++){
            var vis_state = this.note_visibility_states[i];
            if(vis_state.noteId === note._id){
                return vis_state;
            }
        }
    }.bind(this);

    this.addMapNotation = function(note)
    {
        this.encounterState.mapNotations.push(note);
        this.loadNotes();
        this.updateHasRun = true;
    }.bind(this);

    this.removeMapNotation = function(note)
    {
        for (var i = 0; i < this.encounterState.mapNotations.length; i++)
        {
            var currentNote = this.encounterState.mapNotations[i];
            if (currentNote._id === note._id)
            {
                this.encounterState.mapNotations.splice(i, 1);
                this.loadNotes();
                this.updateHasRun = true;
            }
        }
    }.bind(this);


    /***********************************************************************************************
     * ENCOUNTER FUNCTIONS
     ***********************************************************************************************/
    this.update = function ()
    {
        var deferred = $q.defer();
        var url = 'api/encounter/encounterstate/' + this.encounterID;
        $http.get(url).success(function (data) {
            this.encounterState = data;
            this.loadNotes();
            this.updateHasRun = true;
            deferred.resolve();
        }.bind(this)).error(function () {
            deferred.reject();
        });

        return deferred.promise;
    }.bind(this);

    this.toggleEncounterState = function () {
        var url = 'api/encounter/setactive/' + this.encounterID;
        var active = !this.encounterState.active;
        var data =
            {
                active: active
            };

        $http.post(url, data).success(function (data) {
            if (data === "OK") {
                socket.emit('encounter:end',
                    {
                        encounterId: this.encounterID
                    });
                socket.emit('new:encounter', {});
                this.encounterState.active = active;
            }
        }.bind(this));
    }.bind(this);

    this.setUpdateHasRunFlag = function (value) {
        this.updateHasRun = value;
    }.bind(this);


    this.isHost = function () {
        return this.encounterState.hostId === Profile.getUserId();
    }.bind(this);

    /***********************************************************************************************
     * PLAYER FUNCTIONS
     ***********************************************************************************************/
    this.clonePlayer = function (player)
    {
        var url = 'api/encounter/cloneplayer/' + this.encounterID;
        var data = {
            playerId: player._id
        };

        $http.post(url, data).success(function (player)
        {
            this.addPlayer(player);
            socket.emit('add:player', player);
        }.bind(this));
    }.bind(this);

    this.addPlayer = function(player)
    {
        this.encounterState.players.push(player);
        this.updateHasRun = true;
    }.bind(this);

    this.removePlayer = function(player)
    {
        for (var i = 0; i < this.encounterState.players.length; i++)
        {
            var currentPlayer = this.encounterState.players[i];
            if (currentPlayer._id === player._id)
            {
                this.encounterState.players.splice(i, 1);
                this.updateHasRun = true;
            }
        }
    }.bind(this);

    this.updatePlayer_byIndex = function (index) {
        var player = this.encounterState.players[index];
        var url = 'api/encounter/updateplayer';
        var data = {
            player: player
        };
        $http.post(url, data).success(function (data) {
            socket.emit('update:player', this.encounterState.players[index]);
        }.bind(this));
    }.bind(this);

    this.updatePlayer_byObject = function (player) {
        var url = 'api/encounter/updateplayer';
        var data =
            {
                player: player
            };
        $http.post(url, data).success(function (data) {
            if (data === "OK") {
                socket.emit('update:player', player);
            }
        }.bind(this));
    }.bind(this);

    this.listModalGetCharacters = function () {
        var url = 'api/character/all/' + Profile.getUserId();
        $http.get(url).success(function (data) {
            this.modalCharacters = data.characters;
        }.bind(this));
    }.bind(this);

    this.getModalCharacters = function () {
        return this.modalCharacters;
    }.bind(this);

    this.addCharacter = function (scope) {
        characterModal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/listCharactersModal.html',
            scope: scope,
            size: ''
        });
    };

    this.listModalSelectCharacter = function (index) {
        var url = 'api/encounter/addcharacter/' + this.encounterState._id;
        var data = {
            characterId: this.modalCharacters[index]._id
        };

        $http.post(url, data).success(function (player) {
            socket.emit('add:player', player);
            this.addPlayer(player);
            characterModal.close();
        }.bind(this));
    }.bind(this);

    this.setPlayer = function (player)
    {
        for (var i = 0; i < this.encounterState.players.length; i++)
        {
            if (this.encounterState.players[i]._id === player._id)
            {
                var localPlayer = this.encounterState.players[i];

                localPlayer.name = player.name;
                localPlayer.iconURL = player.iconURL;
                localPlayer.initiative = player.initiative;
                localPlayer.armorClass = player.armorClass;
                localPlayer.damage = player.damage;
                localPlayer.maxHitPoints = player.maxHitPoints;
                localPlayer.passivePerception = player.passivePerception;
                localPlayer.speed = player.speed;
                localPlayer.status = player.status;
                localPlayer.visible = player.visible;
                localPlayer.saves = player.saves;
                localPlayer.mapX = player.mapX;
                localPlayer.mapY = player.mapY;
                var j;
                for (j = 0; j < player.actions.length; j++)
                {
                    if (j >= localPlayer.actions.length)
                    {
                        localPlayer.actions.push({});
                    }

                    localPlayer.actions[j].name = player.actions[j].name;
                    localPlayer.actions[j].range = player.actions[j].range;
                    localPlayer.actions[j].details = player.actions[j].details;
                }
                if (j < localPlayer.actions.length)
                {
                    localPlayer.splice(j);
                }
            }
        }
    }.bind(this);

    /***********************************************************************************************
     * MAP FUNCTIONS
     ***********************************************************************************************/
    this.cellInBounds = function (cell) {
        if (cell === null)
            return false;

        if (cell.x < 0 || cell.y < 0)
            return false;

        if (cell.x >= this.encounterState.mapDimX || cell.y >= this.encounterState.mapDimY)
            return false;

        return true;
    }.bind(this);

    this.distanceToCellFromCell = function (start, end) {
        var distance = 0;
        var tenSpace = false;

        var deltaX = Math.abs(end.x - start.x);
        var deltaY = Math.abs(end.y - start.y);

        while (deltaX > 0 && deltaY > 0) {
            deltaX -= 1;
            deltaY -= 1;

            if (!tenSpace)
                distance += 5;
            else
                distance += 10;

            tenSpace = !tenSpace;
        }

        distance = distance + deltaX * 5 + deltaY * 5;
        return distance;
    }.bind(this);

    this.distanceToCornerFromCell = function (corner, cell) {
        var distance = 0;
        var tenSpace = true;

        var deltaX = Math.abs(cell.x - corner.x);
        var deltaY = Math.abs(cell.y - corner.y);

        while (deltaX > 0 && deltaY > 0) {
            deltaX -= 1;
            deltaY -= 1;

            if (!tenSpace)
                distance += 5;
            else
                distance += 10;

            tenSpace = !tenSpace;
        }

        distance = distance + deltaX * 5 + deltaY * 5;
        return distance;
    }.bind(this);

    this.sendMapData = function (mapResX, mapResY, mapDimX, mapDimY) {
        var url = 'api/encounter/updatemapdata/' + this.encounterID;

        var data = {
            mapDimX: mapDimX,
            mapDimY: mapDimY,
            mapResX: mapResX,
            mapResY: mapResY
        };

        $http.post(url, data).success(function (data) {

        }).error(function () {

        })
    }.bind(this);
});