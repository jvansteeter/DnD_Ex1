'use strict';

var clientApp = angular.module('clientApp');

clientApp.config(function ($modalProvider) {
    angular.extend($modalProvider.defaults, {
        html: true
    });
});

clientApp.controller('encounterController', function ($scope, $document, $http, $q, socket, Profile, mapMain, EncounterService, $uibModal, $mdSidenav) {
    var encounterID = window.location.search.replace('?', '');
    var modal;
    var selectedPlayer = -1;

    $scope.encounterState = {};
    $scope.host = false;
    $scope.popoverTemplate = 'modal/playerHitPointsPopover.html';

    $scope.notes = EncounterService.mock_notes;
    $scope.note_options = {
        format: ['hsl'],
        swatchOnly: true
    };

    $scope.toggleNoteSelected = function (note) {
        if (note.uid !== EncounterService.selected_note_uid) {
            EncounterService.selected_note_uid = note.uid;
        }
        else {
            EncounterService.selected_note_uid = null;
        }
    };

    $scope.isNoteSelected = function (note) {
        if (note.uid === EncounterService.selected_note_uid)
            return true;
        else
            return false;
    };

    $scope.toggleGrid = function () {
        EncounterService.gridEnabled = !EncounterService.gridEnabled;
    };

    $scope.gridState = function () {
        return EncounterService.gridEnabled;
    };

    $scope.addNote = function(){
        EncounterService.addNote();
    };

    $scope.removeNote = function(note){
        console.log(note);
        EncounterService.removeNote(note);
    };

    socket.on('init', function () {
        EncounterService.init(encounterID).then(function () {
            $scope.host = EncounterService.isHost();
            $scope.encounterState = EncounterService.encounterState;

            if (!$scope.encounterState.initialized) {
                modal = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/initializeMapModal.html',
                    scope: $scope,
                    backdrop: 'static',
                    size: ''
                });
            }

            var id = Profile.getUserID();
            var username = Profile.getFirstName() + " " + Profile.getLastName();
            socket.emit('join',
                {
                    room: encounterID,
                    id: id,
                    username: username
                });

            EncounterService.connect();
        });
    });

    socket.on('new:joined', function (data) {
        console.log("New user has joined");
        console.log(data);
    });

    socket.on('exit', function (data) {
        console.log(data.username + " has left the chat room");
        // Encounter.disconnect(data.id);
    });

    socket.on('update:encounter', function (data) {
        $scope.updateEncounterState();
    });

    socket.on('update:player', function (player) {
        player.isHovered = false;
        for (var i = 0; i < EncounterService.encounterState.players.length; i++) {
            if (EncounterService.encounterState.players[i]._id === player._id) {
                if (angular.isDefined(EncounterService.encounterState.players[i].isSelected) && EncounterService.encounterState.players[i].isSelected === true) {
                    player.isSelected = true;
                }
                else {
                    player.isSelected = false;
                }
                for (var value in player) {
                    EncounterService.encounterState.players[i][value] = player[value];
                    $scope.encounterState = EncounterService.encounterState;
                }
            }
        }
    });

    socket.on('encounter:end', function (data) {
        if (data.encounterID === encounterID) {
            $scope.status = 'ENDED'
        }
    });

    $scope.uploadMapPhoto = function ($flow) {
        $flow.upload();
        $flow.files[0] = $flow.files[$flow.files.length - 1];

        var url = 'api/encounter/uploadmap/' + encounterID;
        var fd = new FormData();
        fd.append("file", $flow.files[0].file);
        $http.post(url, fd, {
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (data) {
            $scope.updateEncounterState();
            modal.close();
        });
    };

    $scope.initWithoutMap = function () {
        var url = 'api/encounter/initwithoutmap/' + encounterID;
        $http.get(url).success(function (data) {
            $scope.updateEncounterState();
            modal.close();
        });
    };

    $scope.updateEncounterState = function () {
        EncounterService.update().then(function () {
            $scope.encounterState = EncounterService.encounterState;
        });
    };

    $scope.isHost = function () {
        return $scope.host;
    };

    $scope.isNPC = function (index) {
        return $scope.encounterState.players[index].npc;
    };

    $scope.isMyCharacter = function (player) {
        return (Profile.getUserID() === player.userID);
    };

    $scope.isVisible = function (index) {
        return $scope.encounterState.players[index].visible;
    };

    $scope.toggleVisible = function (player) {
        for (var i = 0; i < $scope.encounterState.players.length; i++) {
            if ($scope.encounterState.players[i]._id === player._id) {
                EncounterService.encounterState.players[i].visible = !EncounterService.encounterState.players[i].visible;
                $scope.encounterState = EncounterService.encounterState;
                updateServerPlayer(EncounterService.encounterState.players[i]);
                return;
            }
        }
    };

    $scope.healPlayer = function (hit) {
        console.log("Heal player");
        console.log(EncounterService.encounterState.players[selectedPlayer]);
        console.log(hit);
        if (hit === 0 || isNaN(hit)) {
            return;
        }

        $scope.encounterState.players[selectedPlayer].hitPoints = $scope.encounterState.players[selectedPlayer].hitPoints + hit;
        $scope.showPopover = false;
        updateServerPlayer($scope.encounterState.players[selectedPlayer]);
    };

    $scope.damagePlayer = function (hit) {
        $scope.healPlayer(-hit);
    };

    $scope.setInitiative = function (initiative) {
        if (initiative < 1 || isNaN(initiative)) {
            return;
        }

        var url = 'api/encounter/setinitiative';
        var data =
            {
                playerID: $scope.encounterState.players[selectedPlayer]._id,
                initiative: initiative
            };
        $http.post(url, data).success(function (data) {
            socket.emit('update:encounter',
                {
                    encounterID: encounterID
                });

            $scope.updateEncounterState();
        });
    };

    $scope.removePlayer = function (player) {
        var url = 'api/encounter/removeplayer/' + encounterID;
        var data =
            {
                playerID: player._id
            };

        $http.post(url, data).success(function (data) {
            socket.emit('update:encounter',
                {
                    encounterID: encounterID
                });

            $scope.updateEncounterState();
        });
    };

    $scope.listModalgetCharacters = function () {
        var url = 'api/character/all/' + Profile.getUserID();
        $http.get(url).success(function (data) {
            $scope.characters = data.characters;
        });
    };

    $scope.addCharacter = function () {
        modal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/listCharactersModal.html',
            scope: $scope,
            size: ''
        });
    };

    $scope.listModalselectCharacter = function (index) {
        var encounterID = $scope.encounterState._id;

        var url = 'api/encounter/addcharacter/' + encounterID;
        var data =
            {
                characterID: $scope.characters[index]._id
            };

        $http.post(url, data).success(function (data) {
            socket.emit('update:encounter',
                {
                    encounterID: encounterID
                });
            $scope.updateEncounterState();
            modal.close();
        });
    };

    $scope.listModalgetNPCs = function () {
        var url = 'api/npc/all/';
        $http.get(url).success(function (data) {
            $scope.npcs = data.npcs;
        });
    };

    $scope.addNPC = function () {
        modal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/listNPCModal.html',
            scope: $scope,
            size: ''
        });
    };

    $scope.listModalselectNPC = function (index) {
        var encounterID = $scope.encounterState._id;

        var url = 'api/encounter/addnpc/' + encounterID;
        var data =
            {
                npcID: $scope.npcs[index]._id
            };

        $http.post(url, data).success(function (data) {
            socket.emit('update:encounter',
                {
                    encounterID: encounterID
                });
            $scope.updateEncounterState();
            modal.close();
        });
    };

    $scope.submit = function () {
        var url = 'api/encounter/setactive/' + encounterID;
        var active = !$scope.encounterState.active;
        var data =
            {
                active: active
            };

        $http.post(url, data).success(function (data) {
            if (data === "OK") {
                socket.emit('encounter:end',
                    {
                        encounterID: encounterID
                    });
                socket.emit('new:encounter', {});
                $scope.encounterState.active = active;
                // modal.close();
            }
        });
    };

    $scope.setNPCtoEdit = function (index) {
        $scope.editNPC = JSON.parse(JSON.stringify($scope.encounterState.players[index]));
    };

    $scope.editModalSave = function () {
        var url = "api/encounter/updateplayer";
        var data =
            {
                player: $scope.editNPC
            };
        $http.post(url, data).success(function (data) {
            if (data === "OK") {
                socket.emit('update:encounter',
                    {
                        encounterID: encounterID
                    });
                $scope.updateEncounterState();
            }
        });
    };

    $scope.getColor = function (player) {
        if (player.npc) {
            if (player.name === 'Commoner') {
                return "rgba(0, 255, 0, 0.3)";
            }
            return "rgba(255, 0, 0, 0.3)";
        }
        else {
            return "rgba(51, 122, 183, 0.3)";
        }
    };

    $scope.setHover = function (player) {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++) {
            if (EncounterService.encounterState.players[i]._id === player._id) {
                EncounterService.encounterState.players[i].isHovered = true;
            }
            else {
                EncounterService.encounterState.players[i].isHovered = false;
            }
        }
    };

    $scope.removeHover = function (player) {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++) {
            EncounterService.encounterState.players[i].isHovered = false;
        }
    };

    $scope.isHovered = function (player) {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++) {
            if (EncounterService.encounterState.players[i]._id === player._id && (EncounterService.encounterState.players[i].isHovered || EncounterService.encounterState.players[i].isSelected)) {
                if (EncounterService.encounterState.players[i].isSelected) {
                    return "background-color: rgba(0,0,0,.2); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
                }

                if (EncounterService.encounterState.players[i].isHovered) {
                    return "background-color: rgba(0,0,0,0.05); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
                }
            }
        }

        return "";
    };

    $scope.selectPlayer = function (player) {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++) {
            if (EncounterService.encounterState.players[i]._id === player._id) {
                if (EncounterService.encounterState.players[i].isSelected) {
                    EncounterService.encounterState.players[i].isSelected = false;
                }
                else {
                    selectedPlayer = i;
                    EncounterService.encounterState.players[i].isSelected = true;
                }
            }
            else {
                EncounterService.encounterState.players[i].isSelected = false;
            }
        }
    };


    // ********************************************************************************************
    // Sidenav Features
    // ********************************************************************************************
    $scope.toggleMenu = function () {
        $mdSidenav('side_menu').toggle();
    };


    // $scope.toggleEncounterOpen = function()
    // {
    // 	// if ($scope.encounterState.active)
    // 	// {
    // 	// 	$scope.areYouSureTitle = "Close Encounter?";
    // 	// }
    // 	// else
    // 	// {
    // 	// 	$scope.areYouSureTitle = "Open Encounter?";
    // 	// }
    // 	modal = $uibModal.open({
    // 		animation: true,
    // 		templateUrl: 'modal/areYouSureModal.html',
    // 		scope: $scope,
    // 		size: ''
    // 	});
    // };

    function updateServerPlayer(player) {
        var url = 'api/encounter/updateplayer';
        var data =
            {
                player: player
            };
        $http.post(url, data).success(function (data) {
            if (data === "OK") {
                socket.emit('update:player', player);
            }
        });
    }
});