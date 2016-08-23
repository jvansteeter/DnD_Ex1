var clientApp = angular.module('clientApp');

clientApp.controller('highlightRenderer', function ($scope, $window, Encounter) {

    var canvas;
    var context;

    var tileSize = 50;
    var dialationFactor = 0;

    function init() {
        canvas = $('#highlightCanvas');
        context = canvas.get(0).getContext('2d');

        draw();
    }

    function draw() {
        canvas.css({"zoom": Encounter.mapZoom + "%"});
        canvas.css({"left": Encounter.mapLeftDisplace});
        canvas.css({"top": Encounter.mapTopDisplace});

        context.clearRect(0, 0, Encounter.encounterState.mapResX, Encounter.encounterState.mapResY)
        context.fillStyle = "rgba(255,0,0,.2)";

        if (angular.isDefined(Encounter.hoverCell)) {
            if (Encounter.hoverCell.x != -1) {
                var xCoor = Encounter.hoverCell.x;
                var yCoor = Encounter.hoverCell.y;
                context.fillRect(tileSize * xCoor, tileSize * yCoor, tileSize, tileSize);
            }
        }

        var players = Encounter.encounterState.players;
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.isSelected) {
                context.fillStyle = "rgba(255,0,0,.4)";
                var selectX = player.mapX;
                var selectY = player.mapY;
                context.fillRect(
                    tileSize * selectX + (tileSize * dialationFactor / 2),
                    tileSize * selectY + (tileSize * dialationFactor / 2),
                    tileSize * (1 - dialationFactor),
                    tileSize * (1 - dialationFactor));
            }
        }

        $window.requestAnimationFrame(draw);
    }

    $scope.getResX = function () {
        return Encounter.encounterState.mapResX;
    };

    $scope.getResY = function () {
        return Encounter.encounterState.mapResY;
    };

    init();
});