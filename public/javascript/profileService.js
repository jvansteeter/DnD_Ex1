var clientApp = angular.module('clientApp');

clientApp.service('Profile', function($window, $http, $q)
{
    var deffered = $q.defer();
    var profile = {};
    var user = {};

    profile.async = function()
    {
        $http.get('api/user').success(function (data)
        {
            console.log("I have the user data");
            console.log(data);
            user = data;
            deffered.resolve();
        });

        return deffered.promise;
    };

    profile.getUser = function()
    {
        return user;
    };

    profile.setFirstName = function(name)
    {
        $window.sessionStorage.setItem("firstName", name);
    };

    profile.getFirstName = function()
    {
        // var data = $window.sessionStorage.getItem("firstName");
        // return data;
    };

    profile.setLastName = function(name)
    {
        $window.sessionStorage.setItem("lastName", name);
    };

    profile.getLastName = function()
    {
        // var data = $window.sessionStorage.getItem("lastName");
        // return data;
    };

    profile.setUsername = function(name)
    {
        $window.sessionStorage.setItem("username", name);
    };

    profile.getUsername = function()
    {
        // var data = $window.sessionStorage.getItem("username");
        // return data;
    };

    profile.setUserID = function(userID)
    {
        $window.sessionStorage.setItem("userID", userID);
    };

    profile.getUserID = function()
    {
        // var data = $window.sessionStorage.getItem("userID");
        // return data;
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

    profile.setCampaign = function(campaign)
    {
        $window.sessionStorage.setItem("campaign", campaign);
    };

    profile.getCampaign = function()
    {
        return $window.sessionStorage.getItem("campaign");
    };
    
    return profile;
});