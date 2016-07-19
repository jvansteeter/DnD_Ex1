define(['Renderer'],function(Renderer){

    return Renderer.extend({
        constructor: function(options){
            Renderer.prototype.constructor.call(this,options);

            this.gameModel = options.gameModel;
            this.tileSize = this.gameModel.tileSize;

            this.context.fillStyle = "rgba(255,0,0,.3)";

            for(i = 0; i < this.gameModel.mapDim.x; i++){
                this.context.fillRect(this.tileSize * i, 0, 2, 650);
            }

            for(i = 0; i < this.gameModel.mapDim.y; i++){
                this.context.fillRect(0, this.tileSize * i, 650, 2);
            }

        },
        draw: function(){
        }
    });
});