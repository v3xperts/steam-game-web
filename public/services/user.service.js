(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetDashboardData = GetDashboardData;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Login = Login;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetDashboardData() {
            return $http.get('/dashboard').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetAll() {
            return $http.get('/users/').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/users/userdetail/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Login(user) {
            return $http.post('/users/login/', user).then(handleSuccess, handleError('Error Login user'));
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/users/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
