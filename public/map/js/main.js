/*
 main.js file
 */
require(['lib/DependencyLoader',
        'MapRenderer',
        'TokenRenderer',
        'Token',
        'HoverRenderer',
        'HighlightRenderer',
        'GridRenderer',
        'InputController',
        'PreLoadImage',
        'GameModel',
        'TileRep'],
    function (DependencyLoader,
              MapRenderer,
              TokenRenderer,
              Token,
              HoverRenderer,
              HighlightRenderer,
              GridRenderer,
              InputController,
              PreLoadImage,
              GameModel,
              TileRep) {
        'use strict';
        
        var tileSize = 50;
        var $body = $('body');
        var $mapCanvas;
        var $highlightCanvas;
        var $gridCanvas;
        var $tokenCanvas;
        var $hoverCanvas;
        var $inputCanvas;

        var mapRenderer;
        var highlightRenderer;
        var tokenRenderer;
        var hoverRenderer;
        var gridRenderer;
        var inputController;

        var tilesetsToLoad = 5;

        var mapImage = new PreLoadImage({
            imagePath: 'img/dungeon.jpg',
            onReady: loadCb
        });

        //Define the test tokens
        var player1 = new Token({
            position: {x: 4, y: 1},
            tokenImage: new PreLoadImage({
                imagePath: 'img/playerOne.png',
                onReady: loadCb
            })
        });
        var player2 = new Token({
            position: {x: 2, y: 2},
            tokenImage: new PreLoadImage({
                imagePath: 'img/playerTwo.png',
                onReady: loadCb
            })
        });
        var player3 = new Token({
            position: {x: 5, y: 5},
            tokenImage: new PreLoadImage({
                imagePath: 'img/playerThree.png',
                onReady: loadCb
            })
        });
        var player4 = new Token({
            position: {x: 9, y: 2},
            tokenImage: new PreLoadImage({
                imagePath: 'img/playerFour.png',
                onReady: loadCb
            })
        });

        //Package the game model
        var gameModel = new GameModel({
            tileSize: tileSize,
            mapImage: mapImage,
            tokens: [
                player1,
                player2,
                player3,
                player4
            ],
            hoverTile: new TileRep({x:0, y:0})
        });


        function loadCb() {
            tilesetsToLoad--;
            if (!tilesetsToLoad) {
                run();
            }
        }

        document.addEventListener('keypress', function(e){
            if(e.which == 49 || e.keyCode == 49){
                gameModel.tokens.push(new Token({
                    position: {x:1, y:1},
                    tokenImage: new PreLoadImage({
                        imagePath: 'img/playerFour.png',
                        onReady: loadCb()
                    })
                }));
            }
        });

        function run() {
            // build the mapCanvas
            $mapCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="mapCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=0"' + ' class="gamecanvas canvas"/>');
            $body.append($mapCanvas);

            // build the highlightCanvas
            $highlightCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="highlightCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=1"' + ' class="gamecanvas canvas"/>');
            $body.append($highlightCanvas);

            // build the gridCanvas
            $gridCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="gridCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=2"' + ' class="gamecanvas canvas"/>');
            $body.append($gridCanvas);

            // build the tokenCanvas
            $tokenCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="tokenCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=3"' + ' class="gamecanvas canvas"/>');
            $body.append($tokenCanvas);

            // build the hoverCanvas
            $hoverCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="hoverCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=4"' + ' class="gamecanvas canvas"/>');
            $body.append($hoverCanvas);

            // build the inputController canvas
            $inputCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="inputCanvas" width="' + (gameModel.mapDim.x * tileSize) + '" height="' + (gameModel.mapDim.y * tileSize) + '" data-index=5"' + ' class="gamecanvas canvas"/>');
            $body.append($inputCanvas);


            // start renderers
            mapRenderer = new MapRenderer({
                $el: $mapCanvas,
                gameModel: gameModel
            });

            highlightRenderer = new HighlightRenderer({
                $el: $highlightCanvas,
                gameModel: gameModel
            });

            gridRenderer = new GridRenderer({
                $el: $gridCanvas,
                gameModel: gameModel
            });

            tokenRenderer = new TokenRenderer({
                $el: $tokenCanvas,
                gameModel: gameModel
            });

            hoverRenderer = new HoverRenderer({
                $el: $hoverCanvas,
                gameModel: gameModel
            });

            inputController = new InputController({
                $el: $inputCanvas,
                gameModel: gameModel
            });


            // run game
            function gameLoop() {
                tokenRenderer.draw();
                highlightRenderer.draw();
                hoverRenderer.draw();

                window.requestAnimationFrame(gameLoop);
            }

            gameLoop();

        }
    });