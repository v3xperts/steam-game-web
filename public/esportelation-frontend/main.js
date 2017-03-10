var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/profile', {
      templateUrl: 'partials/profile.html',
      controller: 'groupController',
      access: {restricted: true}
    })
    .when('/add-group', {
      templateUrl: 'partials/addgroup.html',
      controller: 'groupController',
      access: {restricted: true}
    })
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/forget-password', {
      templateUrl: 'partials/forgetpassword.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/faq', {
      templateUrl: 'partials/faq.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .when('/contact', {
      templateUrl: 'partials/contact.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){

          $location.path('/login');
          $route.reload();
        }else{
            $rootScope.userdata = AuthService.isLoggedIn();
        }
      });
  });
});