'use strict';

var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var commonUtil = require('../lib/commonUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var campaignModel = require('../models/campaignModel');
var moment = require('moment');
var util = require('util');
var Q = require('q');
var _ = require('lodash');

function serviceHelper(){
}

module.exports = serviceHelper;

//Check if campaign start date is in valid format
serviceHelper.validateStartDateFormat = function (inStartDate, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'serviceHelper', '', '', 'validateStartDateFormat', 'Check if campaign start date is in proper format');

    if (inStartDate && !moment(inStartDate, [constants.DATE_FORMAT], true).isValid()) {
        // Validation failure (startDate is not in proper format)
        logger.msg('INFO', 'serviceHelper', '', '', 'validateStartDateFormat', 'Validation error - startDate is not in proper format');
        var errorMessage = util.format(constants.MSG_INVALID_VALUE_START_DATE);
        commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'startDate', inStartDate, errorMessage)
            .then(function (errorJSON) {
                errorArray.push(errorJSON);
                d.resolve(errorArray);
            }, function(err) {
                d.reject(err);
            });
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

//Check if campaign end date is in valid format
serviceHelper.validateEndDateFormat = function (inEndDate, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'serviceHelper', '', '', 'validateEndDateFormat', 'Check if campaign end date is in proper format');

    if (inEndDate && !moment(inEndDate, [constants.DATE_FORMAT], true).isValid()) {
        // Validation failure (endDate is not in proper format)
        logger.msg('INFO', 'serviceHelper', '', '', 'validateEndDateFormat', 'Validation error - endDate is not in proper format');
        var errorMessage = util.format(constants.MSG_INVALID_VALUE_END_DATE);
        commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'endDate', inEndDate, errorMessage)
            .then(function (errorJSON) {
                errorArray.push(errorJSON);
                d.resolve(errorArray);
            }, function(err) {
                d.reject(err);
            });
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

//Check if campaign start date is less than today
serviceHelper.validateStartDateLessThanToday = function (inStartDate, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'serviceHelper', '', '', 'validateStartDateLessThanToday', 'Check if campaign start date is less than today');

    //Check if start date is less than today only if start date is in proper format
    if (inStartDate && moment(inStartDate, [constants.DATE_FORMAT], true).isValid()) {
        if (moment(inStartDate, [constants.DATE_FORMAT], true).isAfter(moment()) ||
            moment(inStartDate, [constants.DATE_FORMAT], true).isSame(moment(), 'day')) {
            d.resolve(errorArray);
        } else {
            logger.msg('INFO', 'serviceHelper', '', '', 'validateStartDateLessThanToday', 'Validation error - start date is lesser than today');
            var errorMessage = util.format(constants.MSG_START_DATE_LESS_THAN_TODAY);
            commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'startDate', inStartDate, errorMessage)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    d.resolve(errorArray);
                }, function (err) {
                    d.reject(err);
                });
        }
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

//Check if campaign end date is less than start date
serviceHelper.validateEndDateLessThanStartDate = function (campaignValidity, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'serviceHelper', '', '', 'validateEndDateLessThanStartDate', 'Check if campaign end date is less than start date');

    //Check if end date is less than start date only if end date and start date are in proper format
    if (campaignValidity && campaignValidity.endDate && moment(campaignValidity.endDate, [constants.DATE_FORMAT], true).isValid() && campaignValidity.startDate && moment(campaignValidity.startDate, [constants.DATE_FORMAT], true).isValid()) {
        if (moment(campaignValidity.endDate, [constants.DATE_FORMAT], true).isAfter(moment(campaignValidity.startDate, [constants.DATE_FORMAT], true)) ||
            moment(campaignValidity.endDate, [constants.DATE_FORMAT], true).isSame(moment(campaignValidity.startDate, [constants.DATE_FORMAT], true), 'day')) {
            d.resolve(errorArray);
        } else {
            logger.msg('INFO', 'serviceHelper', '', '', 'validateEndDateLessThanStartDate', 'Validation error - end date is lesser than start date');
            var errorMessage = util.format(constants.MSG_END_DATE_LESS_THAN_START_DATE);
            commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'endDate', campaignValidity.endDate, errorMessage)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    d.resolve(errorArray);
                }, function (err) {
                    d.reject(err);
                });
        }
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

/**
 * Convert scenario repeatReward from DB to defined string
 * @param inType
 * @returns {string}
 */
serviceHelper.convertScenarioRepeatRewardType = function(inType){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertScenarioRepeatRewardType',
      'Convert scenario repeatReward from DB to defined string '+inType);
  var str = '';

  switch(parseInt(inType)){
      case constants.DB_REPEAT_REWARD_TYPE_EVERY_TRANSACTION: str = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION; break;
      case constants.DB_REPEAT_REWARD_TYPE_ONCE_ONLY: str = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_ONLY_ONCE; break;
  }

  return str;
};

/**
 * Convert Campaign Active Status from DB to defined string
 * @param inStatus - active status in DB
 * @returns string defined for status
 */
serviceHelper.convertCampaignActiveStatus = function(inStatus){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertCampaignActiveStatus', 'Convert Campaign Active Status from DB to defined string');
  var str = '';

  switch(inStatus){
        case constants.DB_STATUS_ACTIVE: str = constants.STATUS_ACTIVE; break;
        case constants.DB_STATUS_INACTIVE: str = constants.STATUS_INACTIVE; break;
        case constants.DB_STATUS_EXPIRED: str = constants.STATUS_EXPIRED; break;
        case constants.DB_STATUS_DELETED: str = constants.STATUS_DELETED; break;
  }

  return str;
};

/**
 * Convert scenario reset from DB to defined string
 * @param inReset - Scenario Reset in DB
 * @returns string defined for scenario Reset
 */
serviceHelper.convertScenarioReset = function(inReset){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertScenarioReset', 'Convert scenario reset from DB to defined string');
  var str = '';

  switch(inReset){
    case constants.DB_SCENARIO_RESET_NONE: str = constants.COUNTER_RESET_TYPE_NONE; break;
    case constants.DB_SCENARIO_RESET_PARTIAL: str = constants.COUNTER_RESET_TYPE_PARTIAL; break;
    case constants.DB_SCENARIO_RESET_TOTAL: str = constants.COUNTER_RESET_TYPE_TOTAL; break;
  }

  return str;
};

/**
 * Convert Award value method from DB to string
 * @param inType - type of Award method in DB
 * @returns string defined for award value method
 */
serviceHelper.convertAwardValueType = function(inType){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertAwardValueType', 'Convert Award value method from DB to string');
  var str = '';

  switch(inType){
    case constants.DB_DISCOUNT_TYPE_FIXED_AMOUNT: str = constants.DISCOUNT_TYPE_FIXED_AMOUNT; break;
    case constants.DB_DISCOUNT_TYPE_PERCENTAGE: str = constants.DISCOUNT_TYPE_PERCENTAGE; break;
  }

  return str;
};

/**
 * Convert Campaign Type from DB to defined string
 * @param inType - type of campaign Type in DB
 * @returns string defined for Campaign Type
 */
serviceHelper.convertCampaignTypeForResponse = function(inType){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertCampaignTypeForResponse', 'Convert Campaign Type from DB to defined string');
  var type = '';

  switch(inType){
    case constants.DB_CAMPAIGN_TYPE_AMOUNT: type = constants.DRIVER_TYPE_AMOUNT; break;
    case constants.DB_CAMPAIGN_TYPE_FREQUENCY: type = constants.DRIVER_TYPE_FREQUENCY; break;
      case constants.DB_CAMPAIGN_TYPE_EVENT: type = constants.DRIVER_TYPE_EVENT_DAY; break;
  }

  return type;
};

