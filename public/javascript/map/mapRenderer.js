var clientApp = angular.module('clientApp');

clientApp.service('mapRenderer', function () {

    var mapRenderer = {};

    mapRenderer.init = function(options){
        this.$el = options.$el;

        this.w = this.$el.width();
        this.h = this.$el.height();

        // this.tileSize = options.tileSize;
        this.context = this.$el.get(0).getContext('2d');

        // this.gameModel = options.gameModel;
        // this.bgImage = this.gameModel.mapImage.getImage();

        this.bgImage = new Image();
        this.bgImage.src = "image/map/dungeon.jpg";
        this.context.drawImage(this.bgImage,0,0);
    };

    return mapRenderer;
});