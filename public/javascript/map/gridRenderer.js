var clientApp = angular.module('clientApp');

clientApp.service('gridRenderer', function () {

    var gridRenderer = {};

    gridRenderer.init = function(canvas){

        this.w = canvas.width();
        this.h = canvas.height();

        // this.tileSize = options.tileSize;
        this.context = canvas.get(0).getContext('2d');

        // this.gameModel = options.gameModel;
        // this.tileSize = this.gameModel.tileSize;
        var tileSize = 50;

        this.context.fillStyle = "rgba(255,0,0,.3)";

        // for(i = 0; i < this.gameModel.mapDim.x; i++){
        for(i = 0; i < 12; i++){
            this.context.fillRect(tileSize * i, 0, 2, 650);
        }

        // for(i = 0; i < this.gameModel.mapDim.y; i++){
        for(i = 0; i < 12; i++){
            this.context.fillRect(0, tileSize * i, 650, 2);
        }
    };

    gridRenderer.draw = function(){

    };


    return gridRenderer;
});