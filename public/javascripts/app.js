(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies','ngFileUpload'])
        .config(config)
        .directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }])
        .directive('ckEditor', function() {
          return {
            require: '?ngModel',
            link: function(scope, elm, attr, ngModel) {
              var ck = CKEDITOR.replace(elm[0]);

              if (!ngModel) return;

              ck.on('pasteState', function() {
                scope.$apply(function() {
                  ngModel.$setViewValue(ck.getData());
                });
              });

              ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
              };
            }
          };
        })
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/dashboard', {
                controller: 'DashboardController',
                templateUrl: 'dashboard/dashboard.html',
                controllerAs: 'vm'
            })

            .when('/profile', {
                controller: 'DashboardController',
                templateUrl: 'dashboard/profile.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'login/register.html',
                controllerAs: 'vm'
            })

            .when('/user-list', {
                controller: 'OwnerController',
                templateUrl: 'owner/ownerlist.html',
                controllerAs: 'vm'
            })

            .when('/user-add', {
                controller: 'OwnerController',
                templateUrl: 'owner/owneradd.html',
                controllerAs: 'vm'
            })

            .when('/user-edit/:id', {
                controller: 'OwnerController',
                templateUrl: 'owner/owneredit.html',
                controllerAs: 'vm'
            })


            .when('/page-list', {
                controller: 'PageController',
                templateUrl: 'page/pagelist.html',
                controllerAs: 'vm'
            })

            .when('/page-add', {
                controller: 'PageController',
                templateUrl: 'page/pageadd.html',
                controllerAs: 'vm'
            })

            .when('/page-edit/:id', {
                controller: 'PageController',
                templateUrl: 'page/pageedit.html',
                controllerAs: 'vm'
            })

            .when('/group-list', {
                controller: 'GroupController',
                templateUrl: 'group/grouplist.html',
                controllerAs: 'vm'
            })

            .when('/group-add', {
                controller: 'GroupController',
                templateUrl: 'group/groupadd.html',
                controllerAs: 'vm'
            })

            .when('/group-edit/:id', {
                controller: 'GroupController',
                templateUrl: 'group/groupedit.html',
                controllerAs: 'vm'
            })


            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

    

})();