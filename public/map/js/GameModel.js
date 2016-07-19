define(function(){
    return Toolbox.Base.extend({

        constructor: function(options){
            // this.mapDim = options.mapDim;

            this.mapImage = options.mapImage;
            this.tileSize = options.tileSize;

            var dimX = this.mapImage.getImage().width / this.tileSize;
            var dimY = this.mapImage.getImage().height / this.tileSize;

            this.mapDim = {x: dimX, y: dimY};

            this.tokens = options.tokens;

            this.hoverTile = options.hoverTile;

            console.log("dimX: " + dimX);
            console.log("dimY: " + dimY);
        }
    });

});