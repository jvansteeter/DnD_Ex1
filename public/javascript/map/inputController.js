var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, Encounter) {
    var canvas;
    var context;
    var width;
    var height;

    function init() {
        canvas = $('#inputCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
    }

    $scope.click = function () {

    };

    $scope.mouseMove = function () {

    };

    $scope.mouseScroll = function (event, delta, deltaX, deltaY) {

        var oldZoom = Encounter.mapZoom;
        Encounter.mapZoom = oldZoom + (delta * 5);
        if(Encounter.mapZoom >= 250){
            Encounter.mapZoom = 250;
        }

        if(Encounter.mapZoom <= 35){
            Encounter.mapZoom = 35;
        }
    };


    init();
});