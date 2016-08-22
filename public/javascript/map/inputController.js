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

    $scope.click = function (event) {
        var rect = canvas[0].getBoundingClientRect();
        var canvasX = event.clientX - rect.left;
        var canvasY = event.clientY - rect.top;

        inputToMap(canvasX);
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

    $scope.mouseLeave = function(event){
        mouseDown = false;
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

    function inputToMap(inputX){
        var mapX = (inputX - Encounter.mapLeftDisplace)/(Encounter.mapZoom/100);
        var mapXcoor = Math.floor(mapX / 50);

        // console.log("inputX: " + inputX);
        // console.log("xDisplace: " + Encounter.mapLeftDisplace);
        // console.log("zoom: " + (Encounter.mapZoom / 100));
        // console.log("mapX: " + mapX);
        // console.log("mapXcoor: " + mapXcoor);
        // console.log("\n");
    }

    init();
});