/**
 * Convert Campaign Sub Type from DB to defined string
 * @param inSubType - sub type of campaign in DB
 * @returns string defined for campaign sub type
 */
serviceHelper.convertCampaignSubTypeForResponse = function(inSubType){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertCampaignSubTypeForResponse', 'Convert Campaign Sub Type from DB to defined string');
    var subtype = '';

    switch(inSubType){
       case constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT: subtype = constants.BENEFIT_TYPE_DISCOUNT; break;
    }

    return subtype;
 };

/**
 * Construct Date and Time based on format parameter
 * @param inDate - date in ISO format
 * @param inFormat - display format
 * @returns string of date and time based on inFormat
 */
serviceHelper.constructDateByFormat = function(inDate, inFormat){
    logger.msg('INFO', 'serviceHelper', '', '', 'constructDateByFormat', 'Construct Date and Time based on format parameter');

    try {
        // Construct Date and Time based on format parameter
        return moment(inDate).format(inFormat);
    } catch (err) {
        return err;
    }
};

/**
 * Convert Merchant Type from DB to defined string
 * @param inMerchantCampaignType - type of merchant campaign in DB
 * @returns string defined for merchant campaign type
 */
 serviceHelper.convertMerchantCampaignTypeForResponse = function(inMerchantCampaignType){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertMerchantCampaignTypeForResponse', 'Convert Merchant Type from DB to defined string');
     var type;
     switch(inMerchantCampaignType){
        case 0: type = true; break;
        case 1: type = false; break;
     }

     return type;
  };

/**
 * Convert Override Counter from DB to defined string
 * @param inCounterConfiguration - type of override counter in DB
 * @returns string defined for override counter
 */
  serviceHelper.convertCounterConfiguration = function(inCounterConfiguration){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertCounterConfiguration', 'Convert Override Counter from DB to defined string');
     var str = '';
     switch(inCounterConfiguration){
        case constants.DB_OVERRIDE_NO_OVERRIDE: str = constants.COUNTER_OVERRIDE_TYPE_NO_OVERRIDE; break;
        case constants.DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_HIGHER: str = constants.COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_HIGHER; break;
        case constants.DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_LOWER: str = constants.COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_LOWER; break;
     }

     return str;
  };

/**
 * Convert Merchant Host and Virtual Terminal from DB to defined string
 * @param inHostVirtualTerminal - host and virtual Terminal status in DB
 * @returns boolean value based on inHostVirtualTerminal
 */
serviceHelper.convertMerchantHostAndVirtualTerminalForResponse = function(inHostVirtualTerminal){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertMerchantHostAndVirtualTerminalForResponse', 'Convert Merchant Host and Virtual Terminal from DB to defined string');
    var isVirtual = false;

    if(inHostVirtualTerminal === 1) {
      isVirtual = true;
    }

    return isVirtual;
  };

/**
 * Convert Owner Type from DB to defined string
 * @param ownerType - type of owner in DB
 * @returns string defined for owner type
 */
serviceHelper.convertOwnerTypeForResponse = function(ownerType){
    logger.msg('INFO', 'campaignService', '', '', 'convertOwnerTypeForResponse', 'Convert Owner Type from DB to defined string');
    var type = '';
    switch(ownerType){
        case constants.DB_OWNERTYPE_CORPORTATE: type = constants.OWNER_TYPE_CORPORATE; break;
        case constants.DB_OWNERTYPE_MERCHANT: type = constants.OWNER_TYPE_MERCHANT; break;
        case constants.DB_OWNERTYPE_PROGRAM_MANAGER: type = constants.OWNER_TYPE_PROGRAM_MANAGER; break;
    }

    return type;
};

/**
 * convert accepted frequency from DB to defined String
 * @param inAcceptedFrequency - accepted frequency in DB
 * @returns string defined for accepted frequency: "once per day" etc
 */
serviceHelper.convertCampaignAcceptedFrequency = function(inAcceptedFrequency){
    logger.msg('INFO', 'campaignService', '', '', 'convertCampaignAcceptedFrequency', 'convert accepted frequency from DB to defined String =' + inAcceptedFrequency);
    var str = '';
    switch(parseInt(inAcceptedFrequency)){
        case constants.DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION:
            str = constants.TRIGGER_FREQUENCY_EVERY_TRANSACTION;
            break;
        case constants.DB_ACCEPTED_FREQUENCY_ONCE_PER_DAY:
            str = constants.TRIGGER_FREQUENCY_ONCE_PER_DAY;
            break;
    }

    return str;
};

/**
 * validate ownerType in query request string
 * @param inOwnerType - owner type in query
 * @param inErrorArray - accumulated error array to add if there is any error in this process
 * @returns error array
 */
serviceHelper.validateRequestQuery_ownerType = function(inOwnerType, inErrorArray){
    logger.msg('INFO', 'campaignService', '', '', 'validateRequestQuery_ownerType', 'validate ownerType query');
    var d = Q.defer();

    var ownerType = inOwnerType;
    ownerType = ownerType ? ownerType.trim() : ownerType; //Do not trim if ownerType is undefined

    if(ownerType){

        if((ownerType !== constants.OWNER_TYPE_CORPORATE) && (ownerType !== constants.OWNER_TYPE_MERCHANT) &&
            (ownerType !== constants.OWNER_TYPE_PROGRAM_MANAGER)){

            logger.msg('INFO', 'campaignService', '', '', 'validateRequestQuery_ownerType', 'Invalid OwnerType');

            var errorMessage = util.format(constants.MSG_INVALID_OWNER_TYPE);
            commonUtil.constructErrorJSONStructure(constants.INVALID_QUERY_VALUE, 'ownerType', ownerType, errorMessage)
                .then(function (errorJSON) {
                    inErrorArray.push(errorJSON);
                    d.resolve(inErrorArray);
                }, function(err) {
                    d.reject(err);
                });
        } else {
            d.resolve(inErrorArray);
        }
    }
    else {
        d.resolve(inErrorArray);
    }

    return d.promise;
};

/**
 * validate status in query request string
 * @param inStatus - status in query
 * @param inErrorArray - accumulated error array to add if there is any error in this process
 * @returns error array
 */
serviceHelper.validateRequestQuery_status = function(inStatus, inErrorArray){
    logger.msg('INFO', 'campaignService', '', '', 'validateRequestQuery_status', 'validate status query');
    var d = Q.defer();

    var status = inStatus;
    status = status ? status.trim() : status; //Do not trim if ownerType is undefined

    if(status){

        if((status !== constants.STATUS_ACTIVE) && (status !== constants.STATUS_INACTIVE) &&
            (status !== constants.STATUS_DELETED) && (status !== constants.STATUS_ALL)){

            logger.msg('INFO', 'campaignService', '', '', 'validateRequestQuery_status', 'Invalid status');

            var errorMessage = util.format(constants.MSG_INVALID_STATUS);
            commonUtil.constructErrorJSONStructure(constants.INVALID_QUERY_VALUE, 'status', status, errorMessage)
                .then(function (errorJSON) {
                    inErrorArray.push(errorJSON);
                    d.resolve(inErrorArray);
                }, function(err) {
                    d.reject(err);
                });
        } else {
            d.resolve(inErrorArray);
        }
    }
    else {
        d.resolve(inErrorArray);
    }

    return d.promise;
};

/**
 * convert ownerType input string into db value
 * @param inOwnerTypeString
 * @returns db value of owner type: 0: system
 *                                  1: merchant
 *                                  2: corporate
 */
