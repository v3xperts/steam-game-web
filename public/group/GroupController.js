(function () {
    'use strict';

    angular
        .module('app')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$location', 'AuthenticationService', 'FlashService','GroupService','OwnerService','$rootScope', '$routeParams', 'orderByFilter'];
    function GroupController($location, AuthenticationService, FlashService, GroupService, OwnerService, $rootScope,$routeParams,orderBy) {
        var vm = this;
        vm.pageid= $routeParams.id;
        vm.page = null;
        vm.allUsers = [];
        vm.allOwner = [];
        vm.allMember = [];
        vm.deletePage = deletePage;
        vm.getGroup = getGroup;
        vm.ownerData = null;
        vm.getOwner = getOwner;
        vm.add = add;
        vm.update = update;
        vm.sortBy = sortBy;
        vm.reverse = false;
        vm.propertyName = 'title';
        vm.allData =vm.allUsers;

        initController();
        if (vm.pageid) {
            GroupService.GetById(vm.pageid)
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
            console.log(vm.page);
            var members  = [];
            angular.forEach(vm.page.members,function (member) {
                var memberObject = {};
                memberObject.user = member;
                memberObject.status = false;
                members.push(memberObject);
            });
            vm.page.members = [];
            vm.page.members = members;
            GroupService.Create(vm.page)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('Group added successfully', true);
                        $location.path('/group-list');
                    } else {
                        FlashService.Error(response);
                        vm.dataLoading = false;
                    }
                });
        }

        function update() {
            vm.dataLoading = true;
            console.log(vm.page);
            GroupService.Update(vm.page)
                .then(function (response) {
                    console.log(response);
                    if (!response.error) {
                        FlashService.Success('Group updated successfully', true);
                        $location.path('/group-list');
                    } else {
                        FlashService.Error(response);
                        vm.dataLoading = false;
                    }
                });
        }

        function initController() {
            //loadCurrentUser();
            loadAllPages();
            loadAllOwner();
            loadAllMember();
        }

        function loadCurrentUser() {
            GroupService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllPages() {
            GroupService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function loadAllOwner() {
            GroupService.GetAllUnique()
                .then(function (users) {
                    
                    vm.allOwner = users;
                });
        }

        function loadAllMember() {
            GroupService.GetAllUniqueMember()
                .then(function (users) {
                    
                    vm.allMember = users;
                });
        }

        function getGroup(id) {
            GroupService.GetById(id)
            .then(function (user) {
                vm.pageData = user;
                $location.path('/group-edit');
                //console.log(vm.pageData);
            });
        }

        function getOwner(id) {
            OwnerService.GetById(id)
            .then(function (user) {
                vm.ownerData = user.message;
            });
        }
        
        function deletePage(id) {
            GroupService.Delete(id)
            .then(function () {
                $location.path('/group-list');
                loadAllPages();
            });
        }
    }

})();
