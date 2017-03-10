(function () {
    'use strict';

    angular
        .module('app')
        .controller('OwnerController', OwnerController);

    OwnerController.$inject = ['$location', 'AuthenticationService', 'FlashService','OwnerService','$rootScope', '$routeParams', 'orderByFilter'];
    function OwnerController($location, AuthenticationService, FlashService, OwnerService, $rootScope,$routeParams,orderBy) {
        var vm = this;
        vm.ownerid= $routeParams.id;
        console.log(vm.ownerid);
        vm.owner = null;
        vm.allUsers = [];
        vm.deleteOwner = deleteOwner;
        vm.getOwner = getOwner;
        vm.add = add;
        vm.update = update;
        vm.sortBy = sortBy;
        vm.reverse = false;
        vm.propertyName = 'firstname';
        vm.allData =vm.allUsers;
        vm.activate = activate;
        vm.deactivate = deactivate;

        initController();
        if (vm.ownerid) {
            OwnerService.GetById(vm.ownerid)
            .then(function (user) {
                vm.owner = user.message;
                console.log(vm.owner);
            });
        };

        function sortBy(propertyName) {
            vm.propertyName = propertyName;
            vm.reverse = (propertyName !== null && vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.allUsers = orderBy(vm.allUsers, vm.propertyName, vm.reverse);
        };

        function add() {
            vm.dataLoading = true;
            OwnerService.Create(vm.owner)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('User added successful', true);
                        $location.path('/user-list');
                    } else {
                        if (response.message.code == 11000) {
                            FlashService.Error('Username Already Exist');
                        }else{
                            FlashService.Error(response.message);
                        };
                        vm.dataLoading = false;
                    }
                });
        }

        function update() {
            vm.dataLoading = true;
            console.log(vm.owner);
            OwnerService.Update(vm.owner)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('User updded successful', true);
                        $location.path('/user-list');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function initController() {
            //loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            OwnerService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user.message;
                });
        }

        function loadAllUsers() {
            OwnerService.GetAll()
                .then(function (users) {
                    vm.allUsers = users.message;
                });
        }

        function getOwner(id) {
            OwnerService.GetById(id)
            .then(function (user) {
                vm.ownerData = user.message;
                $location.path('/user-edit');
                console.log(vm.ownerData);
            });
        }

        function activate(id) {
            //$http.get('/owners/active/' + id).success($location.path('/user-list'));
            OwnerService.activate(id)
            .then(function () {
                $location.path('/user-list');
                loadAllUsers();
            });
        }

        function deactivate(id) {
            //$http.get('/owners/deactive/' + id).success($location.path('/user-list'));
            OwnerService.deactivate(id)
            .then(function () {
                $location.path('/user-list');
                loadAllUsers();
            });
        }
        
        function deleteOwner(id) {
            OwnerService.Delete(id)
            .then(function () {
                $location.path('/user-list');
                loadAllUsers();
            });
        }
    }

})();
