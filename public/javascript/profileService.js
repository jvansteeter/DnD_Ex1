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
        return data;
    };

    profile.setLastName = function(name)
    {
        $window.sessionStorage.setItem("lastName", name);
    };

    profile.getLastName = function()
    {
        var data = $window.sessionStorage.getItem("lastName");
        return data;
    };

    profile.setUsername = function(name)
    {
        $window.sessionStorage.setItem("username", name);
    };

    profile.getUsername = function()
    {
        var data = $window.sessionStorage.getItem("username");
        return data;
    };

    profile.setUserID = function(userID)
    {
        $window.sessionStorage.setItem("userID", userID);
    };

    profile.getUserID = function()
    {
        var data = $window.sessionStorage.getItem("userID");
        return data;
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