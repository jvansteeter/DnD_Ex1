define(['Renderer'],function(Renderer){

	return Renderer.extend({
		constructor: function(options){
			// this.map = options.map;
            Renderer.prototype.constructor.call(this,options);


            this.gameModel = options.gameModel;
			this.bgImage = this.gameModel.mapImage.getImage();

			this.context.drawImage(this.bgImage,0,0);
		},
		draw: function(){
		}
	});

});