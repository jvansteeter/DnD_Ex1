define(function(){
	
	return Toolbox.Base.extend({
		constructor: function(options){
			this.position = options.position || {x:0,y:0};
			this.tokenImage = options.tokenImage;
            this.isSelected = options.isSelected || false;
		},
		setPosition: function(pos){
			pos = pos || {};
			this.position.x = pos.x || 0;
			this.position.y = pos.y || 0;
		},
		getImage: function(){
			return this.tokenImage.image;
		}
	});

});