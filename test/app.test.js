describe('rabo_bank', () => {

    beforeEach(angular.mock.module('app'));

    var $controller, $rootScope, $scope, CSV2JSONconvert;

    beforeEach(angular.mock.inject((_$controller_, _$rootScope_, _CSV2JSONconvert_) => {
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        CSV2JSONconvert = _CSV2JSONconvert_;
    }));
    
    it('Default title should be RABO Bank', () => {
        var vm = $controller("RaboMainPage", { $scope: $scope });
        expect($scope.title).toMatch("RABO Bank");
    });

    it('IssueList Data table should have default empty array', () => {
        var controller = $controller('RaboMainPage', { $scope: $scope });
        expect($scope.issueListData.length).toBe(0);
    });

    it('Checking clearAllRaboUsers functionality', () => {
        var controller = $controller('RaboMainPage', { $scope: $scope });
        $scope.accessLevel = 1;
        $scope.issueListData = [{"First name":"Theo","Sur name":"Jansen","Issue count":"5","Date of birth":"1978-01-02T00:00:00"},
{"First name":"Fiona","Sur name":"de Vries","Issue count":"7","Date of birth":"1950-11-12T00:00:00"},
{"First name":"Petra","Sur name":"Boersma","Issue count":"1","Date of birth":"2001-04-20T00:00:00"}];
        $scope.raboscope.clearAllRaboUsers();
        expect($scope.issueListData.length).toBe(0);
    });

    it('Checking validation message toggleClose function', () => {
        var controller = $controller('RaboMainPage', { $scope: $scope });
        $scope.isValidFile = false;
        expect($scope.toggleClose()).toBe(true);
    });

    it('Checking the injected dependency returning the singleton object ', function () {
        expect(typeof(CSV2JSONconvert)).toBe('object');
    });
    
    it('Checking the CSV2JSONconvert factory returning object according to the string input', function () {
        var content = {
            csv: 'First name,Sur name,Issue count,Date of birth \nTheo,Jansen,5,1978-01-02T00:00:00',
            header: true,
            separator: ',',
            encoding: 'ISO-8859-1',
        };
        expect(typeof (CSV2JSONconvert.csvToJSON(content))).toBe('object');
    });
});
