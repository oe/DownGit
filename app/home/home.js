/***********************************************************
* Developer: Minhas Kamal (minhaskamal024@gmail.com)       *
* Website: https://github.com/MinhasKamal/DownGit          *
* License: MIT License                                     *
***********************************************************/

var homeModule = angular.module('homeModule', [
    'ngRoute',
    'downGitModule',
]);

homeModule.config([
    '$routeProvider',

    function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'app/home/home.html',
                controller: [
                '$scope',
                '$routeParams',
                '$location',
                'toastr',
                'downGitService',

                function($scope, $routeParams, $location, toastr, downGitService) {
                    $scope.downUrl = "";
                    $scope.url = "";
                    $scope.isProcessing = {val: false};
                    $scope.downloadedFiles = {val: 0};
                    $scope.totalFiles = {val: 0};
                    $scope.authStatus = {status: 'warning', message: 'loading'};
                    
                    getCurrentUser().then(res => {
                        $scope.authStatus = res;
                        $scope.$digest();
                    })

                    var templateUrl = "https?://github.com/.+/.+";
                    var downloadUrlInfix = "#/home?url=";
                    var downloadUrlPrefix = "https://downgit.evecalm.com/"+downloadUrlInfix;

                    if ($routeParams.url) {
                        $scope.url = $routeParams.url;
                    }

                    if ($scope.url.match(templateUrl)) {
                        toastr.info("Ready to download. Click the button to start.", {iconClass: 'toast-down'});
                    } else if ($scope.url != "") {
                        toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                    }

                    $scope.catchEnter = function(keyEvent) {
                        if (keyEvent.which == 13) {
                            $scope.download();
                        }
                    };

                    $scope.createDownLink = function() {
                        $scope.downUrl="";

                        if (!$scope.url) {
                            return;
                        }

                        if ($scope.url.match(templateUrl)) {
                            $scope.downUrl = downloadUrlPrefix + $scope.url;
                        } else {
                            toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                        }
                    };

                    $scope.download = function() {
                        if ($scope.url.match(templateUrl)) {
                            var parameter = {
                                url: $scope.url,
                                fileName: ($scope.url === $routeParams.url) ? $routeParams.fileName : "",
                                rootDirectory: ($scope.url === $routeParams.url) ? $routeParams.rootDirectory : ""
                            };
                            var progress = {
                                isProcessing: $scope.isProcessing,
                                downloadedFiles: $scope.downloadedFiles,
                                totalFiles: $scope.totalFiles
                            };
                            downGitService.downloadZippedFiles(parameter, progress, toastr);
                        } else {
                            toastr.warning("Invalid URL!", {iconClass: 'toast-down'});
                        }
                    };

                    $scope.startAuth = function() {
                        const scope = document.querySelector('input[name="scope"]:checked').value;
                        location = getGithubAuthUrl(scope);
                    }
                }],
            });
    }
]);
