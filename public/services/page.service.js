(function () {
    'use strict';

    angular
        .module('app')
        .factory('PageService', PageService);

    PageService.$inject = ['$http'];
    function PageService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        
        return service;

        function GetAll() {
            return $http.get('/pages/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetById(id) {
            return $http.get('/pages/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(user) {
            return $http.post('/pages', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/pages/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }
        
        function Delete(id) {
            return $http.delete('/pages/' + id).then(handleSuccess, handleError('Error deleting user'));
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
