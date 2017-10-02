'use strict';

var oracledb = require('oracledb');
var logger = require('./logUtil');
var util = require('util');
var nconf = require('nconf').file({ file: 'config/config.json' });
var crypt = require('./cryptUtil');
var asyncLib = require('async');

oracledb.maxRows = 1000; //SQL which returns more than 1000 rows should use queryStream method to return the results

var database = nconf.get('dbConfig');
var retryCount = database.retryCount;
var retryInterval = database.retryInterval;

var dbUtil = function () {
  var pool = null;
  return {
    config: function (conf) {
      var decryptedPassword = crypt.decrypt(conf.password);
      logger.msg('INFO', 'service', '', 'dbUtil', 'config', 'DBUtil::Config::Oracle Pool configuration');
      var connectString = conf.host + ':'+conf.port +'/'+ conf.database;
      oracledb.createPool(
        {
          user          : conf.user,
          password      : decryptedPassword,
          connectString : connectString,
          poolMin       : conf.poolMin,
          poolMax       : conf.poolMax
        },
        function(err, ppool){
            pool = ppool;
            if (pool !== undefined){
              logger.msg('INFO', 'service', '', 'dbUtil', 'config', 'DBUtil::Config::pool is created');
            } else {
              if(err){
                logger.msg('ERROR', 'service', '', 'dbUtil', 'config', 'DBUtil::Config::Error - ' + err);
              }
              logger.msg('ERROR', 'service', '', 'dbUtil', 'config', 'DBUtil::Config::Problem in creating pool');
            }
        }
      );
    },
    getConnection: function (callback) {
      if (pool) {
        asyncLib.retry({
          times: retryCount,
          interval: retryInterval
        }, function attemptGetConnection(asyncCallback) {
          pool.getConnection(
            function (err, dbConn) {
              dbConn.execute('SELECT 1 FROM DUAL', [], function (err, results) {
                if(err){
                  logger.msg('ERROR', 'service', '', 'dbUtil', 'getConnection', 'DBUtil::getConnection::Error - ' + err);
                  dbConn.release(function(err){
                    if(err){
                      logger.msg('ERROR', 'service', '', 'dbUtil', 'getConnection', 'DBUtil::getConnection::Error during release - ' + err);
                    }
                  });
                  asyncCallback(err);
                } else {
                  asyncCallback(err, dbConn);
                }
              });
            }
          );
        },function(err, dbConn){
          callback(err,dbConn);
        });
      } else {
        logger.msg('ERROR', 'service', '', 'dbUtil', 'getConnection', 'DBUtil::getConnection::DB Pool not found.  Make sure dbUtil is configured properly.');
        var err = 'DBUtil::getConnection::DB Pool not found.  Make sure dbUtil is configured properly.';
        if (callback) {
          callback(err);
        } else {
          throw err;
        }
      }
    },
    releaseConnection: function (connection) {
      if (connection) {
        connection.release(function(err){
          if(err){
            logger.msg('ERROR', 'service', '', 'dbUtil', 'releaseConnection', 'DBUtil::releaseConnection::Error - ' + err);
          }
        });
      }
    }
  };
};

module.exports = dbUtil();
