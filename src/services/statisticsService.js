'use strict';

var statisticsModel = require('../models/statisticsModel');
var statisticsSchema = require('../schema/statisticsSchema');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var httpStatus = require('http-status');
var commonUtil = require('../lib/commonUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var validateData = require('../lib/jsonSchemaUtil');
var serviceHelper = require('./serviceHelper');
var campaignModel = require('../models/campaignModel');
var Q = require('q');
var moment = require('moment');
var util = require('util');
// Load the full build.
var lodash = require('lodash');

function statisticsService() {
}

module.exports = statisticsService;

/**
 * Campaign statistics
 * @param req
 * @param res
 * @returns {*}
 */
statisticsService.campaignStatistics = function (req, res) {
    logger.msg('INFO', 'statisticsService', '', '', 'campaignStatistics', 'Campaign statistics');
    var campaignStatisticsObj;
    return commonUtil.parseRequestObject(req.body, statisticsSchema.campaignStatisticsReqSchemaDef)
            .then(function (respCampaignStatisticsObj) {
                campaignStatisticsObj = respCampaignStatisticsObj;
                logger.msg('INFO', 'statisticsService', '', '', 'campaignStatistics', 'Parsed campaign statistics req - ' + JSON.stringify(campaignStatisticsObj));
                return statisticsService.validateCampaignStatisticsRequestData(campaignStatisticsObj);
            })
            .then(function (errorArray) {
                if (!(errorArray) || (errorArray.length === 0)) {
                    return statisticsService.computeCampaignStatistics(campaignStatisticsObj)
                        .then(function (respCampaignStatisticsObj) {
                            logger.msg('INFO', 'statisticsService', '', '', 'campaignStatistics', 'Computed campaign statistics - ' + JSON.stringify(respCampaignStatisticsObj));
                            return commonUtil.sendResponse(res, httpStatus.OK, respCampaignStatisticsObj);
                        }, function (err) {
                            logger.msg('ERROR', 'statisticsService', '', '', 'campaignStatistics', 'Error in campaignStatistics - ' + err.stack);
                            return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
                        });
                } else {
                    logger.msg('INFO', 'statisticsService', '', '', 'campaignStatistics', 'Validation error in campaignStatistics - ' + JSON.stringify(errorArray));
                    return commonUtil.sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, errorArray);
                }
            }, function (err) {
                logger.msg('ERROR', 'statisticsService', '', '', 'campaignStatistics', 'Error in campaignStatistics - ' + err.stack);
                return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
            });
};

/**
 * Merchant statistics
 * @param req
 * @param res
 * @returns {*}
 */
statisticsService.merchantStatistics = function (req, res) {
    logger.msg('INFO', 'statisticsService', '', '', 'merchantStatistics', 'Merchant statistics');
    var merchantStatisticsObj;
    return commonUtil.parseRequestObject(req.body, statisticsSchema.merchantStatisticsReqSchemaDef)
        .then(function (respMerchantStatisticsObj) {
            merchantStatisticsObj = respMerchantStatisticsObj;
            logger.msg('INFO', 'statisticsService', '', '', 'merchantStatistics', 'Parsed campaign statistics req - ' + JSON.stringify(merchantStatisticsObj));
            return statisticsService.validateMerchantStatisticsRequestData(merchantStatisticsObj);
        })
        .then(function (errorArray) {
            if (!(errorArray) || (errorArray.length === 0)) {
                return statisticsService.computeMerchantStatistics(merchantStatisticsObj)
                    .then(function (respMerchantStatisticsObj) {
                        logger.msg('INFO', 'statisticsService', '', '', 'merchantStatistics', 'Computed merchant statistics - ' + JSON.stringify(respMerchantStatisticsObj));
                        return commonUtil.sendResponse(res, httpStatus.OK, respMerchantStatisticsObj);
                    }, function (err) {
                        logger.msg('ERROR', 'statisticsService', '', '', 'merchantStatistics', 'Error in merchantStatistics - ' + err.stack);
                        return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
                    });
            } else {
                logger.msg('INFO', 'statisticsService', '', '', 'merchantStatistics', 'Validation error in merchantStatistics - ' + JSON.stringify(errorArray));
                return commonUtil.sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, errorArray);
            }
        }, function (err) {
            logger.msg('ERROR', 'statisticsService', '', '', 'merchantStatistics', 'Error in merchantStatistics - ' + err.stack);
            return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
        });
};

/**
 * Validation for campaign statistics req data
 * @param campaignStatisticsObj
 * @returns {d.promise}
 */