serviceHelper.convertOwnerTypeStringToDbValue = function(inOwnerTypeString){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertOwnerTypeStringToDbValue', 'convert ownerType input string into db value, input='+inOwnerTypeString);

    var ownerTypeValue = constants.STR_ALL;

    switch(inOwnerTypeString){
        case constants.OWNER_TYPE_CORPORATE: ownerTypeValue = constants.DB_OWNERTYPE_CORPORTATE; break;
        case constants.OWNER_TYPE_MERCHANT: ownerTypeValue = constants.DB_OWNERTYPE_MERCHANT; break;
        case constants.OWNER_TYPE_PROGRAM_MANAGER: ownerTypeValue = constants.DB_OWNERTYPE_PROGRAM_MANAGER; break;
    }

    return ownerTypeValue;
};

/**
 * convert status input string into db value
 * @param inStatus
 * @returns db value of status: E0: Active
 *                              E1: Inacive
 *                              E2: Deleted
 */
serviceHelper.convertStatusStringToDbValue = function(inStatus){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertStatusStringToDbValue', 'convert status input string into db value, input='+inStatus);

    var statusValue = '';

    switch(inStatus){
        case constants.STATUS_ACTIVE: statusValue = constants.DB_STATUS_ACTIVE; break;
        case constants.STATUS_INACTIVE: statusValue = constants.DB_STATUS_INACTIVE; break;
        case constants.STATUS_EXPIRED: statusValue = constants.DB_STATUS_EXPIRED; break;
        case constants.STATUS_DELETED: statusValue = constants.DB_STATUS_DELETED; break;
        default: statusValue = constants.STATUS_ALL;
    }

    return statusValue;
};

/**
 * Construct individual message for response
 * @param inLineNumber - index number of message
 * @param inLineMessage - message string
 * @param inLineAttribute - attribute bold or normal
 * @returns message object
 */
serviceHelper.constructMessageResponse = function(inLineNumber, inLineMessage, inLineAttribute){

    logger.msg('INFO', 'serviceHelper', '', '', 'constructMessageResponse', 'Construct individual message for response');

    var m = {};
    m.lineNumber = inLineNumber;
    m.message = inLineMessage ? inLineMessage : '';
    m.isMessagePrintedInBold = (inLineAttribute === 0) ? false : true;

    return m;
};

/**
 * Convert DriverType string to db value
 * @param inDriverType - driver type in string
 * @returns db value of driver type
 */
serviceHelper.convertDriverTypeToDbValue = function(inDriverType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertDriverTypeToDbValue', 'Convert DriverType string to db value');

    var str = constants.STR_ALL;

    switch(inDriverType){
        case constants.DRIVER_TYPE_AMOUNT: str = constants.DB_CAMPAIGN_TYPE_AMOUNT; break;
        case constants.DRIVER_TYPE_FREQUENCY: str = constants.DB_CAMPAIGN_TYPE_FREQUENCY; break;
        case constants.DRIVER_TYPE_EVENT_DAY: str = constants.DB_CAMPAIGN_TYPE_EVENT; break;
        // TODO: other DriverType
    }

    return str;
};

/**
 * Convert BenefitType string to db value
 * @param inBenefitType - benefit type in string
 * @returns db value of benefit type
 */
serviceHelper.convertBenefitTypeToDBvalue = function(inBenefitType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertBenefitTypeToDBvalue', 'Convert BenefitType string to db value');

    var str = '';

    switch(inBenefitType){
        case constants.BENEFIT_TYPE_DISCOUNT: str = constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT; break;
        // case constants.BENEFIT_TYPE_AWARD: str = ''; break;
        // case constants.BENEFIT_TYPE_MULTIPLIER: str = ''; break;
    }

    return str;
};

/**
 * Convert TriggerFrequencyType string to db value
 * @param inTriggerFrequencyType - trigger frequency type in string
 * @returns db value of trigger benefit type
 */
serviceHelper.convertTriggerFrequencyTypeToDBvalue = function(inTriggerFrequencyType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertTriggerFrequencyTypeToDBvalue', 'Convert TriggerFrequencyType string to db value');

    var value = constants.DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION; //Default value

    switch(inTriggerFrequencyType){
        case constants.TRIGGER_FREQUENCY_EVERY_TRANSACTION: value = constants.DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION; break;
        case constants.TRIGGER_FREQUENCY_ONCE_PER_DAY: value = constants.DB_ACCEPTED_FREQUENCY_ONCE_PER_DAY; break;
    }

    return value;
};

/**
 * Convert Multi-merchant subscribe string to db value
 * @param inIsSubscribableToServeralMerchants - true or false
 * @returns db value of Multi-Merchant subscribe
 */
serviceHelper.convertIsSubscribableToSeverarMerchant = function(inIsSubscribableToServeralMerchants){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsSubscribableToSeverarMerchant', 'Convert Multi-merchant subscribe string to db value');

    var value = constants.DB_MERCHANT_MONO_MERCHANT; //Default value

    switch(inIsSubscribableToServeralMerchants) {
        case true: value = constants.DB_MERCHANT_MULTI_MERCHANT; break;
        case false: value = constants.DB_MERCHANT_MONO_MERCHANT; break;
    }

    return value;
};

/**
 * Convert Campaign Counter Reset Type from DB to defined string
 * @param inType - type of counter reset in DB
 * @returns string defined for Counter Reset Type
 */
serviceHelper.convertCampaignCounterResetType = function(inType){
  logger.msg('INFO', 'serviceHelper', '', '', 'convertCampaignCounterResetType', 'Convert Campaign Counter Reset Type from DB to defined string');
  var str = '';

  switch(inType){
    case constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY: str = constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY; break;
    case constants.DB_EXPIRY_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION: str = constants.COUNTER_RESET_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION; break;
    case constants.DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE: str = constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE; break;
    case constants.DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE: str = constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE; break;
    case constants.DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE: str = constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE; break;
    case constants.DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE: str = constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE; break;
  }

  return str;
};


/**
 * Convert campaign counter reset type to db value
 * @param inCounterResetType - counter reset type in string
 * @returns db value of counter reset type
 */
serviceHelper.convertCampaignCounterResetTypeToDBvalue = function(inCounterResetType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertCampaignCounterResetTypeToDBvalue', 'Convert campaign counter reset type to db value');

    var value = constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY; //Default value

    switch(inCounterResetType){
        case constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY: value = constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY; break;
        case constants.COUNTER_RESET_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION: value = constants.DB_EXPIRY_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION; break;
        case constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE: value = constants.DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE; break;
        case constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE: value = constants.DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE; break;
        case constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE: value = constants.DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE; break;
        case constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE: value = constants.DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE; break;
    }

    return value;
};


/**
 * Get scenario counter reset type by driver type
 * @param inDriverType - driver type
 * @param inDriverAndBenefitsDetails - driverAndBenefitsDetails json
 * @returns value of the counter reset type if found. empty string if not found
 */
serviceHelper.getCounterResetTypeByDriverType = function(inDriverType, inDriverAndBenefitsDetails){

    logger.msg('INFO', 'serviceHelper', '', '', 'getCounterResetTypeByDriverType', 'Get scenario counter reset type by driver type');

    var str = '';

    switch(inDriverType) {
        case constants.DRIVER_TYPE_AMOUNT:
            str = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'amountDriverAndBenefitsDetails.counterResetDetails.counterResetType');
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            str = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'frequencyDriverAndBenefitsDetails.counterResetDetails.counterResetType');
            break;
        // TODO: other type of driver
    }

    if(!str) {
        str = '';
    }

    return str;
};

/**
 * Get scenario number of reset month by driver type
 * @param inDriverType - driver type
 * @param inDriverAndBenefitsDetails - riverAndBenefitsDetails json
 * @returns number of month if found. 0 if not found
 */
