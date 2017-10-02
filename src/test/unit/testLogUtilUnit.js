/*global describe:false, it:false*/

'use strict';

var should = require('should');
var logger = require('../../lib/logUtil');
var logUtilWrapper = require('../../lib/logUtil');
var chai = require('chai');
var assert = chai.assert;
var recording = require('../../node_modules/log4js/lib/appenders/recording');

describe('logUtil::Validate input', () => {
    describe('Method: validateInput()', () => {
        it('Input - Valid input for [level (INFO), info, controller] ', (done) => {
            logUtilWrapper.validateInput('INFO', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [level (DEBUG), info, controller] ', (done) => {
            logger.validateInput('DEBUG', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [level (WARN), info, controller] ', (done) => {
            logger.validateInput('WARN', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [level (TRACE), info, controller] ', (done) => {
            logger.validateInput('TRACE', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [level (ERROR), info, controller] ', (done) => {
            logger.validateInput('ERROR', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [level (FATAL), info, controller] ', (done) => {
            logger.validateInput('FATAL', 'TEST', 'TEST_CTRL')
                .then((isValidated) => {
                    isValidated.should.equal(true);
                    done();
                });
        });
        it('Input - Valid input for [info, controller], Invalid input for [level] ', (done) => {
            logger.validateInput('JUNK', 'TEST', 'TEST_CTRL')
                .fail((err) => {
                    err.should.containEql('[logUtil]: Invalid level.');
                    done();
                });
        });
        it('Input - Valid input for [level, controller], Invalid input for [info] ', (done) => {
            logger.validateInput('INFO', '', 'TEST_CTRL')
                .fail((err) => {
                    err.should.containEql('[logUtil]: Info cannot be empty.');
                    done();
                });
        });
        it('Input - Valid input for [level, info], Invalid input for [controller] ', (done) => {
            logger.validateInput('INFO', 'TEST', '')
                .fail((err) => {
                    err.should.containEql('[logUtil]: Controller cannot be empty.');
                    done();
                });
        });
        it('Input - Invalid input for [level, info, controller] ', (done) => {
            logger.validateInput('JUNK', '', '')
                .fail((err) => {
                    err.should.containEql('[logUtil]: Invalid level.');
                    done();
                });
        });
    });
});

describe('logUtil::Frame logger message', () => {
    describe('Method: frameLoggerMsg()', () => {
        it('Input - Pass all values in loggerObj ', (done) => {
            var loggerObj = {
                controller: 'testCtrl',
                model: 'testModel',
                lib: 'testUtil',
                method: 'testMethod',
                info: 'testing',
                printLineFile: true,
                line: '1',
                file: 'testFile.js'
            };
            logger.frameLoggerMsg(loggerObj, (loggerMsg) => {
                loggerMsg.should.containEql('Controller');
                loggerMsg.should.containEql('Model');
                loggerMsg.should.containEql('Lib');
                loggerMsg.should.containEql('Method');
                loggerMsg.should.containEql('Line');
                loggerMsg.should.containEql('File');
                done();
            });
        });
        it('Input - Pass printLineFile as false in loggerObj ', (done) => {

            var loggerObj = {
                controller: 'testCtrl',
                model: 'testModel',
                lib: 'testUtil',
                method: 'testMethod',
                info: 'testing',
                printLineFile: false,
                line: '1',
                file: 'testFile.js'
            };
            logger.frameLoggerMsg(loggerObj, (loggerMsg) => {
                loggerMsg.should.not.equal('Line');
                loggerMsg.should.not.equal('File');
                done();
            });
        });
    });
});

describe('logUtil::Print logger message', () => {
    describe('Method: msg()', () => {
        it('Log INFO messages', () => {
            recording.reset();
            logger.msg('INFO', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'INFO'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log DEBUG messages', () => {
            recording.reset();
            logger.msg('DEBUG', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'DEBUG'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log TRACE messages', () => {
            recording.reset();
            logger.msg('TRACE', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'TRACE'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log WARN messages', () => {
            recording.reset();
            logger.msg('WARN', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'WARN'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log ERROR messages', () => {
            recording.reset();
            logger.msg('ERROR', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'ERROR'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log FATAL messages', () => {
            recording.reset();
            logger.msg('FATAL', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'FATAL'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log INFO messages by passing invalid info', () => {
            recording.reset();
            logger.msg('JUNK', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = recording.replay();
                assert(logEvents.find(event => event.level.levelStr === 'ERROR'));
            }, 1000);
        });
    });
});

/*
describe('logUtil::Print logger message', () => {
    describe('Method: msg()', () => {
        testAppender.init();
        it('Log INFO messages', () => {

            logger.msg('INFO', 'TEST_CTRL', '', '', 'test', 'something');

            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'INFO'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log DEBUG messages', () => {

            logger.msg('DEBUG', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'DEBUG'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log TRACE messages', () => {
            logger.msg('TRACE', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'TRACE'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log WARN messages', () => {
            logger.msg('WARN', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'WARN'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log ERROR messages', () => {
            logger.msg('ERROR', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'ERROR'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log FATAL messages', () => {
            logger.msg('FATAL', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'FATAL'));
                assert(logEvents.find(event => event.data[0].startsWith('something')));
            }, 1000);
        });
        it('Log INFO messages by passing invalid info', () => {
            logger.msg('JUNK', 'TEST_CTRL', '', '', 'test', 'something');
            setTimeout(function () {
                var logEvents = testAppender.getLogEvents();
                assert(logEvents.find(event => event.level.levelStr === 'ERROR'));
            }, 1000);
        });
    });
});
*/
