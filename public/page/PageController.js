(function () {
    'use strict';

    angular
        .module('app')
        .controller('PageController', PageController);

    PageController.$inject = ['$location', 'AuthenticationService', 'FlashService','PageService','$rootScope', '$routeParams', 'orderByFilter'];
    function PageController($location, AuthenticationService, FlashService, PageService, $rootScope,$routeParams,orderBy) {
        var vm = this;
        vm.pageid= $routeParams.id;
        console.log(vm.pageid);
        vm.page = null;
        vm.allUsers = [];
        vm.deletePage = deletePage;
        vm.getOwner = getOwner;
        vm.add = add;
        vm.update = update;
        vm.sortBy = sortBy;
        vm.reverse = false;
        vm.propertyName = 'title';
        vm.allData =vm.allUsers;

        initController();
        if (vm.pageid) {
            PageService.GetById(vm.pageid)
            .then(function (user) {
                vm.page = user;
                console.log(vm.page);
            });
        };

        function sortBy(propertyName) {
            vm.propertyName = propertyName;
            vm.reverse = (propertyName !== null && vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.allUsers = orderBy(vm.allUsers, vm.propertyName, vm.reverse);
        };

        function add() {
            vm.dataLoading = true;
            PageService.Create(vm.page)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('Page added successful', true);
                        $location.path('/page-list');
                    } else {
                        FlashService.Error(response);
                        vm.dataLoading = false;
                    }
                });
        }

        function update() {
            vm.dataLoading = true;
            console.log(vm.page);
            PageService.Update(vm.page)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('Page updated successful', true);
                        $location.path('/page-list');
                    } else {
                        FlashService.Error(response);
                        vm.dataLoading = false;
                    }
                });
        }

        function initController() {
            //loadCurrentUser();
            loadAllPages();
        }

        function loadCurrentUser() {
            PageService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllPages() {
            PageService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function getOwner(id) {
            PageService.GetById(id)
            .then(function (user) {
                vm.pageData = user;
                $location.path('/page-edit');
                //console.log(vm.pageData);
            });
        }
        
        function deletePage(id) {
            PageService.Delete(id)
            .then(function () {
                $location.path('/page-list');
                loadAllPages();
            });
        }
    }

})();
