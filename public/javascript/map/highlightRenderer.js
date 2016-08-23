var clientApp = angular.module('clientApp');

clientApp.controller('highlightRenderer', function ($scope, $window, Encounter) {

    var canvas;
    var context;

    var tileSize = 50;

    function init() {
        canvas = $('#highlightCanvas');
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw() {
        canvas.css({"zoom":Encounter.mapZoom + "%"});
        canvas.css({"left":Encounter.mapLeftDisplace});
        canvas.css({"top":Encounter.mapTopDisplace});

        context.clearRect(0,0,Encounter.encounterState.mapResX, Encounter.encounterState.mapResY)
        context.fillStyle = "rgba(255,0,0,.2)";

        if(angular.isDefined(Encounter.hoverCell)){
            if(Encounter.hoverCell.x != -1){
                var xCoor = Encounter.hoverCell.x;
                var yCoor = Encounter.hoverCell.y;
                context.fillRect(tileSize * xCoor, tileSize * yCoor, tileSize, tileSize);
            }
        }


        // context.fillStyle = "rgba(255,0,0,.4)";
        // var xCoor2 = 3;
        // var yCoor2 = 3;
        // var tileSize2 = 50;
        // var dialationFactor = .3;
        // context.fillRect(tileSize2 * xCoor2 + (tileSize2 * dialationFactor / 2),
        //     tileSize2 * yCoor2 + (tileSize2 * dialationFactor / 2),
        //     tileSize2 * (1 - dialationFactor),
        //     tileSize2 * (1 - dialationFactor));

        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function(){
        return Encounter.encounterState.mapResX;
    };

    $scope.getResY = function(){
        return Encounter.encounterState.mapResY;
    };

    init();
});