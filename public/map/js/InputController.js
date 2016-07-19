define(function(){

    return Toolbox.Base.extend({
        constructor: function(options){
            this.$el = options.$el;

            this.w = this.$el.width();
            this.h = this.$el.height();

            var canvas = document.getElementById("inputCanvas");

            this.gameModel = options.gameModel;

            var tokens = this.gameModel.tokens;
            var tileSize = this.gameModel.tileSize;
            var hoverTile = this.gameModel.hoverTile;

            canvas.addEventListener('mousemove', function (evt){
                // Handle the hover of the mouseMove
                var mousePos = getMousePos(canvas, tileSize, evt);
                hoverTile.setPosition({x: mousePos.x, y: mousePos.y});
                
            }, false);

            canvas.addEventListener('click', function(evt){

                var mousePos = getMousePos(canvas, tileSize, evt);

                var selectedCount = 0;
                var selectedIndex = -1;

                for(var i = 0; i < tokens.length; i++){
                    if(tokens[i].isSelected == true){
                        selectedIndex = i;
                        selectedCount++;
                    }
                }

                if(selectedCount > 1){
                    //un-select all tokens as a precaution, then return
                    for(var j = 0; j < tokens.length; j++){
                        tokens[j].isSelected = false;
                    }
                    return;
                }

                if(selectedCount == 1){
                    // there is a token select, condition check the move location
                    // is there a token on the destination location
                    for(var x = 0; x < tokens.length; x++){
                        if(tokens[x].position.x == mousePos.x && tokens[x].position.y == mousePos.y){
                            //if a token is found, unselect the selected token and stop
                            tokens[selectedIndex].isSelected = false;
                            return;
                        }
                    }

                    // move the selected token
                    tokens[selectedIndex].setPosition({x: mousePos.x, y: mousePos.y});

                    // un-select the selected token
                    tokens[selectedIndex].isSelected = false;
                }

                if(selectedCount == 0){
                    // search for a token that was hot by the mouse event
                    for(var k = 0; k < tokens.length; k++){
                        if(tokens[k].position.x == mousePos.x && tokens[k].position.y == mousePos.y){
                            //if a token is found, select it and stop
                            tokens[k].isSelected = true;
                            break;
                        }
                    }
                }

            },false);
        }
    });

    function getMousePos(canvas, tileSize, evt) {
        var rect = canvas.getBoundingClientRect();

        return {
            x: Math.floor((evt.clientX - rect.left) / tileSize),
            y: Math.floor((evt.clientY - rect.top) / tileSize)
        };
    }
});