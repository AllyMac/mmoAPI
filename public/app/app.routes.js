angular.module('app.routes', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {

    $routeProvider

      // route for the home page
      .when('/users/:user_id/profile', {
        templateUrl: 'app/views/pages/home.html',
        controller: 'profileController',
        controllerAs: 'user'

      })

      // login page
      .when('/login', {
        templateUrl: 'app/views/pages/login.html',
        controller: 'mainController',
        controllerAs: 'login'
      })

      // show all users
      .when('/users', {
        templateUrl: 'app/views/pages/users/all.html',
        controller: 'userController',
        controllerAs: 'user'
      })

      // form to create a new user
      // same view as edit page
      .when('/users/create', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userCreateController',
        controllerAs: 'user'
      })

      .when('/chat', {
          templateUrl: 'app/views/pages/chat.html',

      })

      .when('/match', {
          templateUrl: 'app/views/pages/match.html',
          controller: 'userCreateController',
          controllerAs: 'user'
      })

      // page to edit a user
      .when('/users/:user_id', {
        templateUrl: 'app/views/pages/users/single.html',
        controller: 'userEditController',
        controllerAs: 'user'
      })

      // page to market change
      .when('/users/:user_id/market', {
              templateUrl: 'app/views/pages/market.html',
              controller: 'marketController',
              controllerAs: 'user'
          })

      // page to market change
      .when('/users/:user_id/match', {
         templateUrl: 'app/views/pages/match.html',
         controller: 'matchController',
         controllerAs: 'user'
      })

  .when('/users/:user_id/matchResult/:opponent_id', {
          templateUrl: 'app/views/pages/matchResult.html',
          controller: 'matchResultController',
          controllerAs: 'user'
      });


    $locationProvider.html5Mode(true);

  });