serviceHelper.getNumberOfMonthOfCounterResetTypeByDriverType = function(inDriverType, inDriverAndBenefitsDetails){

    logger.msg('INFO', 'serviceHelper', '', '', 'getNumberOfMonthOfCounterResetTypeByDriverType', 'Get scenario number of reset month');

    var value = 0;

    switch(inDriverType){
        case constants.DRIVER_TYPE_AMOUNT:
            value = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'amountDriverAndBenefitsDetails.counterResetDetails.noOfMonthsFromTransactionDateToResetCounter');
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            value = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'frequencyDriverAndBenefitsDetails.counterResetDetails.noOfMonthsFromTransactionDateToResetCounter');
            break;
        // TODO: other type of driver
    }

    // if don't exist, set to 0
    if(!value){
        value = 0;
    }

    return value;
};

/**
 * Get scenario counter override by driver type
 * @param inDriverType - driver type
 * @param inDriverAndBenefitsDetails - riverAndBenefitsDetails json
 * @returns counter override type if found. Empty string if not found
 */
serviceHelper.getCounterOverrideTypeByDriverType = function(inDriverType, inDriverAndBenefitsDetails){

    logger.msg('INFO', 'serviceHelper', '', '', 'getCounterOverrideTypeByDriverType', 'Get scenario number of reset month');

    var str = '';

    switch(inDriverType){
        case constants.DRIVER_TYPE_AMOUNT:
            str = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'amountDriverAndBenefitsDetails.counterOverrideType');
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            str = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'frequencyDriverAndBenefitsDetails.counterOverrideType');
            break;
        // TODO; other dricer type
    }

    // if driverAndBenefitsDetails finds the corresponding module
    if(!str){
        str = '';
    }

    return str;
};

/**
 * Get scenario reset number of days by driver type
 * @param inDriverType - driver type
 * @param inDriverAndBenefitsDetails - riverAndBenefitsDetails json
 * @returns number of days if found. 0 if not found.
 */
serviceHelper.getNumberOfDayOfCounterResetTypeByDriverType = function(inDriverType, inDriverAndBenefitsDetails){

    logger.msg('INFO', 'serviceHelper', '', '', 'getNumberOfDayOfCounterResetTypeByDriverType', 'Get scenario reset number of days by driver type');

    var value = 0;

    switch(inDriverType){
        case constants.DRIVER_TYPE_AMOUNT:
            value = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'amountDriverAndBenefitsDetails.counterResetDetails.noOfDaysFromTransactionDateToResetCounter');
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            value = commonUtil.getNestedPropertyValue(inDriverAndBenefitsDetails, 'frequencyDriverAndBenefitsDetails.counterResetDetails.noOfDaysFromTransactionDateToResetCounter');
            break;
        // TODO: other type of driver
    }

    if(!value){
        value = 0;
    }

    return value;
};


/**
 * Convert counter override type to db value
 * @param inCounterOverrideType - counter override type in string
 * @returns db value of counter override
 */
serviceHelper.convertCounterOverrideTypeToDBvalue = function(inCounterOverrideType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertCounterOverrideTypeToDBvalue', 'Convert counter override type to db value');

    var value = constants.DB_OVERRIDE_NO_OVERRIDE;

    switch(inCounterOverrideType){
        case constants.COUNTER_OVERRIDE_TYPE_NO_OVERRIDE: value = constants.DB_OVERRIDE_NO_OVERRIDE; break;
        case constants.COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_HIGHER: value = constants.DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_HIGHER; break;
        case constants.COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_LOWER: value = constants.DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_LOWER; break;
    }

    return value;
};

/**
 * Convert ownertype string to db value
 * @param inOwnerType - ownerType in string
 * @returns db value of ownerType
 */
serviceHelper.convertOwnerTypeToDBvalue = function(inOwnerType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertOwnerTypeToDBvalue', 'Convert ownertype string to db value');

    var value = '';

    switch(inOwnerType){
        case constants.OWNER_TYPE_CORPORATE: value = constants.DB_OWNERTYPE_CORPORTATE; break;
        case constants.OWNER_TYPE_MERCHANT: value = constants.DB_OWNERTYPE_MERCHANT; break;
        case constants.OWNER_TYPE_PROGRAM_MANAGER: value = constants.DB_OWNERTYPE_PROGRAM_MANAGER; break;
    }

    return value;
};

/**
 * Get scenario range lower value based on driver type
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns lower value of scenario range. empty string if not found.
 */
serviceHelper.getScenarioRangeLower = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioRangeLower', 'Get scenario range lower value based on driver type');

    var value = '';

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].purchaseAmountSlab.lower){

                value = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].purchaseAmountSlab.lower;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].visitSlab.lower){

                value = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].visitSlab.lower;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            value = 0;
            break;
        // TODO: other type of driver
    }

    return value;
};

/**
 * Get scenario range upper value based on driver type
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns Upper value of scenario range. empty string if not found.
 */
serviceHelper.getScenarioRangeUpper = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioRangeUpper', 'Get scenario range lower value based on driver type');

    var value = '';

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].purchaseAmountSlab.upper){

                value = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].purchaseAmountSlab.upper;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].visitSlab.upper){

                value = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].visitSlab.upper;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            value = 0;
            break;
        // TODO: other type of driver
    }

    return value;
};

/**
 * Get benefitTriggerFrequencyType based on the driverType
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns benefitTriggerFrequencyType in string if found. Empty String if not found.
 */
serviceHelper.getBenefitTriggerFrequencyType = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioRangeLower', 'Get scenario range lower value based on driver type');

    var str = '';

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.benefitTriggerFrequencyType){

                str = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.benefitTriggerFrequencyType;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.benefitTriggerFrequencyType){

                str = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.benefitTriggerFrequencyType;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            str = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION;
            break;
        // TODO: other type of driver
    }

    return str;
};

/**
 * convert scenario benefitTriggerType to db value
 * @param inScenarioBenefitType - benefitTriggerType in string
 * @returns db value of benefitTriggerType
 */
serviceHelper.convertScenarioBenefitTriggerTypeToDBvalue = function(inScenarioBenefitType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertScenarioBenefitTriggerTypeToDBvalue',
        'convert scenario benefitTriggerType to db value '+inScenarioBenefitType);

    var value = '';

    switch(inScenarioBenefitType){
        case constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION: value = constants.DB_REPEAT_REWARD_TYPE_EVERY_TRANSACTION; break;
        case constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_ONLY_ONCE: value = constants.DB_REPEAT_REWARD_TYPE_ONCE_ONLY; break;
    }

    return value;
};

/**
 * Get isMultipleScenarioTriggerAllowed based on driverType
 * @param inCampaignObj - the entire request json
 * @returns true or false if found. undefined if not found.
 */
serviceHelper.getIsMultipleScenarioTriggerAllowed = function(inCampaignObj){

    logger.msg('INFO', 'serviceHelper', '', '', 'getIsMultipleScenarioTriggerAllowed', 'Get isMultipleScenarioTriggerAllowed based on driverType');

    var bool = commonUtil.getNestedPropertyValue(inCampaignObj, 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isMultipleScenarioTriggerAllowed');

    if(!bool){
        bool = false;
    }
    return bool;
};

/**
 * Convert IsMultipleScenarioTriggerAllowed to db value
 * @param inIsMultipleScenarioTriggerAllowed - true/false
 * @returns db value of multi scenario repeat reward
 */
serviceHelper.convertIsMultipleScenarioTriggerAllowedToDBvalue = function(inIsMultipleScenarioTriggerAllowed){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsMultipleScenarioTriggerAllowedToDBvalue', 'Convert IsMultipleScenarioTriggerAllowed to db value');

    var value = constants.DB_REPEAT_REWARD_MULTIPLE_FALSE;

    switch(inIsMultipleScenarioTriggerAllowed){
        case true: value = constants.DB_REPEAT_REWARD_MULTIPLE_TRUE; break;
        case false: value = constants.DB_REPEAT_REWARD_MULTIPLE_FALSE; break;
    }

    return value;
};

/**
 * Get CounterResetType based on driverType
 * @param inCampaignObj  - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns Counter Reset Type string if found. Empty string if not found
 */
serviceHelper.getCounterResetType = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getCounterResetType', 'Get CounterResetType based on driverType');

    var str = '';

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].counterResetType){

                str = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].counterResetType;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].counterResetType){

                str = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].counterResetType;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            str = 0; //None
            break;
        // TODO: other type of driver
    }

    return str;
};

