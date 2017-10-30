openFace.controller('viewctrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
    $scope.filetype = "";
    var userData = $window.localStorage.getItem('Userdata');
    $http.post("http://localhost:3000/viewvideos", { id: userData }).success(function(response) {
        //var results = [];
        $scope.results = response.data;

        console.log($scope.results);
    });

    /*$scope.viewContent = function($id) {
        $location.path('/viewContent');
    }*/
}])