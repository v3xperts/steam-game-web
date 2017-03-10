angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    var user = null;
    //var baseUrl = 'http://35.166.62.106:4001';
    var baseUrl = 'http://localhost:4001';

    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
    });

    function isLoggedIn() {
        if(user) {
            return user;
        } else {
            return false;
        }
    }

    function getUserStatus() {
        return $http.get(baseUrl+'/api/status')
        // handle success
        .success(function (data) {
            if(data.status){
                user = data.data;
            } else {
                user = false;
            }
        })
        // handle error
        .error(function (data) {
            user = false;
        });
    }

    function login(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post(baseUrl+'/api/login',{username: username, password: password})
        // handle success
        .success(function (data, status) {
            if(status === 200 && data.status){
                user = true;
                deferred.resolve();
            } else {
                user = false;
                deferred.reject();
            }
        })
        // handle error
        .error(function (data) {
            user = false;
            deferred.reject();
        });
        // return promise object
        return deferred.promise;
    }

    function logout() {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a get request to the server
        $http.get(baseUrl+'/api/logout')
        // handle success
        .success(function (data) {
            user = false;
            deferred.resolve();
        })
        // handle error
        .error(function (data) {
            user = false;
            deferred.reject();
        });
        // return promise object
        return deferred.promise;
    }

    function register(postdata) {
        // create a new instance of deferred
        var deferred = $q.defer();
        // send a post request to the server
        $http.post(baseUrl+'/api/register',postdata)
        // handle success
        .success(function (data, status) {
            if(status === 200 && data.status){
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

}]);