/**
 * Convert CounterResetType string to db value
 * @param inCounterResetType - counter reset type
 * @returns db value of counter reset type. constants.DB_SCENARIO_RESET_NONE if not found
 */
serviceHelper.convertCounterResetTypeToDBvalue = function(inCounterResetType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertCounterResetTypeToDBvalue', 'Convert CounterResetType string to db value');

    var value = constants.DB_SCENARIO_RESET_NONE;

    switch(inCounterResetType){
        case constants.COUNTER_RESET_TYPE_NONE: value = constants.DB_SCENARIO_RESET_NONE; break;
        case constants.COUNTER_RESET_TYPE_PARTIAL: value = constants.DB_SCENARIO_RESET_PARTIAL; break;
        case constants.COUNTER_RESET_TYPE_TOTAL: value = constants.DB_SCENARIO_RESET_TOTAL; break;
    }

    return value;
};

/**
 * Get scenario discount type based on driverType and BenefitType
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns scenario Discount Type in string if found. Empty string if not found.
 */
serviceHelper.getScenarioDiscountType = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioDiscountType', 'Convert CounterResetType string to db value');

    var str = '';
    var base;

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){
                base = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){
                base = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            str = ''; //Not applicable
            break;
        // TODO: other type of driver
    }

    if(base){
        switch(inCampaignObj.benefitType){
            case constants.BENEFIT_TYPE_DISCOUNT:
                if(base.discountType){
                    str = base.discountType;
                }
                break;
            // TODO; other type
        }
    }

    return str;
};

/**
 * Convert discountType to db value
 * @param inDiscountType - discount type in string
 * @returns db value of discount type
 */
serviceHelper.convertDiscountTypeToDBvalue = function(inDiscountType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertDiscountTypeToDBvalue', 'Convert discountType to db value');

    var value = '';

    switch(inDiscountType){
        case constants.DISCOUNT_TYPE_FIXED_AMOUNT : value = constants.DB_DISCOUNT_TYPE_FIXED_AMOUNT; break;
        case constants.DISCOUNT_TYPE_PERCENTAGE : value = constants.DB_DISCOUNT_TYPE_PERCENTAGE; break;
    }

    return value;
};

/**
 * Get scenario FixedAmount based on driverType and benefitType
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns value of FixedAmount if found. 0 if not found
 */
serviceHelper.getScenarioFixedAmount = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioFixedAmount', 'Get scenario FixedAmount based on driverType and benefitType');

    var value = 0;
    var base;

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){

                base = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){

                base = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            value = ''; //Not applicable
            break;
        // TODO: other type of driver
    }

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioFixedAmount', 'base0=' + JSON.stringify(inCampaignObj.driverAndBenefitsDetails));

    if(base){
        switch(inCampaignObj.benefitType){
            case constants.BENEFIT_TYPE_DISCOUNT: value = base.discountFixedAmount; break;
            // TODO; other type
        }
    }

    return value;
};

/**
 * Get scenario percentage value based on driverType and benefitType
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns value of Percentage if found. 0 if not found
 */
serviceHelper.getScenarioPercentage = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioPercentage', 'Get scenario percentage value based on driverType and benefitType');

    var value = 0;
    var base;

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){

                base = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails){

                base = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].benefitDetails.discountBenefitDetails;
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            value = ''; //Not applicable
            break;
        // TODO: other type of driver
    }

    if(base){
        switch(inCampaignObj.benefitType){
            case constants.BENEFIT_TYPE_DISCOUNT: value = base.discountPercentage; break;
            // TODO; other type
        }
    }

    return value;
};

/**
 * Get scenario Receipt message based on driverType and benefitType
 * @param inCampaignObj - the entire request json
 * @param inScenarioIndex - scenario index [ 1 - 4 ]
 * @returns Array of Receipt message if found. Empty array if not found.
 */
serviceHelper.getScenarioReceiptMessage = function(inCampaignObj, inScenarioIndex){

    logger.msg('INFO', 'serviceHelper', '', '', 'getScenarioReceiptMessage', 'Get scenario Receipt message based on driverType and benefitType');

    var msg = {
        'messages': '',
        'smsMessage': ''
    };
    var receiptMessages = [];
    var m = {};
    var scenarioMessageDetails, baseReceipt, baseSMS;

    switch(inCampaignObj.driverType){
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails){

                scenarioMessageDetails = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails;
                if (scenarioMessageDetails && scenarioMessageDetails.receiptMessageDetails) {
                    baseReceipt = scenarioMessageDetails.receiptMessageDetails;
                }
                if (scenarioMessageDetails && scenarioMessageDetails.smsMessage) {
                    baseSMS = scenarioMessageDetails.smsMessage;
                }
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails){

                scenarioMessageDetails = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails;
                if (scenarioMessageDetails && scenarioMessageDetails.receiptMessageDetails) {
                    baseReceipt = scenarioMessageDetails.receiptMessageDetails;
                }
                if (scenarioMessageDetails && scenarioMessageDetails.smsMessage) {
                    baseSMS = scenarioMessageDetails.smsMessage;
                }
            }
            break;
        case constants.DRIVER_TYPE_EVENT_DAY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails){

                scenarioMessageDetails = inCampaignObj.driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails;
                if (scenarioMessageDetails && scenarioMessageDetails.receiptMessageDetails) {
                    baseReceipt = scenarioMessageDetails.receiptMessageDetails;
                }
                if (scenarioMessageDetails && scenarioMessageDetails.smsMessage) {
                    baseSMS = scenarioMessageDetails.smsMessage;
                }
            }
            break;
        // TODO: other type of driver
    }

    if(!baseReceipt && !baseSMS){
        msg.messages = receiptMessages;
        msg.smsMessage = '';
        return msg;
    }

    if(baseReceipt && baseReceipt.receiptMessages){

        for(var j=0; j<8; j++){
            m = {};
            m.message = '';
            m.bold = constants.DB_MESSAGE_ATTRIBUTE_NORMAL;
            receiptMessages.push(m);
        }

        for(var i=0; i<baseReceipt.receiptMessages.length; i++){
            if(baseReceipt.receiptMessages[i] && baseReceipt.receiptMessages[i].message){
                receiptMessages[i].message = baseReceipt.receiptMessages[i].message;
            }

            if(baseReceipt.receiptMessages[i] &&
                baseReceipt.receiptMessages[i].isMessagePrintedInBold &&
                (baseReceipt.receiptMessages[i].isMessagePrintedInBold === true)){
                receiptMessages[i].bold = constants.DB_MESSAGE_ATTRIBUTE_BOLD;
            }
        }
        msg.messages = receiptMessages;
    }
    if (baseSMS){
        msg.smsMessage = baseSMS.substring(0, 160); //DB allows only 160 characters
    }

    return msg;
};

/**
 * Validate owner type and owner Id
 * @param ownerType
 * @param ownerId
 * @param errorArray
 * @returns {d.promise}
 */
