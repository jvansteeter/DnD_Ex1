var clientApp = angular.module('clientApp');

clientApp.service('mapRenderer', function () {

    var mapRenderer = {};
    var canvas;
    var context;
    var width;
    var height;
    var bgImage = new Image();

    mapRenderer.init = function(canvasParam){

        canvas = canvasParam;
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');

        bgImage.src = "image/map/dungeon.jpg";
    };

    mapRenderer.draw = function(){
        context.drawImage(bgImage,0,0);
    };
    
    return mapRenderer;
});