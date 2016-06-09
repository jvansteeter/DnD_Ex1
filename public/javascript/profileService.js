var clientApp = angular.module('clientApp');

clientApp.service('Profile', function($window)
{
    var profile = {};

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