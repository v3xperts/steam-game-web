(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', 'AuthenticationService', 'FlashService','UserService','$rootScope'];
    function DashboardController($location, AuthenticationService, FlashService, UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.getUser = getUser;
        vm.update = update;

        initController();

        function initController() {
            loadData();
            getUser();
            //loadAllUsers();
        }

        function loadData() {
            UserService.GetDashboardData()
                .then(function (users) {
                    vm.allUsers = users.message;

                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users.message;
                });
        }

        function update() {
            vm.dataLoading = true;
            //console.log(vm.user);
            if (vm.user.npassword) {
                vm.user.password = vm.user.npassword
            };
            UserService.Update(vm.user)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('Profile updated successful', true);
                        $location.path('/dashboard');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function getUser() {
            UserService.GetById($rootScope.globals.currentUser.authdata._id)
            .then(function (users) {
                vm.user = users.message;
            });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

})();
