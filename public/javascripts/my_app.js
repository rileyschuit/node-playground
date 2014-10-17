angular.module('Riley-Playground', []).
  controller('myController', ['$scope', '$http', 
                              function($scope, $http) {
     $http.get('/user/profile')
        .success(function(data, status, headers, config) {
      $scope.username = data;
      $scope.error = "";
    }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });
  }]);
