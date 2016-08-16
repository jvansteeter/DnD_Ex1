var clientApp = angular.module('clientApp');

clientApp.controller('gridRenderer', function ($window) {

    var canvas;
    var context;
    var width;
    var height;
    var tileSize;

    function init() {
        canvas = $('#gridCanvas');
        width = canvas.width();
        height = canvas.height();
        context = canvas.get(0).getContext('2d');
        tileSize = 50;

        draw();
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(255,0,0,.3)";
        for (var vert = 0; vert < 12; vert++) {
            context.fillRect(tileSize * vert, 0, 2, 650);
        }

        for (var hori = 0; hori < 12; hori++) {
            context.fillRect(0, tileSize * hori, 650, 2);
        }

        $window.requestAnimationFrame(draw);
    }

    init();
});