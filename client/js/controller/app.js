'use strict';
var openFace = angular.module('fileUpload', ['ngRoute', 'ngFileUpload'])
openFace.config(['$routeProvider', function($routeProvider) {
    //admin login
    $routeProvider
        .when('/admin-login', {
            templateUrl: '/js/html/frontend/login.html',
            controller: 'login_ctrl',
        }).when('/upload', {
            templateUrl: '/js/html/frontend/upload.html',
            controller: 'MyCtrl',
        })
        .when('/AdminDashboard', {
            templateUrl: '/js/html/frontend/dashboard.html',
            controller: '',
            activetab: 'dashboard'
        }).when('/viewData', {
            templateUrl: '/js/html/frontend/uploadedData.html',
            controller: 'viewctrl',
            activetab: 'dashboard'
        }).when('/viewContent:id', {
            templateUrl: '/js/html/frontend/viewContent.html',
            controller: 'viewContentctrl',
            activetab: 'dashboard'
        }).otherwise({ redirectTo: '/admin-login' });
}]);

openFace.controller('MyCtrl', ['Upload', '$window', '$http', function(Upload, $window, $http) {
    var vm = this;

    var userData = $window.localStorage.getItem('Userdata');
    console.log(userData);
    $http.post("http://localhost:3000/userdetails", { id: userData }).success(function(response) {
        console.log(response);
    });
    vm.submit = function() { //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }

    vm.upload = function(file) {
        console.log(userData);
        console.log(file);
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data: { file: file, Userdata: userData } //pass file as data, should be user ng-model
        }).then(function(resp) { //upload function returns a promise
            console.log(resp);
            if (resp.data.error_code === 0) { //validate success
                if (resp.data.error_code === 0) {
                    $http.post("http://localhost:3000/processdata").success(function(response) {
                        if (response.success) {
                            $window.alert("proccessing data");
                            $http.post("http://localhost:3000/processdata").success(function(response) {
                                if (response.success) {
                                    $window.alert("proccessing data completed");
                                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                                    $window.location.reload();

                                }

                            });
                        }

                    });
                }
            } else {
                $window.alert('an error occured');
            }
        }, function(resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function(evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);