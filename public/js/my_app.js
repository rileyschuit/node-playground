angular.module('Riley-Playground', []).
  controller('myController', ['$scope', '$http', 
                              function($scope, $http) {
    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
      $scope.user = data;
      $scope.error = "";
    }).
    error(function(data, status, headers, config) {
      $scope.user = {};
      $scope.error = data;
    });
  }]);
  controller('UserList', ['$scope', '$http', 
                          function($scope, $http) {
    $http.get('/user/list/json')
      .success(function(data, status, headers, config) {
    $scope.list = data;
    $scope.error = "";
  })
}]);
