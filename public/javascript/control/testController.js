var clientApp = angular.module('clientApp');

clientApp.controller('testController', function($scope)
{
    $scope.init = function()
    {
        console.log($scope.jtest);
    };

});