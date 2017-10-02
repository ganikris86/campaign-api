'use strict';


module.exports = function mochacli(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-mocha-cli');

	// Options
	return {
	    "src": ["test/*.js"],
	    "options": {
	        "timeout": 10000,
	        "check-leaks": true,
	        "ui": "bdd",
                "reporter": "spec",
                "force":false,
                "bail": false,
                "async-only":false
	    }
	};
};

