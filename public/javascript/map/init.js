var clientApp = angular.module('clientApp');

clientApp.service('mapInit', function () {
    var mapInit = {};

    // config variables
    var $mapTag = $('#mapDiv');

    // ******************************
    //      Start up Process
    // ******************************

    // build the mapCanvas
    $mapCanvas = $('<canvas style="border:1px solid #c3c3c3;" id="mapCanvas" width="300" height="300" data-index="0"/>');
    $mapTag.append($mapCanvas);





    return mapInit;
});

