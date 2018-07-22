var app = angular.module('app',[]);

app.controller('backIntegCntrl', ['$scope', '$http', function ($scope, $http){
    $scope.title = 'RABO Bank';
    $scope.recordsListData = [];
    $scope.EndBalanceValidateList = [];
    $scope.uploadFile = function(files) {
        var fd = new FormData();
        fd.append("file", files[0]);
        $http({
            method: 'POST',
            url: 'http://localhost:3000/upload',
            data: fd,
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function successCallback(response) {
            var result = response.data;
            console.log(result);
            $scope.recordsListData = result.duplicateReferenceList;
            $scope.duplicateReferenceCount = result.duplicateReferenceCount;
            $scope.uniqueReferenceCount = result.uniqueReferenceCount;
            $scope.EndBalanceValidateList = result.EndBalanceValidateList;
            $scope.EndBalanceValidateCount = result.EndBalanceValidateCount;
        }, function errorCallback(response) {
        });
    };
}]);
