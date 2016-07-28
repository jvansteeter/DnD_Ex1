var clientApp = angular.module('clientApp');

clientApp.service('testController', function()
{
    var service = [];
    var dataModel;
    
    service.setModel = function(data)
    {
        dataModel = data;
    };
    
    service.doTheThing = function()
    {
        dataModel[0].name = "The thing is done";
        console.log("Result: ");
        console.log(dataModel);
    };
    
    return service;

});