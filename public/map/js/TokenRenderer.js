define(['Renderer'],function(Renderer){

	return Renderer.extend({
		constructor: function(options){
            Renderer.prototype.constructor.call(this,options);
            this.gameModel = options.gameModel;

			this.tokens = this.gameModel.tokens;
            this.tileSize = this.gameModel.tileSize;
		},

		draw: function(){
			
			this.context.clearRect(0, 0, this.w, this.h);

			for(i = 0; i < this.tokens.length; i++){
				var currentToken = this.tokens[i];

				this.context.drawImage(
					currentToken.getImage(),
					currentToken.position.x * this.tileSize,
					currentToken.position.y * this.tileSize
				);
			}
		}
	});

});