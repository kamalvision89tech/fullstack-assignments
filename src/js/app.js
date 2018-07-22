/**
 * Rabo Bank Front End Angular Application
 * Author: Kamal Raj
 * Git: https://github.com/kamalvision89tech/fullstack-assignment
 */
var app = angular.module('app',[]);

app.controller('RaboMainPage', ['$scope', '$http', 'CSV2JSONconvert', function ($scope, $http, CSV2JSONconvert){
    $scope.raboscope = {
        // controller initialization methods
        init: function() {
            $scope.title = 'RABO Bank';
            $scope.issueListData = []; 
            $scope.isValidFile = false;
            $scope.toggleClose = function () {
                return $scope.isValidFile = !$scope.isValidFile;
            };
            this.attachingFileSelectEvent('#selectedCSVFile');
        },
        attachingFileSelectEvent: function(elm) {
            
            angular.element(document.querySelectorAll(elm)).on('change', function (changeEvent) {
                var files = changeEvent.target.files;
                var regex = new RegExp("(.*?)\.(csv)$");
                if (!(regex.test(files[0].name.toLowerCase()))) {
                    angular.element(this)[0].value = '';
                    $scope.$apply(function () {
                        $scope.isValidFile = true;
                    });
                }
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function (e) {
                        var contents = e.target.result;
                        var content = {
                            csv: e.target.result,
                            header: true,
                            separator: ',',
                            encoding: 'ISO-8859-1',
                        };
                        var validListData = CSV2JSONconvert.csvToJSON(content);
                        $scope.$apply(function () {
                            $scope.issueListData = validListData;
                        });
                    };

                    r.readAsText(files[0]);
                }
                angular.element(this).val(null); // Unset Input
            });
        },
        // by clicking on the clear button we can clear the all data
        clearAllRaboUsers: function() {
            $scope.issueListData.length = 0;
        }
    };
    // bootstarp scope object
    $scope.raboscope.init();
}]);

app.factory('CSV2JSONconvert', function() {
    var cleanCsvValue = function (value) {
        return value
            .replace(/^\s*|\s*$/g, "") // remove leading & trailing space
            .replace(/^"|"$/g, "") // remove " on the beginning and end
            .replace(/""/g, '"'); // replace "" with "
    };
    // converting CSV to Array 
    var csvToJSON = function (content) {
        var lines = content.csv.split(new RegExp('\n(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
        var result = [];
        var start = 0;
        var columnCount = lines[0].split(content.separator).length;

        var headers = [];
        if (content.header) {
            headers = lines[0].split(content.separator);
            start = 1;
        }

        for (var i = start; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
            if (currentline.length === columnCount) {
                if (content.header) {
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j].replace(/[/\n/\r]+/g, '')] = cleanCsvValue(currentline[j]);
                    }
                } else {
                    for (var k = 0; k < currentline.length; k++) {
                        obj[k] = cleanCsvValue(currentline[k]);
                    }
                }
                result.push(obj);
            }
        }
        return result;
    };
    return {
        'csvToJSON': csvToJSON
    }
});
