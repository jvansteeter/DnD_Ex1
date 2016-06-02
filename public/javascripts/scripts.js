var blogApp = angular.module('blogApp', []);

blogApp.service('Credentials', function($window)
{
    var credService = {};

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

blogApp.controller('headerControl', function($scope) 
{
  var userName = "Cole"; // TODO get user.name from database
  $scope.title = userName + "'s Blog";
});

blogApp.controller('blogControl', function($scope, $window, $http, Credentials) 
{
  posts = [];

  var post1 = { // TODO get this info from database
    title: "Welcome to the CS201R Blog",
    body: "Please feel free to check our new blog website.  Everything should be pretty straight forward.  You are currently on the homepage which displays all posts that have been posted to our server.  Unfortunately they currently are listed from oldest to newest, so any new posts you make will be shown at the bottom.",
    date: "31 October 2015",
    author: "System",
    tags: [
      "test",
      "stuff",
      "blogs",
      "cats"
    ]
  };
  var url = "getAllPosts?u=" + Credentials.getUsername() + "&p=" + Credentials.getPassword();
  console.log(url);
  $http.get(url).success(function(data)
  {
    console.log(data);
    for(var k = 0; k < data.length; k++)
    {
      var author = data[k]["_id"];
      var entries = data[k]['entry'];
      for(var i = 0; i < entries.length; i++)
      {
        var post = {
          "author" : author,
          "title" : entries[i]['title'],
          "date" : entries[i]['data'],
          "tags" : entries[i]['tags'],
          "body" : entries[i]['body']
        };
        posts.push(post);
      }
    }
  });
  //$scope.posts.reverse();
  posts.push(post1);
  $scope.posts = posts;
});

blogApp.controller('myPostsControl', function($scope, $window, $http, Credentials) 
{
  $scope.posts = [];
  var url = "getMyPosts?u=" + Credentials.getUsername() + "&p=" + Credentials.getPassword();
  console.log(url);
  $http.get(url).success(function(data)
  {
    console.log(data);
    var entries = data[0]['entry'];
    if (entries.length === 0)
    {
      var post = {
        "title" : "You Have No Entries",
        "tags" : ["new", "entry"],
        "body" : "To create posts click on Create New Post"
      };
      $scope.posts.push(post);
    }
    for(var i = 0; i < entries.length; i++)
    {
      var post = {
        "title" : entries[i]['title'],
        "date" : entries[i]['data'],
        "tags" : entries[i]['tags'],
        "body" : entries[i]['body']
      };
      $scope.posts.push(post);
      $scope.posts.reverse();
    }
  });
});

blogApp.controller('loginControl', function($scope, $window, $http, Credentials) 
{
    $scope.usernameInput = "";
    $scope.passwordInput = "";
    $scope.loginInfo;
    
    $scope.login = function()
    {
      console.log("login username =" + $scope.usernameInput);
      if ($scope.usernameInput === "")
      {
        $scope.loginInfo = "Username is blank";
        return;
      }
      if ($scope.passwordInput === "")
      {
        $scope.loginInfo = "Password is blank";
        return;
      }
      var url = "validateUser?u=" + $scope.usernameInput + "&p=" + $scope.passwordInput;
      console.log(url);
      $http.get(url).success(function(data)
      {
        console.log(data);
        if(data.length === 0)
        {
          $scope.loginInfo = "Server Error";
        }
        else if(data === "Invalid Username")
          $scope.loginInfo = data;
        else if(data === "true")
        {
          Credentials.setUsername($scope.usernameInput);
          Credentials.setPassword($scope.passwordInput);
          /*url = "getTodoList?u=" + $scope.usernameInput;
          $http.get(url).success(function(data)
          {
              Credentials.setTodoList(data);
          });*/
          $window.location.href = "index.html";
        }
        else if(data === "false")
          $scope.loginInfo = "Invalid Password";
        else
          $scope.loginInfo = "Unknown Error";
      });

      /*url = "getTodoList?u=" + $scope.usernameInput;
      $http.get(url).success(function(data)
      {
          Credentials.setTodoList(data);
      });*/
    };

    $scope.createUser = function()
    {
        var url = "createUser?u=" + $scope.usernameInput + "&p=" + $scope.passwordInput;
        $http.get(url).success(function(data)
        {
            if(data === "OK")
            {
                $scope.loginInfo = "User created";
            }
            else
                $scope.loginInfo = data;
        });
    }    
});

blogApp.controller('newPostControl', function($scope, $window, $http, Credentials) 
{
  $scope.postTitle = "";
  $scope.tags = "";
  $scope.postBody = "";
  $scope.newPostInfo = "";
  var time = new Date();
  var data = {};

  $scope.submitNewPost = function()
  {
    console.log("submit new post");
    if($scope.postTitle === "")
    {
      $scope.newPostInfo = "Post Title cannot be Blank";
      return;
    }
    else if($scope.tags === "")
    {
      $scope.newPostInfo = "Must have at least one tag";
      return;
    }

    var tagList = $scope.tags.split(" ");
    var data =  {
                  "title" : $scope.postTitle,
                  "date" : time.getTime(),
                  "tags" : tagList,
                  "body" : $scope.postBody
                };
    var url = "createNewPost?u=" + Credentials.getUsername() + "&p=" + Credentials.getPassword();
    $http.post(url, data).success(function(response)
    {
      console.log("post=" + response);
      $window.location.href = "index.html";
    });
  };
});

$(document).ready(function(){$('#sidebar').affix({
    offset: {
      top: 240
    }
  });
});
