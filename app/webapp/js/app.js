(function() {
    "use strict";
    var app = angular.module("userManagement", [
        "ui.router",
        "ui.mask",
        "ui.bootstrap"
    ]);



    app.config(["$stateProvider", "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {
            // defines the default routing when no state is defined
            $urlRouterProvider.otherwise("/");

            $stateProvider
            // l
                .state("home", {
                    url: "/",
                    views: {
                        mainView: {
                            templateUrl: "partials/home"
                        }
                    }
                })
                .state("login", {
                    url: "/login",
                    views: {
                        mainView: {
                            templateUrl: "partials/login"
                        },
                        navBar: {
                            template: "",
                            controller: function($scope) {
                                $scope.showNavBar = false;
                                console.log('controller');
                            }

                        }
                    }
                })
        }
    ]);
}());
