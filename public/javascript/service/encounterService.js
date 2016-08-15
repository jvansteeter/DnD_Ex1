var clientApp = angular.module('clientApp');

clientApp.service('encounterService', function () {
    var encounterService = {};
    var encounterState;

    $scope.getEncounter = function(){
        return encounterState;
    };

    return encounterService;
});