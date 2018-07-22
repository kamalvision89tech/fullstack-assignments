exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        'browserName': 'chrome'
    },
    suites: {
        e2e2: '.e2e-spec.js'
    },
    jasmineNodeOpts: {
        showColors: true
    },
    specs: ['./app.e2e-spec.js']
};