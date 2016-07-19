define(['Renderer'],function(Renderer){

    return Renderer.extend({
        constructor: function(options){
            Renderer.prototype.constructor.call(this,options);

            this.gameModel = options.gameModel;

            this.tileSize = this.gameModel.tileSize;
            // this.hoverMap = this.gameModel.hoverMap;
            this.hoverTile = this.gameModel.hoverTile;
        },
        
        draw: function(){
            this.context.clearRect(0, 0, this.w, this.h);
            var hoveShrink = 0.7;
            var shrinkOffset = this.tileSize * (1 - hoveShrink) / 2;
            this.context.fillStyle = "rgba(255,0,0,.25)";

            this.context.fillRect((this.hoverTile.position.x * this.tileSize) + shrinkOffset, (this.hoverTile.position.y * this.tileSize) + shrinkOffset, this.tileSize * hoveShrink, this.tileSize * hoveShrink);
        }
    });
});