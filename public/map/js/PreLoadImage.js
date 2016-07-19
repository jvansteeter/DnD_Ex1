define(function(){

    return Toolbox.Base.extend({
        constructor: function(options){
            this.onReadyCb = options.onReady || function(){};

            this.image = new Image();
            this.image.onload = this.onImageLoad.bind(this);
            this.image.src = options.imagePath;

            this.imageLoaded = false;
        },
        onImageLoad: function(e){
            this.imageLoaded = true;
            this.onReady();
        },
        onReady: function(){
            if(this.imageLoaded && _.isFunction(this.onReadyCb)){
                this.onReadyCb();
            }
        },
        getImage: function(){
            return this.image;
        }
    });

});
