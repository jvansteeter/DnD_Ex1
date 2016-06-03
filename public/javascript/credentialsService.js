var clientApp = angular.module('clientApp');

clientApp.service('Credentials', function($window)
{
    var credService = {};

    credService.setToken = function(token)
    {
        $window.sessionStorage.setItem("authorization", token);
    };

    credService.getUsername = function()
    {
        //return username;
        var myData = $window.sessionStorage.getItem("user");
        return myData;
    };
    credService.getPassword = function()
    {
        //return password;
        var myData = $window.sessionStorage.getItem("password");
        return myData;
    };
    /*credService.getTodoList = function()
    {
        var data = $window.sessionStorage.getItem("todoList");
        return JSON.parse(data);
    };*/
    credService.setUsername = function(name)
    {
        //username = name;
        $window.sessionStorage.setItem("user", name);
    };
    credService.setPassword = function(secret)
    {
        //password = secret;
        $window.sessionStorage.setItem("password", secret);
    };
    /*credService.setTodoList = function(todoList)
    {
        $window.sessionStorage.setItem("todoList", JSON.stringify(todoList));
    }*/
    return credService;
});