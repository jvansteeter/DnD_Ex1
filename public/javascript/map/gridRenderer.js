var clientApp = angular.module('clientApp');

clientApp.service('gridRenderer', function () {

    var gridRenderer = {};
    var canvas;
    var context;
    var width;
    var height;
    var tileSize;

    gridRenderer.init = function(canvasParam){

        canvas = canvasParam;

        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        tileSize = 50;
    };

    gridRenderer.draw = function(){
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(255,0,0,.3)";
        for(i = 0; i < 12; i++){
            context.fillRect(tileSize * i, 0, 2, 650);
        }

        for(i = 0; i < 12; i++){
            context.fillRect(0, tileSize * i, 650, 2);
        }
    };


    return gridRenderer;
});