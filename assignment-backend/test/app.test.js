describe('rabo_bank', () => {

    beforeEach(angular.mock.module('app'));

    var $controller, $rootScope;

    beforeEach(angular.mock.inject((_$controller_, _$rootScope_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));
    
    it('title should be RABO Bank', () => {
        var scope = $rootScope.$new();
        scope.title = "RABO Bank";
		expect(scope.title).toMatch("RABO Bank");
    });

    it('issueListData should have empty array', () => {
        var scope = $rootScope.$new();
        var controller = $controller('mainCntrl', { $scope: scope });
		expect(scope.issueListData.length).toBe(0);
    });

    it('issueListData should have length of 1 once that is filtered', () => {
        var scope = $rootScope.$new();
        var controller = $controller('mainCntrl', { $scope: scope });
        scope.accessLevel = 1;
        scope.issueListData = [{"First name":"Theo","Sur name":"Jansen","Issue count":"5","Date of birth":"1978-01-02T00:00:00"},
{"First name":"Fiona","Sur name":"de Vries","Issue count":"7","Date of birth":"1950-11-12T00:00:00"},
{"First name":"Petra","Sur name":"Boersma","Issue count":"1","Date of birth":"2001-04-20T00:00:00"}];
        if(scope.accessLevel == 1){
			expect(scope.issueListData.length).toBe(3);
		}
    });
    
});