serviceHelper.validateOwnerType = function (ownerType, ownerId, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'serviceHelper', '', '', 'validateOwnerType', 'Validate owner type and owner Id');
    //Check if merchant Id exists in the DB when owner type is Merchant
    if (ownerType && ownerType === constants.OWNER_TYPE_MERCHANT) {
        if (!ownerId) {
            //If ownerId is missing
            logger.msg('INFO', 'serviceHelper', '', '', 'validateOwnerType', 'Validation error - Owner Id is missing');
            var errorMessage = util.format(constants.MSG_MISSING_VALUE, constants.OWNER_ID);
            commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'ownerId', '', errorMessage)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    d.resolve(errorArray);
                }, function (err) {
                    d.reject(err);
                });
        } else {
            //If ownerId is not a valid merchantId
            campaignModel.checkMerchantIdExists(ownerId)
                .then(function (merchantExistsCount) {
                    if (parseInt(merchantExistsCount) === 0) {
                        logger.msg('INFO', 'serviceHelper', '', '', 'validateOwnerType', 'Validation error - Owner Id is not a valid merchant Id');
                        var errorMessage = util.format(constants.MSG_INVALID_OWNER_ID);
                        commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'ownerId', ownerId, errorMessage)
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
        }
    } else {
        d.resolve(errorArray);
    }
    return d.promise;
};

/**
 * Convert isSubscribableToHostAndVirtualTerminals to db value
 * @param inVirtualTerminal - virtual terminal in true or false
 * @returns db value of virtual terminal
 */
serviceHelper.convertIsSubscribableToHostAndVirtualTerminalsToDBvalue = function(inVirtualTerminal){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsSubscribableToHostAndVirtualTerminalsToDBvalue', 'Convert isSubscribableToHostAndVirtualTerminals to db value='+inVirtualTerminal);

    var value = constants.DB_AVAILABLE_FOR_VT_FALSE;

    switch (inVirtualTerminal){
      case false: value = constants.DB_AVAILABLE_FOR_VT_FALSE; break;
      case true: value = constants.DB_AVAILABLE_FOR_VT_TRUE; break;
    }

    return value;
};


/**
 * Convert awardtriggeredAgain db value to boolean
 * @param inAwardTriggeredAgainAfterCounterReset
 * @returns true = enable, false = disable
 */
serviceHelper.convertIsAwardTriggeredAgainAfterCounterReset = function(inAwardTriggeredAgainAfterCounterReset){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsAwardTriggeredAgainAfterCounterReset', 'Convert awardtriggeredAgain db value to boolean');

    var value = false;

    switch (inAwardTriggeredAgainAfterCounterReset){
        case constants.DB_PNT_PARTIAL_RESET_ENABLE: value = true; break;
        case constants.DB_PNT_PARTIAL_RESET_DISABLE: value = false; break;
    }

    return value;
};

/**
 * Convert CascadeAwardTriggered db value to boolean
 * @param inCascadedAwardTriggered
 * @returns true = enable, false = disable
 */
serviceHelper.convertIsCascadedAwardTriggered = function(inCascadedAwardTriggered){
    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsCascadedAwardTriggered', 'Convert CascadeAwardTriggered db value to boolean ');

    var value = false;

    switch (inCascadedAwardTriggered){
        case constants.DB_PNT_CASCADE_CPNS_ENABLE: value = true; break;
        case constants.DB_PNT_CASCADE_CPNS_DISABLE: value = false; break;
    }

    return value;
};

/**
 * Convert AwardTriggeredAgainAfterCounterReset into DB value
 * @param inAwardTriggeredAgainAfterCounterReset
 * @returns db value of AwardTriggeredAgainAfterCounterReset
 */
serviceHelper.convertIsAwardTriggeredAgainAfterCounterResetToDBvalue = function(inAwardTriggeredAgainAfterCounterReset){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsAwardTriggeredAgainAfterCounterResetToDBvalue', 'Convert AwardTriggeredAgainAfterCounterReset into DB value');

    var value = '';

    switch (inAwardTriggeredAgainAfterCounterReset){
        case true: value = constants.DB_PNT_PARTIAL_RESET_ENABLE; break;
        case false: value = constants.DB_PNT_PARTIAL_RESET_DISABLE; break;
    }

    return value;
};

/**
 * Convert CascadedAwardTriggered to db value
 * @param inCascadedAwardTriggered
 * @returns db value of CascadedAwardTriggered
 */
serviceHelper.convertIsCascadedAwardTriggeredToDBvalue = function(inCascadedAwardTriggered){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertIsCascadedAwardTriggeredToDBvalue', 'Convert CascadedAwardTriggered to db value');

    var value = '';

    switch (inCascadedAwardTriggered){
        case true: value = constants.DB_PNT_CASCADE_CPNS_ENABLE; break;
        case false: value = constants.DB_PNT_CASCADE_CPNS_DISABLE; break;
    }

    return value;
};

/**
 * Get IsAwardTriggeredAgainAfterCounterReset based on driver type
 * @param inCampaignObj
 * @returns {string}
 */
serviceHelper.getIsAwardTriggeredAgainAfterCounterReset = function(inCampaignObj){

    logger.msg('INFO', 'serviceHelper', '', '', 'getIsAwardTriggeredAgainAfterCounterReset', 'Get IsAwardTriggeredAgainAfterCounterReset based on driver type');

    var value = '';

    switch(inCampaignObj.driverType) {
        case constants.DRIVER_TYPE_AMOUNT:
            value = commonUtil.getNestedPropertyValue(inCampaignObj, 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isAwardTriggeredAgainAfterCounterReset');
            break;
    }

    if(!value){
        value = '';
    }

    return value;
};


/**
 * Get IsCascadedAwardTriggered based on driver type
 * @param inCampaignObj
 * @returns {string}
 */
serviceHelper.getIsCascadedAwardTriggered = function(inCampaignObj){
    logger.msg('INFO', 'serviceHelper', '', '', 'getIsCascadedAwardTriggered', 'Get IsCascadedAwardTriggered based on driver type');

    var value = '';

    switch(inCampaignObj.driverType) {
        case constants.DRIVER_TYPE_AMOUNT:
            value = commonUtil.getNestedPropertyValue(inCampaignObj, 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isCascadedAwardTriggered');
            break;
    }

    if(!value){
        value = '';
    }

    return value;
};

/**
 * Get ReceiptPrintingType based on driver Type
 * @param inCampaignObj
 * @returns {string}
 */
serviceHelper.getReceiptPrintingType = function(inCampaignObj, inScenarioIndex){
    logger.msg('INFO', 'serviceHelper', '', '', 'getReceiptPrintingType', 'Get ReceiptPrintingType based on driver type');

    var value = '';

    switch(inCampaignObj.driverType) {
        case constants.DRIVER_TYPE_AMOUNT:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails &&
                inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType){

                value = inCampaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType;
            }
            break;
        case constants.DRIVER_TYPE_FREQUENCY:
            if(inCampaignObj &&
                inCampaignObj.driverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex] &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails &&
                inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType){

                value = inCampaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[inScenarioIndex].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType;
            }
            break;
    }

    if(!value){
        value = '';
    }

    return value;
};

/**
 * Get reward mode
 * @param campaignObj
 * @returns {string}
 */
serviceHelper.getRewardMode = function(campaignObj){
    logger.msg('INFO', 'serviceHelper', '', '', 'getRewardMode', 'Get reward mode');

    var value = '';
    var benefitDetails = commonUtil.getNestedPropertyValue(campaignObj, 'benefitDetails');
    if (benefitDetails && benefitDetails.discountBenefitDetails) {
        if (benefitDetails.discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_PERCENTAGE) {
            value = 4;
        } else if (benefitDetails.discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_FIXED_AMOUNT) {
            value = 3;
        }
    }

    return value;
};