statisticsService.validateCampaignStatisticsRequestData = function (campaignStatisticsObj) {
    var d = Q.defer();
    var errorArray = [], period = {};
    logger.msg('INFO', 'statisticsService', '', '', 'validateCampaignStatisticsRequestData', 'Validation for campaign statistics req data');
    validateData.validateSchema(campaignStatisticsObj, statisticsSchema.campaignStatisticsReqSchemaDef)
        .then(function (schemaError) {
            if (schemaError) {
                errorArray = schemaError;
            }
            period.startDate = campaignStatisticsObj.period ? campaignStatisticsObj.period.startDate : '';
            period.endDate = campaignStatisticsObj.period ? campaignStatisticsObj.period.endDate : '';
            return serviceHelper.validateStartDateFormat(period.startDate, errorArray);
        })
        .then(function (startDateFormatErrorArray) {
            errorArray = startDateFormatErrorArray;
            return serviceHelper.validateEndDateFormat(period.endDate, errorArray);
        })
        .then(function (endDateFormatErrorArray) {
            errorArray = endDateFormatErrorArray;
            return serviceHelper.validateEndDateLessThanStartDate(period, errorArray);
        })
        .then(function (endDateInValidErrorArray) {
            errorArray = endDateInValidErrorArray;
            return statisticsService.validateMerchantId(campaignStatisticsObj, errorArray);
        })
        .then(function (merchantIdErrorArray) {
            errorArray = merchantIdErrorArray;
            d.resolve(errorArray);
        }, function (err) {
            logger.msg('ERROR', 'statisticsService', '', '', 'validateCampaignStatisticsRequestData', 'Error in validateCampaignStatisticsRequestData - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Validation for merchant statistics req data
 * @param merchantStatisticsObj
 * @returns {d.promise}
 */
statisticsService.validateMerchantStatisticsRequestData = function (merchantStatisticsObj) {
    var d = Q.defer();
    var errorArray = [], period = {};
    logger.msg('INFO', 'statisticsService', '', '', 'validateMerchantStatisticsRequestData', 'Validation for merchant statistics req data');
    validateData.validateSchema(merchantStatisticsObj, statisticsSchema.merchantStatisticsReqSchemaDef)
        .then(function (schemaError) {
            if (schemaError) {
                errorArray = schemaError;
            }
            period.startDate = merchantStatisticsObj.period ? merchantStatisticsObj.period.startDate : '';
            period.endDate = merchantStatisticsObj.period ? merchantStatisticsObj.period.endDate : '';
            return serviceHelper.validateStartDateFormat(period.startDate, errorArray);
        })
        .then(function (startDateFormatErrorArray) {
            errorArray = startDateFormatErrorArray;
            return serviceHelper.validateEndDateFormat(period.endDate, errorArray);
        })
        .then(function (endDateFormatErrorArray) {
            errorArray = endDateFormatErrorArray;
            return serviceHelper.validateEndDateLessThanStartDate(period, errorArray);
        })
        .then(function (endDateInValidErrorArray) {
            errorArray = endDateInValidErrorArray;
            return statisticsService.validateMerchantId(merchantStatisticsObj, errorArray);
        })
        .then(function (merchantIdErrorArray) {
            errorArray = merchantIdErrorArray;
            d.resolve(errorArray);
        }, function (err) {
            logger.msg('ERROR', 'statisticsService', '', '', 'validateMerchantStatisticsRequestData', 'Error in validateMerchantStatisticsRequestData - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Validation for merchant Id
 * @param campaignStatisticsObj
 * @param errorArray
 * @returns {d.promise}
 */
statisticsService.validateMerchantId = function (campaignStatisticsObj, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'statisticsService', '', '', 'validateMerchantId', 'Validation for merchant Id');
    if (campaignStatisticsObj.merchantId) {
        campaignModel.checkMerchantIdExists(campaignStatisticsObj.merchantId)
            .then(function (merchantExistsCount) {
                if (parseInt(merchantExistsCount) === 0) {
                    logger.msg('INFO', 'serviceHelper', '', '', 'validateMerchantId', 'Validation error - Not a valid merchant Id');
                    var errorMessage = util.format(constants.MSG_INVALID_MERCHANT_ID);
                    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'merchantId', campaignStatisticsObj.merchantId, errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                            d.resolve(errorArray);
                        }, function (err) {
                            d.reject(err);
                        });
                } else {
                    d.resolve(errorArray);
                }
            }, function (err) {
                d.reject(err);
            });
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

/**
 * Compute campaign statistics
 * @param campaignStatisticsObj
 * @returns {d.promise}
 */
statisticsService.computeCampaignStatistics = function (campaignStatisticsObj) {
    var d = Q.defer();
    var errorArray = [];
    logger.msg('INFO', 'statisticsService', '', '', 'computeCampaignStatistics', 'Compute campaign statistics');

    //Construct request parameters
    var campaignTransactionRequestParameters = {
        'campaignId': campaignStatisticsObj.campaignId,
        'startDate': campaignStatisticsObj.period ? campaignStatisticsObj.period.startDate : '',
        'endDate': campaignStatisticsObj.period ? campaignStatisticsObj.period.endDate : '',
        'merchantId': campaignStatisticsObj.merchantId,
        'isMerchantCampaign': campaignStatisticsObj.isMerchantCampaign
    };

    var period = {
        'startDate': campaignTransactionRequestParameters.startDate,
        'endDate': campaignTransactionRequestParameters.endDate
    };

    statisticsService.reComputeEndDate(period, campaignStatisticsObj.rollUpPeriodType)
        .then(function(reComputedEndDate) {
            campaignTransactionRequestParameters.endDate = reComputedEndDate;
            campaignStatisticsObj.period.endDate = reComputedEndDate; //This is required as the response picks the dates from this obj
            return statisticsModel.getCampaignTransactions(campaignTransactionRequestParameters);
        })
        .then(function(campaignTransactionResponseDB) {
            return statisticsService.processCampaignTransactionStatistics(campaignTransactionResponseDB, campaignStatisticsObj);
        })
        .then(function (campaignTransactionResponse) {
            d.resolve(campaignTransactionResponse);
        }, function (err) {
            logger.msg('ERROR', 'statisticsService', '', '', 'computeCampaignStatistics', 'Error in computeCampaignStatistics - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Compute merchant statistics
 * @param merchantStatisticsObj
 * @returns {d.promise}
 */
statisticsService.computeMerchantStatistics = function (merchantStatisticsObj) {
    var d = Q.defer();
    var errorArray = [];
    logger.msg('INFO', 'statisticsService', '', '', 'computeMerchantStatistics', 'Compute merchant statistics');

    //Construct request parameters
    var merchantTransactionRequestParameters = {
        'startDate': merchantStatisticsObj.period ? merchantStatisticsObj.period.startDate : '',
        'endDate': merchantStatisticsObj.period ? merchantStatisticsObj.period.endDate : '',
        'merchantId': merchantStatisticsObj.merchantId
    };

    var period = {
        'startDate': merchantTransactionRequestParameters.startDate,
        'endDate': merchantTransactionRequestParameters.endDate
    };

    statisticsService.reComputeEndDate(period, merchantStatisticsObj.rollUpPeriodType)
        .then(function(reComputedEndDate) {
            merchantTransactionRequestParameters.endDate = reComputedEndDate;
            merchantStatisticsObj.period.endDate = reComputedEndDate; //This is required as the response picks the dates from this obj
            return statisticsModel.getMerchantTransactions(merchantTransactionRequestParameters);
        })
        .then(function(merchantTransactionResponseDB) {
            return statisticsService.processMerchantTransactionStatistics(merchantTransactionResponseDB, merchantStatisticsObj);
        })
        .then(function (merchantTransactionResponse) {
            d.resolve(merchantTransactionResponse);
        }, function (err) {
            logger.msg('ERROR', 'statisticsService', '', '', 'computeMerchantStatistics', 'Error in computeMerchantStatistics - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Process campaign transaction statistics
 * @param campaignTransactionsDB
 * @param campaignStatisticsObj
 * @returns {d.promise}
 */
statisticsService.processCampaignTransactionStatistics = function (campaignTransactionsDB, campaignStatisticsObj) {
    var d = Q.defer();
    logger.msg('INFO', 'statisticsService', '', '', 'processCampaignTransactionStatistics', 'Process campaign transaction statistics');

    var statsArr = [];

    if (campaignTransactionsDB.length > 0) {

        //Sort the transactions
        var sortedCampaignTransactionsDB = lodash.sortBy(campaignTransactionsDB, ['txn_date', 'tc_txn_iid']);

        var groupedResultsKeys = [], keys = [], groupedResults, isCumulativeRollUpPeriodType = false;
        //Include a configuration which describes whether a week start should be Monday or Sunday
        var tenantInfo = commonUtil.getTenantInfoFromGlobal();
        var startDayOfTheWeek='week';// Week start day on Sunday. moment().startOf('week').weekday()
        if(tenantInfo.isWeekStartDayOnMonday){
            startDayOfTheWeek='isoweek';//// Week start day on Monday. moment().startOf('isoweek').weekday()
        }
        //Check if the roll up period type is Cumulative
        if (campaignStatisticsObj.rollUpPeriodType && campaignStatisticsObj.rollUpPeriodType === constants.ROLL_UP_PERIOD_TYPE_CUMULATIVE) {
            isCumulativeRollUpPeriodType = true;
        }
        //Do not group the transactions when roll up period type is Cumulative
        if (isCumulativeRollUpPeriodType) {
            groupedResults = sortedCampaignTransactionsDB;
            groupedResultsKeys.push(constants.ROLL_UP_PERIOD_TYPE_CUMULATIVE);
        } else {
            //Group By txn date for input rollUpPeriodType
            groupedResults = lodash.groupBy(sortedCampaignTransactionsDB, function (result) {
                var key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM');
                switch(campaignStatisticsObj.rollUpPeriodType){
                    case constants.ROLL_UP_PERIOD_TYPE_PER_HOUR: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('hour').format('HH'); key = key + 'h'; break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_DAY: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('day').format('YYYY-MM-DD'); break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_WEEK:
                        var weekYearMonth = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf(startDayOfTheWeek).format('YYYY');
                        var weekNumber = '-W' + moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf(startDayOfTheWeek).format('W');
                        key = weekYearMonth + weekNumber;
                        break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_MONTH: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM'); break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_QUARTER: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('quarter').format('YYYY-Q'); key = key.replace('-','-Q'); break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_YEAR: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('year').format('YYYY'); break;
                    case constants.ROLL_UP_PERIOD_TYPE_PER_SEMESTER:
                        var semesterYearMonth = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM');
                        var semesterYear = semesterYearMonth.substring(0, 4); //Fetch the year component from YYYY-MM eg., 2017
                        var semesterMonth = semesterYearMonth.substring(5); //Fetch the month component from YYYY-MM eg., 04
                        key = (parseInt(semesterMonth) < 7) ? semesterYear + '-S1' : semesterYear + '-S2'; //If month is less than 7, it falls under S1. Else under S2
                        break;
                }
                groupedResultsKeys.push(key);
                return key;
            });
        }

        //Get distinct keys
        keys = lodash.intersection(groupedResultsKeys);

        //Iterate the keys
        for (var i = 0; i < keys.length; i++) {
            var slicedResults = (isCumulativeRollUpPeriodType) ? groupedResults : groupedResults[keys[i]];

            //If campaign Id is present in the request
            //Flow when a particular campaign's transactions for a particular merchant Id should be considered
            if (campaignStatisticsObj.campaignId) {
                var campStatsObj = statisticsService.getCampaignTransactionNumbers(slicedResults, keys[i], campaignStatisticsObj.campaignId);
                statsArr.push(campStatsObj);
            } else {
                //Flow when all campaign transactions for a particular merchant Id should be considered
                //Fetch the unique campaign Ids which serve as the keys
                var slicedResultsByCampaignKeys = lodash.intersection(lodash.map(slicedResults, 'aux_entity_iid'));
                //Group By aux_entity_iid (campaign_id)
                var slicedResultsByCampaign = lodash.groupBy(slicedResults, 'aux_entity_iid');
                //Iterate the campaign keys
                /*jshint -W073 */
                for (var j = 0; j < slicedResultsByCampaignKeys.length; j++) {
                    var campaignSpecificResults = slicedResultsByCampaign[slicedResultsByCampaignKeys[j]];
                    var statsObj = statisticsService.getCampaignTransactionNumbers(campaignSpecificResults, keys[i], slicedResultsByCampaignKeys[j]);
                    statsArr.push(statsObj);
                }
            }
        }
    }

    //Sort the statistics array
    var sortedStatsArr = lodash.sortBy(statsArr, ['rollUpSlice']);

    var responseObj = {};
    responseObj.rollUpPeriodType = campaignStatisticsObj.rollUpPeriodType;
    responseObj.period = campaignStatisticsObj.period;
    responseObj.merchantId = campaignStatisticsObj.merchantId;
    responseObj.statistics = sortedStatsArr;

    d.resolve(responseObj);

    return d.promise;
};

/**
 * Process merchant transaction statistics
 * @param merchantTransactionsDB
 * @param merchantStatisticsObj
 * @returns {d.promise}
 */
statisticsService.processMerchantTransactionStatistics = function (merchantTransactionsDB, merchantStatisticsObj) {
    var d = Q.defer();
    logger.msg('INFO', 'statisticsService', '', '', 'processMerchantTransactionStatistics', 'Process merchant transaction statistics');

    var statsArr = [];

    if (merchantTransactionsDB.length > 0) {

        //Sort the transactions
        var sortedMerchantTransactionsDB = lodash.sortBy(merchantTransactionsDB, ['txn_date', 'tc_txn_iid']);

        var groupedResultsKeys = [], keys = [];
        //Include a configuration which describes whether a week start should be Monday or Sunday
        var tenantInfo = commonUtil.getTenantInfoFromGlobal();
        var startDayOfTheWeek='week';// Week start day on Sunday. moment().startOf('week').weekday()
        if(tenantInfo.isWeekStartDayOnMonday){
            startDayOfTheWeek='isoweek';//// Week start day on Monday. moment().startOf('isoweek').weekday()
        }
        //Group By txn date for input rollUpPeriodType
        var groupedResults = lodash.groupBy(sortedMerchantTransactionsDB, function (result) {
            var key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM');
            switch(merchantStatisticsObj.rollUpPeriodType){
                case constants.ROLL_UP_PERIOD_TYPE_PER_HOUR: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('hour').format('HH'); key = key + 'h'; break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_DAY: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('day').format('YYYY-MM-DD'); break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_WEEK:
                    var weekYearMonth = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf(startDayOfTheWeek).format('YYYY');
                    var weekNumber = '-W' + moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf(startDayOfTheWeek).format('W');
                    key = weekYearMonth + weekNumber;
                    break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_MONTH: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM'); break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_QUARTER: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('quarter').format('YYYY-Q'); key = key.replace('-','-Q'); break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_YEAR: key = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('year').format('YYYY'); break;
                case constants.ROLL_UP_PERIOD_TYPE_PER_SEMESTER:
                    var semesterYearMonth = moment(result.txn_date, 'YYYYMMDD HH:mm:ss').startOf('month').format('YYYY-MM');
                    var semesterYear = semesterYearMonth.substring(0, 4); //Fetch the year component from YYYY-MM eg., 2017
                    var semesterMonth = semesterYearMonth.substring(5); //Fetch the month component from YYYY-MM eg., 04
                    key = (parseInt(semesterMonth) < 7) ? semesterYear + '-S1' : semesterYear + '-S2'; //If month is less than 7, it falls under S1. Else under S2
                    break;
            }
            groupedResultsKeys.push(key);
            return key;
        });

        //Get distinct keys
        keys = lodash.intersection(groupedResultsKeys);

        //Iterate the keys
        for (var i = 0; i < keys.length; i++) {
            var slicedResults = groupedResults[keys[i]];
            var statsObj = statisticsService.getMerchantTransactionNumbers(slicedResults, keys[i]);
            statsArr.push(statsObj);
        }
    }

    //Sort the statistics array
    var sortedStatsArr = lodash.sortBy(statsArr, ['rollUpSlice']);

    var responseObj = {};
    responseObj.rollUpPeriodType = merchantStatisticsObj.rollUpPeriodType;
    responseObj.period = merchantStatisticsObj.period;
    responseObj.merchantId = merchantStatisticsObj.merchantId;
    responseObj.statistics = sortedStatsArr;

    d.resolve(responseObj);

    return d.promise;
};

/**
 * Get campaign transaction numbers
 * @param campaignTransactionsResults
 * @param rollUpSlice
 * @param campaignId
 * @returns {{rollUpSlice: *, campaignId: *, ownerType: string, numberOfTransactions: number, numberOfCustomerTransacted: number, totalPurchaseAmount: number, averagePurchaseAmount: number, minimumPurchaseAmount: number, maximumPurchaseAmount: number, numberOfAwards: {discounts: number, pools: {amount: number, quantity: number}, coupons: number}}}
 */
statisticsService.getCampaignTransactionNumbers = function (campaignTransactionsResults, rollUpSlice, campaignId) {

    logger.msg('INFO', 'statisticsService', '', '', 'getCampaignTransactionNumbers', 'Get campaign transaction numbers');

    var noOfTransactions = 0, noOfCustomers = 0, totalPurchaseAmount = 0, averagePurchaseAmount = 0, minimumPurchaseAmount = 0, maximumPurchaseAmount = 0;
    var poolAwardQuantity = 0, poolAwardAmount = 0, discountAmount = 0, numberOfCoupons = 0;
    var noOfCancelledTransactions = 0, totalCancelledPurchaseAmount = 0, poolCancelledAwardAmount = 0, poolCancelledAwardQuantity = 0, numberOfCancelledCoupons = 0;

    //Find the owner type of campaign
    var ownerType = serviceHelper.convertOwnerTypeForResponse(campaignTransactionsResults[0].owner_type);

    //Number of customers
    var uniqueCustomerArray = lodash.intersectionBy(campaignTransactionsResults, 'md_bucket_iid');
    noOfCustomers = uniqueCustomerArray.length;

    //Filter the sale transactions
    var saleTransactionResults = lodash.filter(campaignTransactionsResults, function(txns) {
        return txns.main_txn_type === constants.XLS_TXN_TYPE_SALE || txns.main_txn_type === constants.XLS_TXN_TYPE_UPDATE;
    });

    //Filter the cancel transactions
    var cancelledTransactionResults = lodash.filter(campaignTransactionsResults, function(txns) {
        return txns.main_txn_type === constants.XLS_TXN_TYPE_CANCEL || txns.main_txn_type === constants.XLS_TXN_TYPE_REFUND;
    });

    if (saleTransactionResults.length > 0) {
        //Number of transactions
        var uniqueSaleTransactionArray = lodash.intersectionBy(saleTransactionResults, 'tc_txn_iid');
        noOfTransactions = uniqueSaleTransactionArray.length;

        //Total purchase amount (Adjusted purchase amount) from uniqueSaleTransactionArray
        totalPurchaseAmount = lodash.round(lodash.sumBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE);

        //Average purchase amount from uniqueSaleTransactionArray
        averagePurchaseAmount = lodash.round(lodash.meanBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE);

        //Minimum purchase amount from uniqueSaleTransactionArray
        var minimumPurchaseAmountTxn = lodash.minBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt');
        minimumPurchaseAmount = lodash.round(minimumPurchaseAmountTxn.adjusted_purchase_amt, constants.ROUND_UP_DECIMAL_VALUE);

        //Maximum purchase amount (Adjusted purchase amount) from uniqueSaleTransactionArray
        var maximumPurchaseAmountTxn = lodash.maxBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt');
        maximumPurchaseAmount = lodash.round(maximumPurchaseAmountTxn.adjusted_purchase_amt, constants.ROUND_UP_DECIMAL_VALUE);

        //Filter the transactions with discount (Use the full list of transactions)
        var discountTransactionArray = lodash.filter(saleTransactionResults, {'txn_type': 5});
        discountAmount = Math.abs(lodash.round(lodash.sumBy(discountTransactionArray, 'amount'), constants.ROUND_UP_DECIMAL_VALUE));

        //Filter the transactions with pool award (Use the full list of transactions)
        var poolTransactionArray = lodash.filter(saleTransactionResults, {'entity_type': 'PL'});
        poolAwardAmount = lodash.round(lodash.sumBy(poolTransactionArray, 'amount'), constants.ROUND_UP_DECIMAL_VALUE);
        poolAwardQuantity = lodash.round(lodash.sumBy(poolTransactionArray, 'quantity'), constants.ROUND_UP_DECIMAL_VALUE);

        //Filter the transactions with eCoupon award (Use the full list of transactions)
        var eCouponTransactionArray = lodash.filter(saleTransactionResults, {'entity_type': 'EC'});
        numberOfCoupons = lodash.sumBy(eCouponTransactionArray, 'quantity');
    }

    if (cancelledTransactionResults.length > 0) {
        //Number of cancelled transactions
        var uniqueCancelledTransactionArray = lodash.intersectionBy(cancelledTransactionResults, 'tc_txn_iid');
        noOfCancelledTransactions = uniqueCancelledTransactionArray.length;

        //Total cancelled purchase amount (Adjusted purchase amount) from uniqueCancelledTransactionArray
        totalCancelledPurchaseAmount = Math.abs(lodash.round(lodash.sumBy(uniqueCancelledTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE));

        //Filter the cancelled transactions with pool award (Use the full list of transactions)
        var poolCancelledTransactionArray = lodash.filter(cancelledTransactionResults, {'entity_type': 'PL'});
        poolCancelledAwardAmount = Math.abs(lodash.round(lodash.sumBy(poolCancelledTransactionArray, 'amount'), constants.ROUND_UP_DECIMAL_VALUE));
        poolCancelledAwardQuantity = Math.abs(lodash.round(lodash.sumBy(poolCancelledTransactionArray, 'quantity'), constants.ROUND_UP_DECIMAL_VALUE));

        //Filter the cancelled transactions with eCoupon award (Use the full list of transactions)
        var eCouponCancelledTransactionArray = lodash.filter(cancelledTransactionResults, {'entity_type': 'EC'});
        numberOfCancelledCoupons = Math.abs(lodash.sumBy(eCouponCancelledTransactionArray, 'quantity'));
    }

    var poolAward = {
        'amount': poolAwardAmount,
        'quantity': poolAwardQuantity
    };
    var noOfAwards = {
        'discounts': discountAmount,
        'pools': poolAward,
        'coupons': numberOfCoupons
    };
    var poolCancelledAward = {
        'amount': poolCancelledAwardAmount,
        'quantity': poolCancelledAwardQuantity
    };
    var noOfCancelledAwards = {
        'pools': poolCancelledAward,
        'coupons': numberOfCancelledCoupons
    };
    var statsObj = {
        'rollUpSlice': rollUpSlice,
        'campaignId': campaignId,
        'ownerType': ownerType,
        'numberOfTransactions': noOfTransactions,
        'numberOfCustomerTransacted': noOfCustomers,
        'totalPurchaseAmount': totalPurchaseAmount,
        'averagePurchaseAmount': averagePurchaseAmount,
        'minimumPurchaseAmount': minimumPurchaseAmount,
        'maximumPurchaseAmount': maximumPurchaseAmount,
        'numberOfAwards': noOfAwards,
        'numberOfRefundedTransactions': noOfCancelledTransactions,
        'totalRefundedPurchaseAmount': totalCancelledPurchaseAmount,
        'numberOfCancelledAwards': noOfCancelledAwards
    };

    return statsObj;
};

/**
 * Get merchant transaction numbers
 * @param merchantTransactionsResults
 * @param rollUpSlice
 * @returns {{rollUpSlice: *, numberOfTransactions: number, numberOfCustomerTransacted: number, totalPurchaseAmount: number, averagePurchaseAmount: number, minimumPurchaseAmount: number, maximumPurchaseAmount: number, numberOfAwards: {discounts: number, pools: {amount: number, quantity: number}, coupons: number}, numberOfRefundedTransactions: number, totalRefundedPurchaseAmount: number, numberOfCancelledAwards: {pools: {amount: number, quantity: number}, coupons: number}}}
 */
statisticsService.getMerchantTransactionNumbers = function (merchantTransactionsResults, rollUpSlice) {

    logger.msg('INFO', 'statisticsService', '', '', 'getMerchantTransactionNumbers', 'Get merchant transaction numbers');

    var noOfTransactions = 0, noOfCustomers = 0, totalPurchaseAmount = 0, averagePurchaseAmount = 0, minimumPurchaseAmount = 0, maximumPurchaseAmount = 0;
    var noOfCancelledTransactions = 0, totalCancelledPurchaseAmount = 0;

    //Number of customers
    var uniqueCustomerArray = lodash.intersectionBy(merchantTransactionsResults, 'md_bucket_iid');
    noOfCustomers = uniqueCustomerArray.length;

    //Filter the sale transactions
    var saleTransactionResults = lodash.filter(merchantTransactionsResults, function(txns) {
        return txns.main_txn_type === constants.XLS_TXN_TYPE_SALE || txns.main_txn_type === constants.XLS_TXN_TYPE_UPDATE;
    });

    //Filter the cancel transactions
    var cancelledTransactionResults = lodash.filter(merchantTransactionsResults, function(txns) {
        return txns.main_txn_type === constants.XLS_TXN_TYPE_CANCEL || txns.main_txn_type === constants.XLS_TXN_TYPE_REFUND;
    });

    if (saleTransactionResults.length > 0) {
        //Number of transactions
        var uniqueSaleTransactionArray = lodash.intersectionBy(saleTransactionResults, 'tc_txn_iid');
        noOfTransactions = uniqueSaleTransactionArray.length;

        //Total purchase amount (Adjusted purchase amount) from uniqueSaleTransactionArray
        totalPurchaseAmount = lodash.round(lodash.sumBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE);

        //Average purchase amount from uniqueSaleTransactionArray
        averagePurchaseAmount = lodash.round(lodash.meanBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE);

        //Minimum purchase amount from uniqueSaleTransactionArray
        var minimumPurchaseAmountTxn = lodash.minBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt');
        minimumPurchaseAmount = lodash.round(minimumPurchaseAmountTxn.adjusted_purchase_amt, constants.ROUND_UP_DECIMAL_VALUE);

        //Maximum purchase amount (Adjusted purchase amount) from uniqueSaleTransactionArray
        var maximumPurchaseAmountTxn = lodash.maxBy(uniqueSaleTransactionArray, 'adjusted_purchase_amt');
        maximumPurchaseAmount = lodash.round(maximumPurchaseAmountTxn.adjusted_purchase_amt, constants.ROUND_UP_DECIMAL_VALUE);
    }

    if (cancelledTransactionResults.length > 0) {
        //Number of cancelled transactions
        var uniqueCancelledTransactionArray = lodash.intersectionBy(cancelledTransactionResults, 'tc_txn_iid');
        noOfCancelledTransactions = uniqueCancelledTransactionArray.length;

        //Total cancelled purchase amount (Adjusted purchase amount) from uniqueCancelledTransactionArray
        totalCancelledPurchaseAmount = Math.abs(lodash.round(lodash.sumBy(uniqueCancelledTransactionArray, 'adjusted_purchase_amt'), constants.ROUND_UP_DECIMAL_VALUE));
    }

    var statsObj = {
        'rollUpSlice': rollUpSlice,
        'numberOfTransactions': noOfTransactions,
        'numberOfCustomerTransacted': noOfCustomers,
        'totalPurchaseAmount': totalPurchaseAmount,
        'averagePurchaseAmount': averagePurchaseAmount,
        'minimumPurchaseAmount': minimumPurchaseAmount,
        'maximumPurchaseAmount': maximumPurchaseAmount,
        'numberOfRefundedTransactions': noOfCancelledTransactions,
        'totalRefundedPurchaseAmount': totalCancelledPurchaseAmount
    };

    return statsObj;
};

/**
 * Recompute end date
 * @param dates
 * @param rollUpPeriodType
 * @returns {d.promise}
 */
statisticsService.reComputeEndDate = function (dates, rollUpPeriodType) {
    var d = Q.defer();
    logger.msg('INFO', 'statisticsService', '', '', 'reComputeDates', 'Recompute end date');

    var endDate = dates.endDate, reComputedEndDate;
    //Move the hard coded configurations on limits for each rollup period to config file
    // if Config values are missing then get default values from constant.
    var tenantInfo = commonUtil.getTenantInfoFromGlobal();
    var maxLimitForRollUpPeriods=tenantInfo.maxLimitForRollUpPeriods;
    if(!maxLimitForRollUpPeriods){
        maxLimitForRollUpPeriods={
            'maxLimitInDaysForPerHour': constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_DAYS_FOR_PER_HOUR,
            'maxLimitInDaysForPerDay': constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_DAYS_FOR_PER_DAY,
            'maxLimitInMonthsForPerWeek' : constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_MONTHS_FOR_PER_WEEK,
            'maxLimitInMonthsForPerMonth': constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_MONTHS_FOR_PER_MONTH,
            'maxLimitInYearsForPerQuarter' : constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_QUARTER,
            'maxLimitInYearsForPerSemester' : constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_SEMESTER,
            'maxLimitInYearsForPerYear' : constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_YEAR,
            'maxLimitInYearsForCumulative' : constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_CUMULATIVE
        };
    } else {
        if(!maxLimitForRollUpPeriods.maxLimitInDaysForPerHour){
            maxLimitForRollUpPeriods.maxLimitInDaysForPerHour=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_DAYS_FOR_PER_HOUR;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInDaysForPerDay){
            maxLimitForRollUpPeriods.maxLimitInDaysForPerDay=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_DAYS_FOR_PER_DAY;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInMonthsForPerWeek){
            maxLimitForRollUpPeriods.maxLimitInMonthsForPerWeek=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_MONTHS_FOR_PER_WEEK;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInMonthsForPerMonth){
            maxLimitForRollUpPeriods.maxLimitInMonthsForPerMonth=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_MONTHS_FOR_PER_MONTH;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInYearsForPerQuarter){
            maxLimitForRollUpPeriods.maxLimitInYearsForPerQuarter=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_QUARTER;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInYearsForPerSemester){
            maxLimitForRollUpPeriods.maxLimitInYearsForPerSemester=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_SEMESTER;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInYearsForPerYear){
            maxLimitForRollUpPeriods.maxLimitInYearsForPerYear=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_PER_YEAR;
        }
        if(!maxLimitForRollUpPeriods.maxLimitInYearsForCumulative){
            maxLimitForRollUpPeriods.maxLimitInYearsForCumulative=constants.MAX_LIMIT_FOR_ROLLUP_PERIODS.MAX_LIMIT_IN_YEARS_FOR_CUMULATIVE;
        }
    }

    switch(rollUpPeriodType) {
        case constants.ROLL_UP_PERIOD_TYPE_PER_HOUR:
            if(parseInt(maxLimitForRollUpPeriods.maxLimitInDaysForPerHour)>1){
                //Subtract 1 day from the configured day for Per Hour
                reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInDaysForPerHour), 'days').subtract(1, 'days').format('YYYYMMDD');
            } else {
                reComputedEndDate = dates.startDate;
            }
            break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_DAY: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInDaysForPerDay), 'days').subtract(1, 'days').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_WEEK: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInMonthsForPerWeek), 'months').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_MONTH: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInMonthsForPerMonth), 'months').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_QUARTER: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInYearsForPerQuarter), 'years').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_SEMESTER: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInYearsForPerSemester), 'years').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_PER_YEAR: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInYearsForPerYear), 'years').format('YYYYMMDD'); break;
        case constants.ROLL_UP_PERIOD_TYPE_CUMULATIVE: reComputedEndDate = moment(dates.startDate, 'YYYYMMDD').add(parseInt(maxLimitForRollUpPeriods.maxLimitInYearsForCumulative), 'years').format('YYYYMMDD'); break;
    }

    //If the input endDate is greater than the maximum limit, then consider the reComputedEndDate
    if (endDate > reComputedEndDate) {
        endDate = reComputedEndDate;
        logger.msg('INFO', 'statisticsService', '', '', 'reComputeDates', 'Recomputed endDate - ' + endDate);
    }
    d.resolve(endDate);

    return d.promise;
};
