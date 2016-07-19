define(function(){

	return Toolbox.Base.extend({
		constructor: function(options){
			this.$el = options.$el;

			this.w = this.$el.width();
			this.h = this.$el.height();

			// this.tileSize = options.tileSize;
			this.context = this.$el.get(0).getContext('2d');
        }
	});

});