/**
 * Get discount fixed amount
 * @param campaignObj
 * @returns {string}
 */
serviceHelper.getDiscountFixedAmount = function(campaignObj){
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountFixedAmount', 'Get discount fixed amount');

    var value = '';
    var benefitDetails = commonUtil.getNestedPropertyValue(campaignObj, 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails');
    if (benefitDetails && benefitDetails.discountBenefitDetails) {
        if (benefitDetails.discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_FIXED_AMOUNT) {
            value = benefitDetails.discountBenefitDetails.discountFixedAmount;
        }
    }

    return value;
};

/**
 * Get discount percentage
 * @param campaignObj
 * @returns {string}
 */
serviceHelper.getDiscountPercentage = function(campaignObj){
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Get discount percentage');

    var value = '';
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Bef benefitDetails');
    var benefitDetails = commonUtil.getNestedPropertyValue(campaignObj, 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails');
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Aft benefitDetails');
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'benefitDetails-'+JSON.stringify(benefitDetails));
    if (benefitDetails && benefitDetails.discountBenefitDetails) {
        logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Aft benefitDetails - First IF');
        if (benefitDetails.discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_PERCENTAGE) {
            logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Aft benefitDetails - Second IF');
            value = benefitDetails.discountBenefitDetails.discountPercentage;
        }
    }
    logger.msg('INFO', 'serviceHelper', '', '', 'getDiscountPercentage', 'Aft benefitDetails value - ' + value);

    return value;
};

/**
 * Convert ReceiptPrintingType to db value
 * @param inReceiptPrintingType
 * @returns {string}
 */
serviceHelper.convertReceiptPrintingTypeToDBvalue = function(inReceiptPrintingType){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertReceiptPrintingTypeToDBvalue', 'Convert ReceiptPrintingType to db value='+inReceiptPrintingType);

    var value = '';

    switch (inReceiptPrintingType){
        case constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT: value = constants.DB_DISPLAY_FLAG_SAME_RECEIPT; break;
        case constants.RECEIPT_PRINTING_TYPE_NEW_RECEIPT_SEPARATE_FROM_PAYMENT: value = constants.DB_DISPLAY_FLAG_NEW_RECEIPT; break;
    }

    return value;
};

/**
 * Convert displayFlag to ReceiptPrintingType string
 * @param inDisplayFlag
 * @returns ReceiptPrintingType in string
 */
serviceHelper.convertDisplayFlagToReceiptPrintingType = function(inDisplayFlag){

    logger.msg('INFO', 'serviceHelper', '', '', 'convertDisplayFlagToReceiptPrintingType', 'Convert displayFlag to ReceiptPrintingType string');

    var str = '';

    switch (inDisplayFlag){
        case constants.DB_DISPLAY_FLAG_SAME_RECEIPT: str = constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT; break;
        case constants.DB_DISPLAY_FLAG_NEW_RECEIPT: str = constants.RECEIPT_PRINTING_TYPE_NEW_RECEIPT_SEPARATE_FROM_PAYMENT; break;
        default: str = constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT; break;
    }

    return str;
};

/**
 * Validate counter reset details
 * @param counterResetDetails
 * @param errorArray
 * @returns {d.promise}
 */
serviceHelper.validateCounterResetDetails = function (counterResetDetails, errorArray) {
    var d = Q.defer();
    var errorMessage;
    logger.msg('INFO', 'serviceHelper', '', '', 'validateCounterResetDetails', 'Validate counter reset details');

    if (counterResetDetails && counterResetDetails.counterResetType) {
        if (counterResetDetails.counterResetType === constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE ||
            counterResetDetails.counterResetType === constants.COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE) {
            if (!counterResetDetails.noOfDaysFromTransactionDateToResetCounter && counterResetDetails.noOfDaysFromTransactionDateToResetCounter !== 0) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateCounterResetDetails', 'Validation error - Counter reset: No. of days is missing');
                errorMessage = util.format(constants.MSG_MISSING_VALUE, constants.NUMBER_OF_DAYS);
                commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'noOfDaysFromTransactionDateToResetCounter', '', errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else if (counterResetDetails.noOfDaysFromTransactionDateToResetCounter < constants.NUMBER_OF_DAYS_MINIMUM || counterResetDetails.noOfDaysFromTransactionDateToResetCounter > constants.NUMBER_OF_DAYS_MAXIMUM) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateCounterResetDetails', 'Validation error - Counter reset: No. of days should be between 1 and 365');
                errorMessage = util.format(constants.MSG_INVALID_NO_OF_DAYS, constants.NUMBER_OF_DAYS_MINIMUM, constants.NUMBER_OF_DAYS_MAXIMUM);
                commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'noOfDaysFromTransactionDateToResetCounter', counterResetDetails.noOfDaysFromTransactionDateToResetCounter, errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else {
                d.resolve(errorArray);
            }
        } else if (counterResetDetails.counterResetType === constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE ||
            counterResetDetails.counterResetType === constants.COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE) {
            if (!counterResetDetails.noOfMonthsFromTransactionDateToResetCounter && counterResetDetails.noOfMonthsFromTransactionDateToResetCounter !== 0) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateCounterResetDetails', 'Validation error - Counter reset: No. of months is missing');
                errorMessage = util.format(constants.MSG_MISSING_VALUE, constants.NUMBER_OF_MONTHS);
                commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'noOfMonthsFromTransactionDateToResetCounter', '', errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else if (counterResetDetails.noOfMonthsFromTransactionDateToResetCounter < constants.NUMBER_OF_MONTHS_MINIMUM || counterResetDetails.noOfMonthsFromTransactionDateToResetCounter > constants.NUMBER_OF_MONTHS_MAXIMUM) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateCounterResetDetails', 'Validation error - Counter reset: No. of months should be between 1 and 12');
                errorMessage = util.format(constants.MSG_INVALID_NO_OF_MONTHS, constants.NUMBER_OF_MONTHS_MINIMUM, constants.NUMBER_OF_MONTHS_MAXIMUM);
                commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'noOfMonthsFromTransactionDateToResetCounter', counterResetDetails.noOfMonthsFromTransactionDateToResetCounter, errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else {
                d.resolve(errorArray);
            }
        } else {
            d.resolve(errorArray);
        }
    } else {
        d.resolve(errorArray);
    }

    return d.promise;
};

/**
 * Validate benefit details
 * @param benefitType
 * @param benefitDetails
 * @param errorArray
 * @returns {d.promise}
 */
serviceHelper.validateBenefitDetails = function (benefitType, benefitDetails, errorArray) {
    var d = Q.defer();
    var errorMessage;
    logger.msg('INFO', 'serviceHelper', '', '', 'validateBenefitDetails', 'Validate benefit details');

    if (benefitType === constants.BENEFIT_TYPE_DISCOUNT && benefitDetails) {
        serviceHelper.validateDiscountBenefitDetails(benefitDetails.discountBenefitDetails, errorArray)
        .then(function(validatedErrorArray) {
                d.resolve(validatedErrorArray);
            }, function(err){
                d.reject(err);
            });
    } else {
        d.resolve(errorArray);
    }

    return d.promise;
};

/**
 * Validate discount benefit details
 * @param discountBenefitDetails
 * @param errorArray
 * @returns {d.promise}
 */
serviceHelper.validateDiscountBenefitDetails = function (discountBenefitDetails, errorArray) {
    var d = Q.defer();
    var errorMessage;
    logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails', 'Validate discount benefit details');

    if (discountBenefitDetails && discountBenefitDetails.discountType) {
        if (discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_FIXED_AMOUNT) {
            if (!discountBenefitDetails.discountFixedAmount && discountBenefitDetails.discountFixedAmount !== 0) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails', 'Validation error - Discount benefit details: Discount fixed amount is missing');
                errorMessage = util.format(constants.MSG_MISSING_VALUE, constants.DISCOUNT_FIXED_AMOUNT);
                commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'discountFixedAmount', '', errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else if (discountBenefitDetails.discountFixedAmount < constants.DISCOUNT_FIXED_AMOUNT_MINIMUM || discountBenefitDetails.discountFixedAmount > constants.DISCOUNT_FIXED_AMOUNT_MAXIMUM) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails', 'Validation error - Discount benefit details: Fixed amount should be between the specified limit');
                errorMessage = util.format(constants.MSG_INVALID_DISCOUNT_FIXED_AMOUNT, constants.DISCOUNT_FIXED_AMOUNT_MINIMUM, constants.DISCOUNT_FIXED_AMOUNT_MAXIMUM);
                commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'discountFixedAmount', discountBenefitDetails.discountFixedAmount, errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else {
                d.resolve(errorArray);
            }
        } else if (discountBenefitDetails.discountType === constants.DISCOUNT_TYPE_PERCENTAGE) {
            if (!discountBenefitDetails.discountPercentage && discountBenefitDetails.discountPercentage !== 0) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails', 'Validation error - Discount benefit details: Percentage is missing');
                errorMessage = util.format(constants.MSG_MISSING_VALUE, constants.DISCOUNT_PERCENTAGE);
                commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'discountPercentage', '', errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else if (discountBenefitDetails.discountPercentage < constants.DISCOUNT_PERCENTAGE_MINIMUM || discountBenefitDetails.discountPercentage > constants.DISCOUNT_PERCENTAGE_MAXIMUM) {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails', 'Validation error - Discount benefit details: Percentage should be between the specified limit');
                errorMessage = util.format(constants.MSG_INVALID_DISCOUNT_PERCENTAGE, constants.DISCOUNT_PERCENTAGE_MINIMUM, constants.DISCOUNT_PERCENTAGE_MAXIMUM);
                commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'discountPercentage', discountBenefitDetails.discountPercentage, errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        d.resolve(errorArray);
                    }, function (err) {
                        d.reject(err);
                    });
            } else {
                d.resolve(errorArray);
            }
        } else {
            d.resolve(errorArray);
        }
    } else {
        if (!discountBenefitDetails) {
            logger.msg('INFO', 'serviceHelper', '', '', 'validateDiscountBenefitDetails',
                'Validation error - discountBenefitDetails is required');
            errorMessage = util.format(constants.MSG_MISSING_VALUE, 'Discount benefit details');
            commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'discountBenefitDetails',
                '', errorMessage)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    d.resolve(errorArray);
                });
        } else {
            d.resolve(errorArray);
        }
    }

    return d.promise;
};

