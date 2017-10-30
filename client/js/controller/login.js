openFace.controller('login_ctrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
    $scope.login = function() {
        $http.post("http://localhost:3000/login", { email: $scope.email, password: $scope.password }).success(function(response) {
            if (response.success) {
                $location.path("/AdminDashboard");
                $window.localStorage.setItem('Userdata', JSON.stringify(response.data._id));

            } else {

                $location.path("/admin-login");
            }


        });
    }

    $scope.signup = function() {
        $http.post("http://localhost:3000/createAccount", { first_name: $scope.first_name, last_name: $scope.last_name, email: $scope.email, password: $scope.password }).success(function(response) {
            if (response.error) {
                $scope.noError = false;
                $scope.ErrorMessage = response.error;
            } else {
                console.log("createAccount successfully");
                $location.path("/admin-login");
            }
        });
    }



}])