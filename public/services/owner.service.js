(function () {
    'use strict';

    angular
        .module('app')
        .factory('OwnerService', OwnerService);

    OwnerService.$inject = ['$http'];
    function OwnerService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Login = Login;
        service.Update = Update;
        service.Delete = Delete;
        service.activate = activate;
        service.deactivate = deactivate;

        return service;

        function GetAll() {
            return $http.get('/owners/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetById(id) {
            return $http.get('/owners/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/owners/userdetail/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Login(user) {
            return $http.post('/owners/login/', user).then(handleSuccess, handleError('Error Login user'));
        }

        function Create(user) {
            return $http.post('/owners', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/owners/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }
        
        function activate(id) {
            return $http.get('/owners/active/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function deactivate(id) {
            return $http.get('/owners/deactive/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Delete(id) {
            return $http.delete('/owners/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

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
