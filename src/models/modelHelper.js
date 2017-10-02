'use strict';

var Q = require('q');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var commonDBUtil = require('../lib/commonDBUtil');
var DBUtil = require('../lib/dbUtil');
var fileName = 'modelHelper';
var serviceHelper = require('../services/serviceHelper');
// Load the full build.
var lodash = require('lodash');

function modelHelper() {
    return {};
}

module.exports = modelHelper;

/**
 * convert campaign db result into object
 * @param dbResult - Data retrieved from Database
 * @returns Array of Campaign object
 */
modelHelper.convertCampaignResultToObject = function(dbResult){
  logger.msg('INFO', 'campaignService', fileName, '', 'convertCampaignResultToObject', 'Processing');

    var arrayCampaigns = [];
    var cRow;

    for(var i=0; i<dbResult.length; i++){
      var c = {};
      cRow = dbResult[i];

      c.campaign_id = cRow[0];
      c.campaign_name = cRow[1];
      c.description = cRow[2];
      c.campaign_type = cRow[3];
      c.campaign_subtype = cRow[4];
      c.mono_merchant = cRow[5];
      c.available_for_vt = cRow[6];
      c.start_date = cRow[7];
      c.end_date = cRow[8];
      c.min_purchase = cRow[9];
      c.max_purchase = cRow[10];
      c.expiry_type = cRow[11];
      c.expiry_days = cRow[12];
      c.expiry_months = cRow[13];
      c.last_update_by = cRow[14];
      c.last_update_date = cRow[15];
      c.status = cRow[16];
      c.override = cRow[17];
      c.expiry_type = cRow[18];
      c.expiry_days = cRow[19];
      c.expiry_months = cRow[20];
      c.owner_type = cRow[21];
      c.owner_id = cRow[22];
      c.accepted_freq = cRow[23];
      c.mobile_message = cRow[24];
      c.referencelogo = cRow[25];
      c.pnt_partial_reset = cRow[26];
      c.pnt_cascade_cpns = cRow[27];
      c.discount_amount = cRow[28];
      c.discount_percent = cRow[29];

      arrayCampaigns.push(c);
  }

    //Sort the campaigns
    var sortedCampaigns = lodash.sortBy(arrayCampaigns, ['campaign_id']);

    return sortedCampaigns;
};

/**
 * Convert scenarios detail from db to object
 * @param dbResult - Data retrieved from Database
 * @returns Array of scenario object
 */
modelHelper.convertScenariosResultToObject = function(dbResult){
    logger.msg('INFO', 'campaignService', fileName, '', 'convertScenariosResultToObject', 'Convert scenarios result to object');

    //Overriding the jsHint error for too many statements
    /*jshint -W071 */
    var arrayScenarios = [];
    var row;

    for(var i=0; i<dbResult.length; i++){
      var s = {};
      row = dbResult[i];

      s.scenario_id = row[0];
      s.campaign_id = row[1];
      s.scenario_index = row[2];
      s.s_lower = row[3];
      s.s_upper = row[4];
      s.repeat_rwd_type = row[5];
      s.repeat_rwd_multiple = row[6];
      s.s_reset = row[7];
      s.rfm_discount_amount = row[8];
      s.rfm_discount_percent = row[9];
      s.rfm_discount_type = row[10];
      s.last_update_by = row[11];
      s.last_update_date = row[12];
      s.status = row[13];
      s.msg_line1 = row[14];
      s.bold1 = row[15];
      s.msg_line2 = row[16];
      s.bold2 = row[17];
      s.msg_line3 = row[18];
      s.bold3 = row[19];
      s.msg_line4 = row[20];
      s.bold4 = row[21];
      s.msg_line5 = row[22];
      s.bold5 = row[23];
      s.msg_line6 = row[24];
      s.bold6 = row[25];
      s.msg_line7 = row[26];
      s.bold7 = row[27];
      s.msg_line8 = row[28];
      s.bold8 = row[29];
      s.sms_message_iid = row[30];
      s.display_flag = row[31];
      s.sms_content = row[32];
      s.scenario_message_iid = row[33];

      arrayScenarios.push(s);
  }

    return arrayScenarios;
};

