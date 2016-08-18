var clientApp = angular.module('clientApp');

clientApp.controller('inputController', function($scope, Encounter)
{
   var canvas;
   var context;
   var width;
   var height;

   function init(){
      canvas = $('#inputCanvas');
      width = canvas.width();
      height = canvas.height();
      context = canvas.get(0).getContext('2d');
   }

   $scope.click = function(){
      console.log('click');
   };

   $scope.mouseMove = function(){
     console.log('mouseMove');
   };

   $scope.mouseScroll = function($event, $delta, $deltaX, $deltaY) {
      console.log("delta: " + $delta + " deltaX: " + $deltaX + " deltaY: " + $deltaY);
   };


   init();
});