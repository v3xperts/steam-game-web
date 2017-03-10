angular.module('myApp').factory('GroupService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {
            var memberLists,groupLists = null;
            //var baseUrl = 'http://35.166.62.106:4001';
            var baseUrl = 'http://localhost:4001';
            return ({
                saveGroup: saveGroup,
                getMembers: getMembers,
                groupList: groupList,
                groups: groups,
                members: members
            });

            function groups() {
                if(groupLists) {
                    return groupLists;
                }else{
                    return false;
                }
            }

            function members() {
                if(memberLists) {
                    return memberLists;
                }else{
                    return false;
                }
            }

            function getMembers() {
                return $http.get(baseUrl+'/groupmember/uniquemember')
                // handle success
                .success(function (data) {
                    memberLists = data;
                })
                // handle error
                .error(function (err) {
                    memberLists = data;
                });
            }

            function groupList() {
                return $http.get(baseUrl+'/groupmember/auth-groups/')
                // handle success
                .success(function (data) {
                    groupLists = data;
                })
                // handle error
                .error(function (err) {
                    groupLists = err;
                });
            }

            function saveGroup(postdata) {
                // create a new instance of deferred
                var deferred = $q.defer();
                // send a post request to the server
                $http.post(baseUrl+'/groupmember/groups',postdata)
                // handle success
                .success(function (data, status) {
                    console.log(data);
                    if(status === 200){
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function (data) {
                    deferred.reject();
                });
                // return promise object
                return deferred.promise;
            }

        }
    ]
);