console.log('here')
describe('My app', function () {

    console.log('Starting test suite "GUEST"');
    var navbarbrand = element.all(by.css('.navbar-brand'));
    it('Should automatically redirect', function () {
        expect(navbarbrand.getText()).toEqual('RABO Bank');
    });
});