'use strict';
/**
 * Common DBU utility module that allows the following:
 *
 */

function commonDBUtil() {
    /**
     * TODO - Should remove the jshint error suppression on using this
     */
    /*jshint -W040 */
    this.dbConn = null;
}


module.exports = commonDBUtil;

var logger = require('./logUtil');
var Q = require('q');
var DBUtil = require('./dbUtil');

//Get method which gets used in model
commonDBUtil.getDbConn = function() {
    return this.dbConn;
};

//Set method which is required to set the db connection to this.dbConn
commonDBUtil.setDbConn = function(dbConnection) {
    this.dbConn = dbConnection;
};

//Get DB Connection
commonDBUtil.getDBConnection = function () {
    logger.msg('INFO', 'service', '', 'commonDBUtil', 'getDBConnection', 'Get DBConnection');
    var d = Q.defer();

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'service', '', 'commonDBUtil', 'getDBConnection', 'Error during getConnection :: err - ' + err);
            d.reject(err);
        } else {
            commonDBUtil.setDbConn(dbConn);
            logger.msg('INFO', 'service', '', 'commonDBUtil', 'getDBConnection', 'DBConnection obtained');
            d.resolve('');
        }
    });
    logger.msg('INFO', 'service', '', 'commonDBUtil', 'getDBConnection', 'Get DBConnection - Pt3');
    return d.promise;
};

//Commit transaction
commonDBUtil.commitTransaction = function () {
    logger.msg('INFO', 'service', '', 'commonDBUtil', 'commitTransaction', 'Commit transaction');
    var d = Q.defer();

    commonDBUtil.getDbConn().commit(function (err) {
        if (err) {
            logger.msg('ERROR', 'service', '', 'commonDBUtil', 'commitTransaction', 'Error during commit :: err - ' + err);
            DBUtil.releaseConnection(commonDBUtil.getDbConn());
            d.reject(err);
        } else {
            logger.msg('INFO', 'service', '', 'commonDBUtil', 'commitTransaction', 'Commit Applied');
            DBUtil.releaseConnection(commonDBUtil.getDbConn());
            d.resolve('');
        }
    });
    return d.promise;
};

//Rollback transaction
commonDBUtil.rollbackTransaction = function () {
    logger.msg('INFO', 'service', '', 'commonDBUtil', 'rollbackTransaction', 'Rollback transaction');
    var d = Q.defer();

    commonDBUtil.getDbConn().rollback(function () {
        DBUtil.releaseConnection(commonDBUtil.getDbConn());
        d.resolve('');
    });

    return d.promise;
};

//Fetch nextval from a sequence
commonDBUtil.getSequenceNextValue = function (sequenceName) {
    logger.msg('INFO', 'service', '', 'commonDBUtil', 'getSequenceNextValue', 'Get sequence next value for ' + sequenceName);
    var d = Q.defer();

    var sqlSequence = 'SELECT ' + sequenceName + '.NEXTVAL FROM DUAL';

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'service', '', 'commonDBUtil', 'getSequenceNextValue', 'Error during getConnection :: err - ' + err);
            d.reject(err);
        } else {
            dbConn.execute(sqlSequence, function (err, results) {
                if (err) {
                    logger.msg('ERROR', 'service', '', 'commonDBUtil', 'getSequenceNextValue', 'Error during executing SQL :: err - ' + err);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                } else {
                    DBUtil.releaseConnection(dbConn);
                    //Generated sequence Id
                    var sequenceId = results.rows[0][0];
                    d.resolve(sequenceId);
                }
            });
        }
    });
    return d.promise;
};
