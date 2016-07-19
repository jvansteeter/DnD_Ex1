define(['Renderer'],function(Renderer){

    return Renderer.extend({

        constructor: function(options){
            Renderer.prototype.constructor.call(this,options);

            this.gameModel = options.gameModel;
            this.tokens = this.gameModel.tokens;

            this.tileSize = this.gameModel.tileSize;
            this.highlightMap = this.gameModel.highlightMap;
        },

        draw: function(){
            this.context.clearRect(0, 0, this.w, this.h);
            this.context.fillStyle = "rgba(0,255,255,.40";
            var hoveShrink = 1;
            var shrinkOffset = this.tileSize * (1 - hoveShrink) / 2;

            for(var i = 0; i < this.tokens.length; i++){
                var currentToken = this.tokens[i];
                if(currentToken.isSelected == true){
                    this.context.fillRect((currentToken.position.x * this.tileSize) + shrinkOffset, (currentToken.position.y * this.tileSize) + shrinkOffset, this.tileSize * hoveShrink, this.tileSize * hoveShrink);
                }
            }
        }
    });
});