angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.login = function () {
        $scope.error = false;
        $scope.disabled = true;
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        .then(function () {
            $location.path('/profile');
            $scope.disabled = false;
            $scope.loginForm = {};
        })
        .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password";
            $scope.disabled = false;
            $scope.loginForm = {};
        });
    };
    $scope.logout = function () {
        AuthService.logout()
        .then(function () {
            $location.path('/login');
        });
    };
}]);


angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
        $scope.register = function () {
            $scope.error = false;
            $scope.disabled = true;
            AuthService.register($scope.registerForm)
            .then(function () {
                $location.path('/login');
                $scope.disabled = false;
                $scope.registerForm = {};
            })
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
                $scope.disabled = false;
                $scope.registerForm = {};
            });
        };
}]);

angular.module('myApp').controller('groupController',
  ['$rootScope','$scope', '$location','$http', 'GroupService',
    function ($rootScope,$scope, $location, $http, GroupService) {
        //$scope.baseUrl = 'http://35.166.62.106:4001';
        $scope.baseUrl = 'http://localhost:4001';
        $scope.groupLength = false;
        $scope.memberList = function () {
            GroupService.getMembers()
            .then(function(){
                $scope.memberlists = GroupService.members();
            })
        }

        function groups() {
            GroupService.groupList()
            .then(function(){
                $scope.groupLists = GroupService.groups();
                if ($scope.groupLists.length > 0) {
                    $scope.groupLength = true;
                };
            });
        }

        $scope.groupMembers = function() {
            $http.get($scope.baseUrl+'/groupmember/auth-group-member/')
            // handle success
            .success(function (data) {
                $scope.groupMemberList = data;
            })
            // handle error
            .error(function (err) {
                $scope.groupMemberList = err;
            });
        }

        $scope.groupInviteMembers = function() {
            $http.get($scope.baseUrl+'/groupmember/auth-group-member-invite')
            // handle success
            .success(function (data) {
                $scope.groupInviteMemberList = data;
            })
            // handle error
            .error(function (err) {
                $scope.groupInviteMemberList = err;
            });
        }

        function inviteMeData() {
            $http.get($scope.baseUrl+'/groupmember/invite-request')
            // handle success
            .success(function (data) {
                $scope.inviteMeList = data;
            })
            // handle error
            .error(function (err) {
                $scope.groupInviteMemberList = err;
            });
        }
        $scope.inviteMe = function() {
            inviteMeData();
        }

        $scope.inviteAccept = function(id) {
            console.log(id);
            $http.get($scope.baseUrl+'/groupmember/invite-accept/'+id)
            // handle success
            .success(function (data) {
                //$scope.inviteMeList = data;
                inviteMeData();
            })
            // handle error
            .error(function (err) {
                $scope.groupInviteMemberList = err;
            });
        }

        $scope.inviteReject = function(id) {
            console.log(id);
            $http.get($scope.baseUrl+'/groupmember/invite-reject/'+id)
            // handle success
            .success(function (data) {
                inviteMeData();
                //$scope.inviteMeList = data;
            })
            // handle error
            .error(function (err) {
                $scope.groupInviteMemberList = err;
            });
        }

        $scope.groupList = function () {
            groups();
        }
        
        $scope.groupDelete = function (id) {
            $http.delete($scope.baseUrl+'/groupmember/groups/'+id)
            //handle success
            .success(function (data) {
                groups();
            })
            //handle error
            .error(function (err) {
                return false;
            });
        }
        
        $scope.groupDetail = function () {
            $http.get($scope.baseUrl+'/groupmember/groupsbyuser/'+$rootScope.userdata._id)
            //handle success
            .success(function (data) {
                $scope.groupDetailData = data;
                console.log($scope.groupDetailData);
            })
            //handle error
            .error(function (err) {
                return false;
            });
        }

        $scope.addGroup = function () {
            $scope.groupadd.user = $rootScope.userdata._id;
            var members  = [];
            angular.forEach($scope.groupadd.members,function (member) {
                var memberObject = {};
                memberObject.user = member;
                memberObject.status = false;
                members.push(memberObject);
            });
            $scope.groupadd.members = [];
            $scope.groupadd.members = members;
            console.log($scope.groupadd);
            GroupService.saveGroup($scope.groupadd)
            .then(function () {
                $location.path('/profile');
            });
        }
}]);
