'use strict';

var clientApp = angular.module('clientApp');

clientApp.config(function ($modalProvider, $tooltipProvider)
{
    angular.extend($modalProvider.defaults, {
        html: true
    });
    angular.extend($tooltipProvider.defaults, {
        html: true
    })
});

clientApp.filter('keepNewLine', function()
{
    return function (input)
    {
        if (input === undefined)
        {
            return;
        }
        return input.replace(/\n/g, "<br />");
    }
});

clientApp.controller('encounterController', function ($scope, $document, $http, $q, EncounterSocketService, Profile, EncounterService, $uibModal, $mdSidenav, $mdDialog)
{
    var encounterId = window.location.search.replace('?', '');
    var modal;
    var selectedPlayer = -1;

    $scope.encounterState = {};
    $scope.host = false;
    $scope.popoverTemplate = 'modal/playerHitPointsPopover.html';

    this.init = function ()
    {
        EncounterService.init(encounterId).then(function ()
        {
            $scope.host = EncounterService.isHost();
            $scope.encounterState = EncounterService.encounterState;

            if (!$scope.encounterState.initialized)
            {
                modal = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal/initializeMapModal.html',
                    scope: $scope,
                    backdrop: 'static',
                    size: ''
                });
            }

            var id = Profile.getUserId();
            var username = Profile.getFirstName() + " " + Profile.getLastName();
            EncounterSocketService.emit('join', {
                room: encounterId,
                id: id,
                username: username
            });
            console.log(EncounterService.encounterState.players);
        });
    };

    /******************************************************************************************
     * PLAYER INFO PANEL and FUNCTIONS
     ******************************************************************************************/

    $scope.openedPlayerPanelIndex = -1;
    $scope.openPlayerSubPanel = -1;

    $scope.addAction = function (player)
    {
        player.actions.push({});
    };

    $scope.removeAction = function (player, index)
    {
        player.actions.splice(index, 1);
        $scope.updatePlayer(player);
    };

    $scope.panelIsOpen = function (index)
    {
        return (index === $scope.openedPlayerPanelIndex);
    };

    $scope.updatePlayer = function (player)
    {
        EncounterService.updatePlayer_byObject(player);
    };


    /******************************************************************************************
     * NOTATION VARIABLES and FUNCTIONS
     ******************************************************************************************/

    $scope.note_options = {
        format: ['hsl'],
        swatchOnly: true
    };
    $scope.notes_collapsed = false;
    $scope.clickNote = null;

    $scope.toggleNotes = function ()
    {
        $scope.notes_collapsed = !$scope.notes_collapsed;
    };

    $scope.noteClick = function (note)
    {
        $scope.clickNote = note;
    };

    $scope.getInputState = function ()
    {
        return EncounterService.input_mode;
    };

    $scope.getNoteMode = function ()
    {
        return EncounterService.note_mode;
    };

    $scope.toggleNoteSelected = function (note)
    {
        if (note._id !== EncounterService.selected_note_uid)
        {
            EncounterService.selected_note_uid = note._id;
            EncounterService.input_mode = 'note';
        }
        else
        {
            EncounterService.selected_note_uid = null;
            EncounterService.input_mode = 'default';
        }
    };

    $scope.isNoteSelected = function (note)
    {
        return note._id === EncounterService.selected_note_uid;
    };

    $scope.getNotes = function ()
    {
        return EncounterService.encounterState.mapNotations;
    };

    $scope.addNote = function ()
    {
        EncounterService.addNote();
    };

    $scope.removeNote = function (note)
    {
        EncounterService.removeNote(note);
    };

    $scope.updateNote = function (note)
    {
        EncounterService.updateNote(note);
    };

    $scope.onChangeText = function (note)
    {
        EncounterService.updateNote(note)
    };

    $scope.note_size = 0;

    $scope.increaseNoteSize = function ()
    {
        if (EncounterService.note_size < 120)
        {
            EncounterService.note_size += 5;
        }

        $scope.note_size = EncounterService.note_size;
    };

    $scope.decreaseNoteSize = function ()
    {
        if (EncounterService.note_size > 0)
        {
            EncounterService.note_size -= 5;
        }

        $scope.note_size = EncounterService.note_size;
    };

    $scope.toggleSphereMode = function ()
    {
        EncounterService.note_mode = 'sphere';
    };

    $scope.isNoteOwner = function (note)
    {
        return note.userId === Profile.getUserId();
    };

    $scope.canNoteHide = function (note)
    {
        return note.canHide;
    };

    $scope.isNotePublic = function (note)
    {
        return note.isPublic;
    };

    $scope.toggleNotePublic = function (note)
    {
        note.isPublic = !note.isPublic;
        EncounterService.updateNote(note);
    };

    $scope.toggleVisibilityControl = function (note)
    {
        note.canHide = !note.canHide;
        EncounterService.updateNote(note);
    };

    $scope.toggleVisibilitySetting = function (note)
    {
        var note_vis_state_container = EncounterService.getNoteVisibilityObject(note);
        switch (note_vis_state_container.state)
        {
            case 'full':
                note_vis_state_container.state = 'ghost';
                break;
            case 'ghost':
                note_vis_state_container.state = 'off';
                break;
            case 'off':
                note_vis_state_container.state = 'full';
                break;
            case 'locked':
                break;
        }
    };

    $scope.getNoteVisibility = function (note)
    {
        return EncounterService.getNoteVisibilityObject(note).state;
    };


    /******************************************************************************************
     * SIDENAV VARIABLES and FUNCTIONS
     ******************************************************************************************/
    $scope.toggleMenu = function ()
    {
        $mdSidenav('side_menu').toggle();
    };

    $scope.toggleGrid = function ()
    {
        EncounterService.gridEnabled = !EncounterService.gridEnabled;
    };

    $scope.gridState = function ()
    {
        return EncounterService.gridEnabled;
    };

    $scope.getEncounterState = function ()
    {
        return EncounterService.encounterState;
    };


    /******************************************************************************************
     * MAP VARIABLES and FUNCTIONS
     ******************************************************************************************/
    $scope.uploadMapPhoto = function ($flow)
    {
        $flow.upload();
        $flow.files[0] = $flow.files[$flow.files.length - 1];

        var url = 'api/encounter/uploadmap/' + encounterId;
        var fd = new FormData();
        fd.append("file", $flow.files[0].file);

        $http.post(url, fd, {
            withCredentials: false,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function (data)
        {
            EncounterService.update();
            modal.close();
        });
    };

    $scope.initWithoutMap = function ()
    {
        var url = 'api/encounter/initwithoutmap/' + encounterId;
        $http.get(url).success(function (data)
        {
            $scope.updateEncounterState();
            modal.close();
        });
    };


    /******************************************************************************************
     * PLAYER STATUS ZONE VARIABLES and FUNCTIONS
     ******************************************************************************************/
    $scope.isDead = function (player)
    {
        return player.maxHitPoints - player.damage <= 0;
    };

    $scope.hasRightsForPlayer = function (player)
    {
        return $scope.isHost() || $scope.isMyCharacter(player);
    };

    $scope.isHost = function ()
    {
        return $scope.host;
    };

    $scope.isNPC = function (index)
    {
        return EncounterService.encounterState.players[index].npc;
    };

    $scope.isMyCharacter = function (player)
    {
        return (Profile.getUserId() === player.userId);
    };

    $scope.isVisible = function (index)
    {
        return $scope.encounterState.players[index].visible;
    };

    $scope.toggleVisible = function (player)
    {
        var playerIndex = EncounterService.encounterState.players.indexOf(player);
        EncounterService.encounterState.players[playerIndex].visible = !EncounterService.encounterState.players[playerIndex].visible;

        EncounterService.updatePlayer_byObject(EncounterService.encounterState.players[playerIndex]);
    };

    $scope.healPlayer = function (hit)
    {
        if (hit === 0 || isNaN(hit))
        {
            return;
        }

        EncounterService.encounterState.players[selectedPlayer].damage += hit;

        $scope.showPopover = false;
        EncounterService.updatePlayer_byObject(EncounterService.encounterState.players[selectedPlayer]);
    };

    $scope.setInitiative = function (initiative)
    {
        if (initiative < 1 || isNaN(initiative))
        {
            return;
        }

        var player = EncounterService.encounterState.players[selectedPlayer];
        var url = 'api/encounter/setinitiative';
        var data = {
            playerId: player._id,
            initiative: initiative
        };
        $http.post(url, data).success(function ()
        {
            EncounterService.update().then(function ()
            {
                EncounterSocketService.emit('update:player', EncounterService.encounterState.players[selectedPlayer]);
            });
        });
    };

    $scope.removePlayer = function (player)
    {
        var url = 'api/encounter/removeplayer/' + encounterId;
        var data = {
            playerId: player._id
        };

        $http.post(url, data).success(function (data)
        {
            EncounterSocketService.emit('update:encounter');
            EncounterService.update();
        });
    };

    // Gets the characters associated with the Profile
    $scope.listModalgetCharacters = function ()
    {
        EncounterService.listModalGetCharacters();
    };

    $scope.getModalCharacters = function ()
    {
        return EncounterService.getModalCharacters();
    };

    // Activation function tied into the HTML
    $scope.addCharacter = function ()
    {
        EncounterService.addCharacter($scope);
    };

    //
    $scope.listModalselectCharacter = function (index)
    {
        EncounterService.listModalSelectCharacter(index);
    };

    $scope.listModalgetNPCs = function ()
    {
        var url = 'api/npc/all/';
        $http.get(url).success(function (data)
        {
            $scope.npcs = data.npcs;
        });
    };

    $scope.addNPC = function ()
    {
        modal = $uibModal.open({
            animation: true,
            templateUrl: 'modal/listNPCModal.html',
            scope: $scope,
            size: ''
        });
    };

    $scope.listModalselectNPC = function (index)
    {
        var encounterId = $scope.encounterState._id;

        var url = 'api/encounter/addnpc/' + encounterId;
        var data =
            {
                npcId: $scope.npcs[index]._id
            };

        $http.post(url, data).success(function (data)
        {
            EncounterSocketService.emit('update:encounter',
                {
                    encounterId: encounterId
                });
            EncounterService.update();
            modal.close();
        });
    };

    $scope.showAddNPCModal = function (event)
    {
		$mdDialog.show({
            controller: this,
            templateUrl: 'modal/encounterAddNPCDialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        }).then()
    }.bind(this);

    $scope.toggleEncounterState = function ()
    {
        EncounterService.toggleEncounterState();
    };

    $scope.setNPCtoEdit = function (index)
    {
        $scope.editNPC = JSON.parse(JSON.stringify($scope.encounterState.players[index]));
    };

    $scope.editModalSave = function ()
    {
        var url = "api/encounter/updateplayer";
        var data =
            {
                player: $scope.editNPC
            };
        $http.post(url, data).success(function (data)
        {
            if (data === "OK")
            {
                EncounterSocketService.emit('update:encounter',
                    {
                        encounterId: encounterId
                    });
                EncounterService.update();
            }
        });
    };

    $scope.getColor = function (player)
    {
        if (player.npc)
        {
            if (player.name === 'Commoner')
            {
                return "rgba(0, 255, 0, 0.3)";
            }
            return "rgba(255, 0, 0, 0.3)";
        }
        else
        {
            return "rgba(51, 122, 183, 0.3)";
        }
    };

    $scope.setHover = function (player)
    {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++)
        {
            if (EncounterService.encounterState.players[i]._id === player._id)
            {
                EncounterService.encounterState.players[i].isHovered = true;
            }
            else
            {
                EncounterService.encounterState.players[i].isHovered = false;
            }
        }
    };

    $scope.removeHover = function (player)
    {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++)
        {
            EncounterService.encounterState.players[i].isHovered = false;
        }
    };

    $scope.isHovered = function (player)
    {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++)
        {
            if (EncounterService.encounterState.players[i]._id === player._id && (EncounterService.encounterState.players[i].isHovered || EncounterService.encounterState.players[i].isSelected))
            {
                if (EncounterService.encounterState.players[i].isSelected)
                {
                    return "background-color: rgba(0,0,0,.2); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
                }

                if (EncounterService.encounterState.players[i].isHovered)
                {
                    return "background-color: rgba(0,0,0,0.05); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);";
                }
            }
        }

        return "";
    };

    $scope.selectPlayer = function (player)
    {
        for (var i = 0; i < EncounterService.encounterState.players.length; i++)
        {
            if (EncounterService.encounterState.players[i]._id === player._id)
            {
                if (EncounterService.encounterState.players[i].isSelected)
                {
                    EncounterService.encounterState.players[i].isSelected = false;
                }
                else
                {
                    selectedPlayer = i;
                    EncounterService.encounterState.players[i].isSelected = true;
                }
            }
            else
            {
                EncounterService.encounterState.players[i].isSelected = false;
            }
        }
    };

    this.init();
});