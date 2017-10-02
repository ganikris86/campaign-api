/*global describe:false, it:false, before:false, after:false*/

'use strict';

var newman = require('newman');


// Campaign-API Integration tests
// call newman.run to pass `options` object and wait for callback
newman.run({
    environment: require('./collections/xls_campaign_api_v1_ci.postman_environment.json'),
    collection: require('./collections/xls_campaign_api_v1.postman_collection.json'),
    globals: require('./collections/globals.postman_globals.json'),
	reporters: ['cli', 'html'],
	reporter : { html : { export : './test/integration/html/report.html' } },
	stopOnError: true,
	color: true,
    abortOnFailure:true
}, function (err) {
	if (err) {
        console.log('Campaign-API collection with errors = '+err.stack);
        process.exit(1);
    } else {
        console.log('Campaign-API collection run complete!');
    }
});