serviceHelper.validateScenarioMessageDetails = function (scenarioMessageDetails, scenarioNumber, errorArray) {
    var d = Q.defer();
    var errorMessage, errMsgVal, fieldName;
    logger.msg('INFO', 'serviceHelper', '', '', 'validateScenarioMessageDetails', 'Validate scenarioMessageDetails');

    if (scenarioMessageDetails && scenarioMessageDetails.receiptMessageDetails && scenarioMessageDetails.receiptMessageDetails.receiptMessages) {
        if (scenarioMessageDetails.receiptMessageDetails.receiptMessages.length === 0) {
            logger.msg('INFO', 'serviceHelper', '', '', 'validateScenarioMessageDetails',
                'Validation error - receiptMessages is required');
            errMsgVal = 'Receipt messages';
            fieldName = 'receiptMessages';
            errorMessage = util.format(constants.MSG_MISSING_VALUE, errMsgVal);
            commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, fieldName,
                '', errorMessage)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    d.resolve(errorArray);
                });
        } else {
            if (scenarioMessageDetails.receiptMessageDetails.receiptMessages.length > 0) {
                scenarioMessageDetails.receiptMessageDetails.receiptMessages.forEach( function(receiptMessage) {
                    if (receiptMessage.isMessagePrintedInBold && receiptMessage.isMessagePrintedInBold === true &&
                        receiptMessage.message.length > constants.SCENARIO_RECEIPT_MSG_MAX_LENGTH12) {
                        logger.msg('INFO', 'serviceHelper', '', '', 'validateScenarioMessageDetails',
                            'Validation error - receiptMessage message length must not exceed 12 characters when bold is true');
                        errorMessage = util.format(constants.MSG_SCENARIO_MSG_LINE_EXCEED12_BOLD, scenarioNumber, receiptMessage.lineNumber);
                        commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE,
                            'message',
                            '', errorMessage)
                            .then(function (errorJSON) {
                                errorArray.push(errorJSON);
                            });
                    }
                });

                /*jshint -W073 */
                if(serviceHelper.foundDuplicateLineNum(scenarioMessageDetails.receiptMessageDetails.receiptMessages)) {
                    logger.msg('INFO', 'serviceHelper', '', '', 'validateScenarioMessageDetails',
                        'Validation error - duplicate line number found in receiptMessages array');
                    errorMessage = constants.MSG_DUPLICATE_MSG_LINE_NUMBER;
                    commonUtil.constructErrorJSONStructure(constants.DUPLICATE_FIELD_VALUE,
                        'lineNumber',
                        '', errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                            d.resolve(errorArray);
                        });
                } else {
                    d.resolve(errorArray);
                }
            } else {
                d.resolve(errorArray);
            }
        }
    } else {
        d.resolve(errorArray);
    }

    return d.promise;
};

/**
 * Checks the duplicate line numbers in receipt messages
 *
 * @param receiptMessages
 * @returns {*|boolean}
 */
serviceHelper.foundDuplicateLineNum = function (receiptMessages) {
    var result = _.map(receiptMessages, function (o, i) {
        var eq = _.find(receiptMessages, function (e, ind) {
            if (i > ind) {
                return _.isEqual(e.lineNumber, o.lineNumber);
            }
        });
        if (eq) {
            o.isDuplicate = true;
            return true;
        } else {
            //return o;
        }
        return o.isDuplicate;
    });
    return result.includes(true);
};

/**
 * Validate event days
 * @param eventDays
 * @param errorArray
 * @returns {promise|*}
 */
serviceHelper.validateEventDays = function (eventDays, errorArray) {
    var d = Q.defer();
    var errorMessage;
    logger.msg('INFO', 'serviceHelper', '', '', 'validateEventDays', 'Validate event days');

    if (eventDays && eventDays.length > 0) {
        _.each(eventDays, function (value) {
            var errorMessage;
            if (value) {
                if (!moment(value, ['DDMM'], true).isValid()) {
                    // Validation failure (eventDay is not in proper format)
                    logger.msg('INFO', 'serviceHelper', '', '', 'validateEventDays', 'Validation error - event day is not in proper format');
                    errorMessage = util.format(constants.MSG_INVALID_EVENT_DAY);
                    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'eventDays', value, errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                        }, function (err) {
                            d.reject(err);
                        });
                }
            } else {
                logger.msg('INFO', 'serviceHelper', '', '', 'validateEventDays', 'Validation error - event day is empty');
                errorMessage = util.format(constants.MSG_INVALID_EVENT_DAY);
                commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, 'eventDays', value, errorMessage)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                    }, function (err) {
                        d.reject(err);
                    });
            }
        });
        d.resolve(errorArray);
    } else {
        d.resolve(errorArray);
    }

    return d.promise;
};
