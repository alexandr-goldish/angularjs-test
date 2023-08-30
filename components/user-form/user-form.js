import {
    successToast,
    errorToast,
    toastDuration
} from '../../shared/constants.js';

const userFormModule = angular.module('userForm', ['ngMessages']);

userFormModule.controller('userFormController', function ($scope, $timeout, dataService) {
    $scope.loading = false;
    $scope.userData = null;
    $scope.isEditing = false;
    $scope.showToast = false;
    $scope.toastMessage = '';
    $scope.toastClass = '';
    $scope.title = '';

    $scope.closeForm = function () {
        $scope.isFormVisible = false;
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
    };

    $scope.checkPasswords = function () {
        if ($scope.userData.repeatPassword && $scope.userData.password !== $scope.userData.repeatPassword) {
            $scope.userForm.repeatPasswordField.$setValidity('matchPassword', false);
            $scope.userForm.repeatPasswordField.$setDirty();
        } else {
            $scope.userForm.repeatPasswordField.$setValidity('matchPassword', true);
        }
    }

    $scope.addUser = function () {
        $scope.loading = true;

        dataService.addUser($scope.userData).then(function(userId) {
            $scope.users = [...$scope.users, {...$scope.userData, id: userId}];

            $scope.showToastMessage('User added', successToast);

            $scope.closeForm();
        }).catch(function () {
            $scope.showToastMessage('User not added', errorToast);

            $scope.closeForm();
        }).finally(() => {
            $scope.loading = false;
        })
    };

    $scope.changeUser = function () {
        $scope.loading = true;

        dataService.updateUser($scope.userData).then(function() {
            $scope.users = $scope.users.map((user) => user.id !== $scope.userData.id ? user : {...$scope.userData});

            $scope.showToastMessage('User updated', successToast);

            $scope.closeForm();
        }).catch(function () {
            $scope.showToastMessage('User not updated', errorToast);

            $scope.closeForm();
        }).finally(() => {
            $scope.loading = false;
        })
    };

    $scope.deleteUser = function () {
        $scope.loading = true;

        dataService.deleteUser($scope.userData).then(function() {
            $scope.users = $scope.users.filter((user) => user.id !== $scope.userData.id);

            $scope.showToastMessage('User deleted', successToast);

            $scope.closeForm();
        }).catch(function () {
            $scope.showToastMessage('User not deleted', errorToast);

            $scope.closeForm();
        }).finally(() => {
            $scope.loading = false;
        })
    };

    $scope.showToastMessage = function (message, type) {
        $scope.showToast = true;
        $scope.toastMessage = message;
        $scope.toastClass = type;

        $timeout(function () {
            $scope.showToast = false;
        }, toastDuration);
    }

    $scope.$watch('userData', function() {
        if ($scope.isEditing) {
            $scope.formTitle = `${$scope.userData.firstName} ${$scope.userData.lastName}`;
        } else {
            $scope.formTitle = 'Create new user';
        }
    });
});

userFormModule.directive('userForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/user-form/user-form.template.html',
        controller: 'userFormController',
        controllerAs: 'vm'
    };
});

userFormModule.directive('uniqueUserName', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$validators.uniqueUserName = function (modelValue, viewValue) {
                return !scope.users?.some((user) => user.userName === modelValue && user.id !== scope.userData.id);
            };
        }
    };
});

userFormModule.directive('matchPassword', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$validators.matchPassword = function (modelValue, viewValue) {
                let password = scope.$eval(attrs.matchPassword);

                if (ngModelCtrl.$isEmpty(modelValue)) {
                    return true;
                }

                return modelValue === password;
            };
        }
    };
});

userFormModule.directive('passwordValidation', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            ngModelCtrl.$validators.passwordValidation = function (modelValue, viewValue) {
                if (ngModelCtrl.$isEmpty(modelValue)) {
                    return true;
                }

                let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

                return regex.test(viewValue);
            };
        }
    };
});

userFormModule.directive('toast', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/toast/toast.template.html',
        scope: {
            message: '=',
            show: '=',
            type: '=',
        }
    };
});