import {typeList, userList} from '../shared/constants.js';

const app = angular.module("angularjsApp", ["ngRoute", "userForm"]);

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
        .when("/", {
            templateUrl: `pages/user-list-page.html`,
            controller: 'userController'
        })
        .otherwise({
            templateUrl: `pages/404.html`
        });

    $httpProvider.interceptors.push('httpErrorInterceptor');
}]);

app.controller('userController', function ($scope, dataService) {
    $scope.userTypes = [...typeList];
    $scope.isFormVisible = false;

    $scope.createNewUser = function () {
        $scope.isEditing = false;
        $scope.isFormVisible = true;
        $scope.userData = {};
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
    };

    $scope.selectUser = function (userData) {
        const showForm = !$scope.isFormVisible || ($scope.userData && userData.id !== $scope.userData.id);

        if (showForm) {
            $scope.userData = {...userData};
            $scope.isEditing = true;
        } else {
            $scope.userForm.$setPristine();
            $scope.userForm.$setUntouched();
        }

        $scope.isFormVisible = showForm;
    };

    $scope.getData = function () {
        dataService.getUserList().then(function (response) {
            $scope.users = response;
        }, function (error) {
            console.error(error);
        });
    };

    $scope.$on('$viewContentLoaded', function () {
        $scope.getData();
    });
});

app.directive('required', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/field-error-messages/required.template.html',
        controller: 'userController',
        controllerAs: 'vm'
    };
})

app.service('dataService', function ($http) {
    this.getUserList = function () {
        // Request to api
        return $http.get('https://jsonplaceholder.typicode.com/posts').then(() => userList)
    };

    this.addUser = function (data) {
        // Request to api
        return $http.post('https://jsonplaceholder.typicode.com/posts', data).then(() => Math.floor(Math.random() * 1000));
    };

    this.updateUser = function (data) {
        // Request to api
        return $http.patch('https://jsonplaceholder.typicode.com/posts/1', data);
    };

    this.deleteUser = function (data) {
        // Request to api
        return $http.delete('https://jsonplaceholder.typicode.com/posts/1', data);
    };
});

app.factory('httpErrorInterceptor', ['$q', function($q) {
    return {
        'responseError': function(rejection) {
            console.log('HTTP Error:', rejection.status, rejection.statusText);

            return $q.reject(rejection);
        }
    };
}]);