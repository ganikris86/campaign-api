'use strict';

function statisticsModel() {
    return {};
}

module.exports = statisticsModel;

var Q = require('q');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var commonDBUtil = require('../lib/commonDBUtil');
var modelHelper = require('./modelHelper');
var DBUtil = require('../lib/dbUtil');

/**
 * Get campaign transactions
 * @param campaignStatisticsRequestParameters
 * @returns {d.promise}
 */
statisticsModel.getCampaignTransactions = function(campaignStatisticsRequestParameters){

    logger.msg('INFO', 'statisticsService', 'statisticsModel', '', 'getCampaignTransactions', 'Get campaign transactions');

    var d = Q.defer();

    var sqlData = [];
    var sql = 'SELECT t.tc_txn_iid,' +
              '       to_char(t.txn_date,\'YYYYMMDD HH24:MI:SS\'),' +
              '       t.md_bucket_iid,' +
              '       t.orig_purch_amt - t.disc_amt - t.rdm_amt,' +
              '       tta.txn_type,' +
              '       tta.entity_type,' +
              '       tta.entity_iid,' +
              '       tta.quantity,' +
              '       tta.amount,' +
              '       tta.aux_entity_type,' +
              '       tta.aux_entity_iid,' +
              '       c.owner_type,' +
              '       t.txn_type' +
              '  FROM tc_txn t' +
              '  JOIN tc_txn_amount tta ON tta.tc_txn_iid = t.tc_txn_iid' +
              '                        AND tta.txn_type IN (1, 5)' +
              '                        AND nvl(tta.entity_type,\'D\') NOT IN (\'MS\')' +
              '                        AND tta.aux_entity_type = \'CP\'';

    if (campaignStatisticsRequestParameters.campaignId) {
        sql = sql + ' AND tta.aux_entity_iid = :CAMPAIGN_ID';
        sqlData.push(campaignStatisticsRequestParameters.campaignId);
    }

    sql = sql + ' JOIN campaign c ON c.campaign_id = tta.aux_entity_iid';

    if (campaignStatisticsRequestParameters.isMerchantCampaign) {
        sql = sql + ' AND c.owner_type = ' + constants.DB_OWNERTYPE_MERCHANT;
    }

    sql = sql + ' WHERE t.txn_type IN (17, 18, 5, 8)';

    sql = sql + ' AND t.merchant_id = :MERCHANT_ID';
    sqlData.push(campaignStatisticsRequestParameters.merchantId);

    sql = sql + ' AND trunc(t.txn_date) BETWEEN to_date(:START_DATE,\'' + constants.DATEFORMAT_YYYYMMDD + '\') AND to_date(:END_DATE,\'' + constants.DATEFORMAT_YYYYMMDD + '\')';
    sqlData.push(campaignStatisticsRequestParameters.startDate);
    sqlData.push(campaignStatisticsRequestParameters.endDate);

    sql = sql + ' AND NOT EXISTS (SELECT 1' +
                '                   FROM tc_txn t1' +
                '                  WHERE t1.txn_type = 5' +
                '                    AND t1.void_orig_txn_iid = t.tc_txn_iid)';

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'statisticsService', 'statisticsModel', '', 'getCampaignTransactions', 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            try {
                var stream = dbConn.queryStream(sql, sqlData);
                var resultSet = [];
                stream.on('error', function (error) {
                    logger.msg('ERROR', 'statisticsService', 'statisticsModel', '', 'getCampaignTransactions', 'Error during streaming data :: err - ' + error);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                });
                stream.on('data', function (data) {
                    resultSet.push(data);
                });
                stream.on('end', function () {
                    modelHelper.convertCampaignTransactionDetailsResultToObject(resultSet)
                        .then(function (dbResults){
                            d.resolve(dbResults);
                        }, function (err) {
                            d.reject(err);
                        });
                    DBUtil.releaseConnection(dbConn);
                });
            } catch (err) {
                DBUtil.releaseConnection(dbConn);
                d.reject(err);
            }
        }
    });

    return d.promise;
};

/**
 * Get merchant transactions
 * @param merchantStatisticsRequestParameters
 * @returns {d.promise}
 */
statisticsModel.getMerchantTransactions = function(merchantStatisticsRequestParameters){

    logger.msg('INFO', 'statisticsService', 'statisticsModel', '', 'getMerchantTransactions', 'Get merchant transactions');

    var d = Q.defer();

    var sqlData = [];
    var sql = 'SELECT t.tc_txn_iid,' +
        '       to_char(t.txn_date,\'YYYYMMDD HH24:MI:SS\'),' +
        '       t.md_bucket_iid,' +
        '       t.orig_purch_amt - t.disc_amt - t.rdm_amt,' +
        '       t.txn_type' +
        '  FROM tc_txn t' +
        ' WHERE t.txn_type IN (17, 18, 5, 8)';

    sql = sql + ' AND t.merchant_id = :MERCHANT_ID';
    sqlData.push(merchantStatisticsRequestParameters.merchantId);

    sql = sql + ' AND trunc(t.txn_date) BETWEEN to_date(:START_DATE,\'' + constants.DATEFORMAT_YYYYMMDD + '\') AND to_date(:END_DATE,\'' + constants.DATEFORMAT_YYYYMMDD + '\')';
    sqlData.push(merchantStatisticsRequestParameters.startDate);
    sqlData.push(merchantStatisticsRequestParameters.endDate);

    sql = sql + ' AND NOT EXISTS (SELECT 1' +
    '                   FROM tc_txn t1' +
    '                  WHERE t1.txn_type = 5' +
    '                    AND t1.void_orig_txn_iid = t.tc_txn_iid)';

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'statisticsService', 'statisticsModel', '', 'getMerchantTransactions', 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            try {
                var stream = dbConn.queryStream(sql, sqlData);
                var resultSet = [];
                stream.on('error', function (error) {
                    logger.msg('ERROR', 'statisticsService', 'statisticsModel', '', 'getMerchantTransactions', 'Error during streaming data :: err - ' + error);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                });
                stream.on('data', function (data) {
                    resultSet.push(data);
                });
                stream.on('end', function () {
                    modelHelper.convertMerchantTransactionDetailsResultToObject(resultSet)
                        .then(function (dbResults){
                            d.resolve(dbResults);
                        }, function (err) {
                            d.reject(err);
                        });
                    DBUtil.releaseConnection(dbConn);
                });
            } catch (err) {
                DBUtil.releaseConnection(dbConn);
                d.reject(err);
            }
        }
    });

    return d.promise;
};

