openFace.controller('viewContentctrl', ['$scope', '$http', '$location', '$window', '$routeParams', function($scope, $http, $location, $window, $routeParams) {
    var p = $routeParams.id;
    var id = p.split(":");
    $http.post("http://localhost:3000/viewvideocontent", { id: id[1] }).success(function(response) {
        $scope.data = response;
        var name = response.data.video_url;
        var str = response.data.uploadedAt;
        $scope.res = str.replace("../client", "../..");
        $scope.video_name = name.replace(".mp4", "");
        $http.post("http://localhost:3000/framewise_emotions", { id: id[1] }).success(function(response) {
            console.log(response);
            $scope.framewise_emotions = response;
        })
        $http.post("http://localhost:3000/emotions_summery", { id: id[1] }).success(function(response) {
            console.log(response);
            $scope.emotions_summery = response;
        })
    });
}])