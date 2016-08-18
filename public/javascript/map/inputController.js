var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, Encounter) {
    var canvas;
    var context;
    var width;
    var height;

    var mouseDown = false;

    function init() {
        canvas = $('#inputCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        Encounter.mapZoom = 100;
        Encounter.mapLeftDisplace = 0;
        Encounter.mapTopDisplace = 0;

    }

    $scope.click = function () {
        var oldTopDisplace = Encounter.mapTopDisplace;
        var oldLeftDisplace = Encounter.mapLeftDisplace;

        Encounter.mapTopDisplace = oldTopDisplace + 25;
        Encounter.mapLeftDisplace = oldLeftDisplace + 25;
    };

    $scope.mouseMove = function () {

    };

    $scope.mouseDown = function(){
        mouseDown = true;
    };

    $scope.mouseUp = function(){
        mouseDown = false;
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