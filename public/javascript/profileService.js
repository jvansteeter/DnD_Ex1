var clientApp = angular.module('clientApp');

clientApp.service('Profile', function($window)
{
    var profile = {};

    profile.setFirstName = function(name)
    {
        $window.sessionStorage.setItem("firstName", name);
    };

    profile.getFirstName = function()
    {
        var data = $window.sessionStorage.getItem("firstName");
    };

    profile.setLastName = function(name)
    {
        $window.sessionStorage.setItem("lastName", name);
    };

    profile.getLastName = function()
    {
        var data = $window.sessionStorage.getItem("lastName");
    };

    profile.setUsername = function(name)
    {
        $window.sessionStorage.setItem("username", name);
    };

    profile.getUsername = function()
    {
        var data = $window.sessionStorage.getItem("username");
    };

    profile.getEncounter = function()
    {
        var myData = $window.sessionStorage.getItem("encounter");
        return myData;
    };
    
    profile.setEncounter = function(encounter)
    {
        $window.sessionStorage.setItem("encounter", encounter);
    };
    
    return profile;
});