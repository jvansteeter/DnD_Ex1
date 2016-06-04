var clientApp = angular.module('clientApp');

clientApp.controller('blogControl', function($scope, $window, $http) 
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
  // var url = "getAllPosts?u=" + Credentials.getUsername() + "&p=" + Credentials.getPassword();
  console.log(url);
  /*$http.get(url).success(function(data)
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
  });*/
  //$scope.posts.reverse();
  posts.push(post1);
  $scope.posts = posts;
});