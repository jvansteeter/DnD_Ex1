var clientApp = angular.module('clientApp');

clientApp.service('Profile', function($window, $http, $q)
{
    var deffered = $q.defer();
    var profile = {};
    var user = {
        first_name: "",
        last_name: "",
        username: "",
        _id: "",
        profilePhotoURL: ""
    };

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

    profile.setUser = function(data)
    {
        user = data;
    };

    profile.getFirstName = function()
    {
        // var data = $window.sessionStorage.getItem("firstName");
        // return data;
        return user.first_name;
    };

    profile.getLastName = function()
    {
        // var data = $window.sessionStorage.getItem("lastName");
        // return data;
        return user.last_name;
    };

    profile.getUsername = function()
    {
        // var data = $window.sessionStorage.getItem("username");
        // return data;
        return user.username;
    };

    profile.getUserID = function()
    {
        // var data = $window.sessionStorage.getItem("userID");
        // return data;
        return user._id;
    };

    profile.getProfilePhotoURL = function()
    {
        return user.profilePhotoURL;
    };
    
    return profile;
});