var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function ($scope, Encounter) {
    var canvas;
    var context;
    var width;
    var height;

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;

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
        // var oldTopDisplace = Encounter.mapTopDisplace;
        // var oldLeftDisplace = Encounter.mapLeftDisplace;
        //
        // Encounter.mapTopDisplace = oldTopDisplace + 25;
        // Encounter.mapLeftDisplace = oldLeftDisplace + 25;
    };

    $scope.mouseMove = function (event) {
        if(mouseDown){
            var oldMapTopDisplace = Encounter.mapTopDisplace;
            var oldMapLeftDisplace = Encounter.mapLeftDisplace;

            var deltaX = event.clientX - mouseX;
            var deltaY = event.clientY - mouseY;

            Encounter.mapTopDisplace = oldMapTopDisplace + (deltaY / (Encounter.mapZoom/100));
            Encounter.mapLeftDisplace = oldMapLeftDisplace + (deltaX / (Encounter.mapZoom/100));

            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    };

    $scope.mouseDown = function(event){
        mouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
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