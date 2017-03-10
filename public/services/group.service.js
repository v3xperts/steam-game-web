(function () {
    'use strict';

    angular
        .module('app')
        .factory('GroupService', GroupService);

    GroupService.$inject = ['$http'];
    function GroupService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetAllUnique = GetAllUnique;
        service.GetAllUniqueMember = GetAllUniqueMember;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        
        return service;

        function GetAll() {
            return $http.get('/groupmember/groups/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetAllUnique() {
            return $http.get('/groupmember/unique/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetAllUniqueMember() {
            return $http.get('/groupmember/uniquemember/').then(handleSuccess, handleError('Error getting all owners'));
        }

        function GetById(id) {
            return $http.get('/groupmember/groups/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(user) {
            return $http.post('/groupmember/groups', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            return $http.put('/groupmember/groups/' + user._id, user).then(handleSuccess, handleError('Error updating user'));
        }
        
        function Delete(id) {
            return $http.delete('/groupmember/groups/' + id).then(handleSuccess, handleError('Error deleting user'));
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