/**
 * Convert events result to object
 * @param dbResult
 * @returns {Array}
 */
modelHelper.convertEventsResultToObject = function(dbResult){
    logger.msg('INFO', 'campaignService', fileName, '', 'convertEventsResultToObject', 'Convert events result to object');

    //Overriding the jsHint error for too many statements
    /*jshint -W071 */
    var events = [];
    var row;

    for(var i=0; i<dbResult.length; i++) {
        var e = {};
        row = dbResult[i];

        e.campaign_id = row[0];
        e.event_cpg_day1 = row[1];
        e.event_cpg_day2 = row[2];
        e.event_cpg_day3 = row[3];
        e.event_cpg_day4 = row[4];
        e.event_cpg_day5 = row[5];
        e.event_cpg_day6 = row[6];
        e.event_cpg_day7 = row[7];
        e.event_cpg_day8 = row[8];

        events.push(e);
    }

    return events;
};

/**
 * Convert terminal details resultset from DB to an object
 * @param dbResult
 * @returns {{merchantId: number, terminalId: number, corporateId: number}}
 */
modelHelper.convertTerminalDetailsResultToObject = function(dbResult){
    logger.msg('INFO', 'campaignService', fileName, '', 'convertTerminalDetailsResultToObject', 'Convert terminal details resultset from DB to an object');

    var terminalDetails = {
        'merchant_id': dbResult[0][0],
        'corporate_id': dbResult[0][1],
        'terminal_id': dbResult[0][2]
    };

    return terminalDetails;
};

/**
 * Convert campaign transaction details resultset from DB to an object
 * @param dbResult
 * @returns {d.promise}
 */
modelHelper.convertCampaignTransactionDetailsResultToObject = function(dbResult){
    logger.msg('INFO', 'statisticsService', fileName, '', 'convertCampaignTransactionDetailsResultToObject', 'Convert campaign transaction details resultset from DB to an object');

    var d = Q.defer();
    var campaignTransactionDetails = [];
    var cRow;

    lodash.forEach(dbResult, function(value) {
        var c = {};
        cRow = value;

        c.tc_txn_iid = cRow[0];
        c.txn_date = cRow[1];
        c.md_bucket_iid = cRow[2];
        c.adjusted_purchase_amt = cRow[3];
        c.txn_type = cRow[4];
        c.entity_type = cRow[5];
        c.entity_iid = cRow[6];
        c.quantity = cRow[7];
        c.amount = cRow[8];
        c.aux_entity_type = cRow[9];
        c.aux_entity_iid = cRow[10];
        c.owner_type = cRow[11];
        c.main_txn_type = cRow[12];

        campaignTransactionDetails.push(c);
    });

    d.resolve(campaignTransactionDetails);

    return d.promise;
};

/**
 * Convert merchant transaction details resultset from DB to an object
 * @param dbResult
 * @returns {d.promise}
 */
modelHelper.convertMerchantTransactionDetailsResultToObject = function(dbResult){
    logger.msg('INFO', 'statisticsService', fileName, '', 'convertMerchantTransactionDetailsResultToObject', 'Convert merchant transaction details resultset from DB to an object');

    var d = Q.defer();
    var merchantTransactionDetails = [];
    var cRow;

    lodash.forEach(dbResult, function(value) {
        var c = {};
        cRow = value;

        c.tc_txn_iid = cRow[0];
        c.txn_date = cRow[1];
        c.md_bucket_iid = cRow[2];
        c.adjusted_purchase_amt = cRow[3];
        c.main_txn_type = cRow[4];

        merchantTransactionDetails.push(c);
    });

    d.resolve(merchantTransactionDetails);

    return d.promise;
};
