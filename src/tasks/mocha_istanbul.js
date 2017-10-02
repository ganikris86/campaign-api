"use strict";

module.exports = function coverage(grunt) {
    // Load task
    grunt.loadNpmTasks("grunt-mocha-istanbul");
    // Options
        return {
            src: "test",
            options: {
                coverage:true,
                timeout:10000,
                root:"../"
            }
    };
};

