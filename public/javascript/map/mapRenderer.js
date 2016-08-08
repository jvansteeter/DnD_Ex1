var clientApp = angular.module('clientApp');

clientApp.service('mapRenderer', function () {

    var mapRenderer = {};

    mapRenderer.init = function(canvas){
        this.w = canvas.width();
        this.h = canvas.height();

        // this.tileSize = options.tileSize;
        this.context = canvas.get(0).getContext('2d');

        // this.gameModel = options.gameModel;
        // this.bgImage = this.gameModel.mapImage.getImage();

        this.bgImage = new Image();
        this.bgImage.src = "image/map/dungeon.jpg";
    };

    mapRenderer.draw = function(){
        this.context.drawImage(this.bgImage,0,0);
    };


    return mapRenderer;
});