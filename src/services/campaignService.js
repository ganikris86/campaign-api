'use strict';

var campaignModel = require('../models/campaignModel');
var baseSchema = require('../schema/baseSchema');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var httpStatus = require('http-status');
var commonUtil = require('../lib/commonUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var jsonSchemaUtil = require('../lib/jsonSchemaUtil');
var serviceHelper = require('./serviceHelper');
var subscriptionService = require('./subscriptionService');
var oeCampaignService = require('./oeCampaignService');
var Q = require('q');
var moment = require('moment');
var util = require('util');

function campaignService() {
}

module.exports = campaignService;

/**
 ************************************************************************
 * Below functions are called by controller v1.js
 *
 * Below are the APIs added so far
 *
 * 1. Create campaign
 * 2. Delete Campaign
 * 3. Get campaign by id
 * 4. Get all campaigns
 ************************************************************************
 */

/**
 * Create a new campaign, This creates campaign, auto subscribes, and OE Refresh depends on owner type
 *
 * @param request - request object
 * @param response - response object
 */
campaignService.createCampaign = function (req, res) {
    logger.msg('INFO', 'campaignService', '', '', 'createCampaign', 'Create a new campaign');
    var campaignObj;
    return commonUtil.parseRequestObject(req.body, baseSchema.createCampaignReqSchemaDef)
            .then(function (respCampaignObj) {
                campaignObj = respCampaignObj;
                logger.msg('INFO', 'campaignService', '', '', 'createCampaign', 'Parsed campaign req - ' + JSON.stringify(campaignObj));
                return campaignService.validateCampaignRequestData(req, campaignObj);
            })
            .then(function (errorArray) {
                if (!(errorArray) || (errorArray.length === 0)) {
                    return campaignService.createCampaignReq(campaignObj)
                        .then(function (respCampaignObj) {
                            logger.msg('INFO', 'campaignService', '', '', 'createCampaign', 'Created the campaign - ' + JSON.stringify(respCampaignObj));
                            return commonUtil.sendResponse(res, httpStatus.CREATED, respCampaignObj);
                        }, function (err) {
                            logger.msg('ERROR', 'campaignService', '', '', 'createCampaign', 'Error in createCampaign - ' + err.stack);
                            return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
                        });
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'createCampaign', 'Validation Error in createCampaign - ' + JSON.stringify(errorArray));
                    return commonUtil.sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, errorArray);
                }
            }, function (err) {
                logger.msg('ERROR', 'campaignService', '', '', 'createCampaign', 'Error in createCampaign - ' + err.stack);
                return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
            });
};

/**
 * Delete campaign by campaign id. This deletes campaign, auto un-subscribes and OE Refresh
 *
 * @param req - http request object
 * @param res - http response object
 * @returns {*} - returns promise object
 */
campaignService.deleteCampaign = function (req, res) {
    logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign', 'start');
    var campaignId = req.params.campaignId;
    campaignId = campaignId ? campaignId.trim() : campaignId; //Do not trim if campaignId is undefined
    logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign', 'campaignId - ' + campaignId);

    if (isNaN(campaignId)) {
        logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign', 'campaignId is non-numeric');
        return commonUtil.sendResponseWoBody(res, httpStatus.NOT_FOUND);
    } else {
        var campaignRequestParameters = {};
        campaignRequestParameters.campaignId = campaignId;
        campaignRequestParameters.isSingleResult = true;
        campaignRequestParameters.action = 'deleteCampaign';

        return campaignService.getRelatedCampaignsResponseData(campaignRequestParameters)
            .then(function (dbCampaign) {
                if (dbCampaign) {
                    var campaignResponse = dbCampaign;
                    var tenantInfo = commonUtil.getTenantInfoFromGlobal();
                    var isSubscribableToServeralMerchants = campaignResponse.isSubscribableToServeralMerchants;
                    var ownerType = campaignResponse.ownerType;
                    var deleteAllowedToNonMonoMerchant = tenantInfo.isDeleteAllowedToNonMonoMerchant;
                    logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign',
                        'Campaign found, '+JSON.stringify(campaignResponse));

                    if (((isSubscribableToServeralMerchants && isSubscribableToServeralMerchants === false) &&
                        (ownerType && ownerType === constants.OWNER_TYPE_MERCHANT)) ||
                        (deleteAllowedToNonMonoMerchant === constants.DELETED_ALLOWED_TRUE)) {

                        logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign', 'calling delete campaign function... ');
                        return campaignService.deleteCampaignRelatedEntries(campaignResponse.campaignId)
                            .then(function (result) {
                                campaignResponse.status = constants.STATUS_DELETED;
                                return commonUtil.sendResponse(res, httpStatus.OK, campaignService.formatArrayCampaignsForResponse('JSON', campaignResponse));
                            }, function (err) {
                                logger.msg('ERROR', 'campaignService', '', '', 'deleteCampaign',
                                    'Error in delete campaign - ' + err.stack);
                                return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
                            });

                    } else {
                        logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign',
                            'Delete is not allowed to non mono merchants when config value is false ');
                        var errorArray = [];
                        var errorMessage = util.format(constants.MSG_CAMPAIGN_CAN_NOT_BE_DELETED,
                            campaignResponse.name);
                        return commonUtil.constructErrorJSONStructure(constants.INVALID_OPERATION, 'name',
                            campaignResponse.name, errorMessage)
                            .then(function (errorJSON) {
                                errorArray.push(errorJSON);
                                return commonUtil.sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, errorArray);
                            });
                    }
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'deleteCampaign', 'Campaign does not exist');
                    return commonUtil.sendResponseWoBody(res, httpStatus.NOT_FOUND);
                }
            }, function (err) {
                logger.msg('ERROR', 'campaignService', '', '', 'deleteCampaign',
                    'Error in delete campaign - ' + err.stack);
                return commonUtil.sendResponseWoBody(res, httpStatus.INTERNAL_SERVER_ERROR);
            });
    }
};

/**
 * Get campaign details based on campaignId
 *
 * @param request - http request object
 * @param response - http response object
 */
campaignService.getCampaignByCampaignId = function(request, response){
    var thisMethod = 'getCampaignByCampaignId';

    logger.msg('INFO', 'campaignService', '', '', thisMethod, 'get campaign by id');

    var campaignRequestParameters = {};
    campaignRequestParameters.isSingleResult = true;
    campaignRequestParameters.action = 'campaignById';

    var campaignId = request.params.campaignId;
    campaignId = campaignId ? campaignId.trim() : campaignId; //Do not trim if campaignId is undefined

    if (isNaN(campaignId)) {
        logger.msg('INFO', 'campaignService', '', '', thisMethod, 'campaignId is non-numeric');
        return commonUtil.sendResponseWoBody(response, httpStatus.NOT_FOUND);
    }

    campaignRequestParameters.campaignId = campaignId;
    logger.msg('INFO', 'campaignService', '', '', thisMethod, 'Request campaignId= ' + campaignId);

    return campaignService.getRelatedCampaignsResponseData(campaignRequestParameters)
        .then(function(campaign){
            if(campaign){
                logger.msg('INFO', 'campaignService', '', '', thisMethod, 'Campaign='+campaign);
                return commonUtil.sendResponse(response, httpStatus.OK, campaignService.formatArrayCampaignsForResponse('JSON', campaign));
            } else {
                logger.msg('INFO', 'campaignService', '', '', thisMethod, 'campaigns do not exist');
                return commonUtil.sendResponseWoBody(response, httpStatus.NOT_FOUND);
            }
        }, function (err) {
            logger.msg('INFO', 'campaignService', '', '', thisMethod, 'Undefined error in getCampaigns - ' + err.stack);
            return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
        });

};

/**
 * Get all campaigns based on request query parameters (status, driverType, ownerType, merchantId, etc...)
 *
 * @param request - request object
 * @param response - response object
 */
campaignService.getCampaigns = function (request, response){
    logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'get campaigns');

    logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'process request');
    var campaignRequestParameters = campaignService.constructRequestParameterDBFromGetCampaignsRequestQuery(request);
    campaignRequestParameters.action = 'getAllCampaigns';

    logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'campaignRequestParameters=' + JSON.stringify(campaignRequestParameters));
    //if merchantId is non-numeric just return no campaigns
    if (campaignRequestParameters.merchantId && isNaN(campaignRequestParameters.merchantId)) {
        return commonUtil.sendResponse(response, httpStatus.OK, []);
    } else {
        return campaignService.getRelatedCampaignsResponseData(campaignRequestParameters)
            .then(function (campaigns) {
                if (campaigns) {
                    logger.msg('INFO', 'campaignService', '', '', 'getCampaign', 'Campaigns=+campaigns');
                    return commonUtil.sendResponse(response, httpStatus.OK, campaignService.formatArrayCampaignsForResponse('JSON', campaigns));
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'campaigns do not exist');
                    return commonUtil.sendResponseWoBody(response, httpStatus.NOT_FOUND);
                }
            }, function (err) {
                logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'Undefined error in getCampaigns - ' + err.stack);
                return commonUtil.sendResponseWoBody(response, httpStatus.INTERNAL_SERVER_ERROR);
            });
    }

};


//*************************************************************************
// Below functions are called by this service itself
//*************************************************************************

/**
 * Schema and business validation for create campaign request data
 * @param request - request object
 * @param campaignObj - request campaign object
 * @returns array of error
 */
campaignService.validateCampaignRequestData = function (req, campaignObj) {
    var d = Q.defer();
    var errorArray = [];
    logger.msg('INFO', 'campaignService', '', '', 'validateCampaignRequestData', 'Business validation for create campaign req data');
    jsonSchemaUtil.validateSchema(campaignObj, baseSchema.createCampaignReqSchemaDef)
        .then(function (schemaError) {
            if (schemaError) {
                errorArray = schemaError;
            }
            return campaignService.validateCampaignBasicDetails(campaignObj, errorArray);
        })
        .then(function (basicFieldsErrorArray) {
            errorArray = basicFieldsErrorArray;
            return campaignService.validateDriverAndBenefitsDetails(campaignObj, errorArray);
        })
        .then(function (driverAndBenefitsDetailsErrorArray) {
            errorArray = driverAndBenefitsDetailsErrorArray;
            d.resolve(errorArray);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'validateCampaignRequestData', 'Error in validateCampaignRequestData - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Business validation for basic fields in campaign req data
 * @param campaignObj
 * @param errorArray
 * @returns {d.promise}
 */
campaignService.validateCampaignBasicDetails = function (campaignObj, errorArray) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'validateCampaignBasicDetails', 'Business validation for basic fields in campaign req data');

    serviceHelper.validateStartDateFormat(campaignObj.startDate, errorArray)
        .then(function (startDateFormatErrorArray) {
            errorArray = startDateFormatErrorArray;
            return serviceHelper.validateEndDateFormat(campaignObj.endDate, errorArray);
        })
        .then(function (endDateFormatErrorArray) {
            errorArray = endDateFormatErrorArray;
            return serviceHelper.validateStartDateLessThanToday(campaignObj.startDate, errorArray);
        })
        .then(function (startDateInValidErrorArray) {
            errorArray = startDateInValidErrorArray;
            var campaignValidity = {};
            campaignValidity.startDate = campaignObj.startDate;
            campaignValidity.endDate = campaignObj.endDate;
            return serviceHelper.validateEndDateLessThanStartDate(campaignValidity, errorArray);
        })
        .then(function (endDateInValidErrorArray) {
            errorArray = endDateInValidErrorArray;
            return serviceHelper.validateOwnerType(campaignObj.ownerType, campaignObj.ownerId, errorArray);
        })
        .then(function (ownerTypeErrorArray) {
            errorArray = ownerTypeErrorArray;
            d.resolve(errorArray);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'validateCampaignBasicDetails', 'Error in validateCampaignBasicDetails - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Business validation for driverAndBenefitsDetails data
 * @param campaignObj
 * @param errorArray
 * @returns {d.promise}
 */
campaignService.validateDriverAndBenefitsDetails = function (campaignObj, errorArray) {
    /*jshint -W071 */
    var d = Q.defer();
    var chosenDriverAndBenefitsDetails = {}, counterResetDetails = {}, chosenDiscountBenefitDetails = {},
        chosenScenariosAndBenefitsDetails;
    var chosenScenarioMessageDetails, chosenDriverScenariosAndBenefitsDetailsArr = [];
    logger.msg('INFO', 'campaignService', '', '', 'validateDriverAndBenefitsDetails',
        'Business validation for driverAndBenefitsDetails data');

    var scenarioNumber = 1; //presently scenario number 1 only allowed
    var errorMessage = '', fieldName = '', errMsg = '', fieldName2='';
    var validateDriverScenariosAndBenefitsDetails = false;

    /*jshint -W073 */
    if (campaignObj.driverAndBenefitsDetails) {
        if (campaignObj.driverType === constants.DRIVER_TYPE_EVENT_DAY) {
            var driverAndBenefitsDetails = campaignObj.driverAndBenefitsDetails;
            var eventDays = commonUtil.getNestedPropertyValue(driverAndBenefitsDetails, 'eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.eventDays');
            var benefitDetails = commonUtil.getNestedPropertyValue(driverAndBenefitsDetails, 'eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails');
            var scenarioMessageDetails = commonUtil.getNestedPropertyValue(driverAndBenefitsDetails, 'eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails');
            serviceHelper.validateEventDays(eventDays, errorArray)
                .then(function (eventDaysError) {
                    errorArray = eventDaysError;
                    return serviceHelper.validateBenefitDetails(campaignObj.benefitType, benefitDetails, errorArray);
                })
                .then(function (discountBenefitDetailsError) {
                    errorArray = discountBenefitDetailsError;
                    return serviceHelper.validateScenarioMessageDetails(scenarioMessageDetails, scenarioNumber, errorArray);
                })
                .then(function (scenarioMessageDetailsError) {
                    errorArray = scenarioMessageDetailsError;
                    d.resolve(errorArray);
                }, function (err) {
                    logger.msg('ERROR', 'campaignService', '', '', 'validateDriverAndBenefitsDetails',
                        'Error in validateDriverAndBenefitsDetails - ' + err.stack);
                    d.reject(err);
                });
        } else {
            if (campaignObj.driverType === constants.DRIVER_TYPE_AMOUNT) {
                chosenDriverAndBenefitsDetails = campaignObj.driverAndBenefitsDetails.amountDriverAndBenefitsDetails;
                if (chosenDriverAndBenefitsDetails) {
                    if (campaignObj.benefitType === constants.BENEFIT_TYPE_DISCOUNT) {
                        chosenDriverScenariosAndBenefitsDetailsArr = chosenDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails;
                        errMsg = 'Amount driver scenarios and benefits details';
                        fieldName = 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails';
                        fieldName2 = 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioNumber';
                        validateDriverScenariosAndBenefitsDetails = true;
                    }
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'validateDriverAndBenefitsDetails', 'Validation error - Amount driver and benefit details is missing');
                    errorMessage = constants.MSG_AMOUNT_DRIVER_BENEFIT_DTLS_MISSING;
                    commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails', '', errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                            d.resolve(errorArray);
                        });
                }
            } else if (campaignObj.driverType === constants.DRIVER_TYPE_FREQUENCY) {
                chosenDriverAndBenefitsDetails = campaignObj.driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails;
                if (chosenDriverAndBenefitsDetails) {
                    if (campaignObj.benefitType === constants.BENEFIT_TYPE_DISCOUNT) {
                        chosenDriverScenariosAndBenefitsDetailsArr = chosenDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails;
                        errMsg = 'Frequency driver scenarios and benefits details';
                        fieldName = 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails';
                        fieldName2 = 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioNumber';
                        validateDriverScenariosAndBenefitsDetails = true;
                    }
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'validateDriverAndBenefitsDetails', 'Validation error - Frequency driver and benefit details is missing');
                    errorMessage = constants.MSG_FREQUENCY_DRIVER_BENEFIT_DTLS_MISSING;
                    commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails', '', errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                            d.resolve(errorArray);
                        });
                }
            }

            //common validation for driver types - Amount, Frequency
            //TODO - later plan to put it in common function
            if (validateDriverScenariosAndBenefitsDetails) {
                if (chosenDriverScenariosAndBenefitsDetailsArr && chosenDriverScenariosAndBenefitsDetailsArr.length > 0) {
                    chosenScenariosAndBenefitsDetails = chosenDriverScenariosAndBenefitsDetailsArr.find(obj => obj.scenarioNumber === scenarioNumber);
                    if (chosenScenariosAndBenefitsDetails) {
                        chosenDiscountBenefitDetails = chosenScenariosAndBenefitsDetails.benefitDetails;
                        chosenScenarioMessageDetails = chosenScenariosAndBenefitsDetails.scenarioMessageDetails;
                    } else {
                        if (chosenDriverScenariosAndBenefitsDetailsArr[0].scenarioNumber) {
                            logger.msg('INFO', 'campaignService', '', '', 'validateDriverAndBenefitsDetails',
                                'Validation error - scenario number 1 is missing');
                            errorMessage = constants.MSG_SCENARIO_NUM_ONE_MISSING;
                            commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, fieldName2,
                                chosenDriverScenariosAndBenefitsDetailsArr[0].scenarioNumber, errorMessage)
                                .then(function (errorJSON) {
                                    errorArray.push(errorJSON);
                                    d.resolve(errorArray);
                                });
                        }
                    }
                } else {
                    logger.msg('INFO', 'campaignService', '', '', 'validateDriverAndBenefitsDetails',
                        'Validation error - DriverScenariosAndBenefitsDetails is required');
                    errorMessage = util.format(constants.MSG_MISSING_VALUE, errMsg);
                    commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, fieldName,
                        '', errorMessage)
                        .then(function (errorJSON) {
                            errorArray.push(errorJSON);
                            d.resolve(errorArray);
                        });
                }
            }

            //Assign counter reset details
            counterResetDetails = chosenDriverAndBenefitsDetails ? chosenDriverAndBenefitsDetails.counterResetDetails : '';

            if (counterResetDetails) {
                serviceHelper.validateCounterResetDetails(counterResetDetails, errorArray)
                    .then(function (counterResetDetailsError) {
                        errorArray = counterResetDetailsError;
                        return serviceHelper.validateBenefitDetails(campaignObj.benefitType, chosenDiscountBenefitDetails, errorArray);
                    })
                    .then(function (discountBenefitDetailsError) {
                        errorArray = discountBenefitDetailsError;
                        return serviceHelper.validateScenarioMessageDetails(chosenScenarioMessageDetails, scenarioNumber, errorArray);
                    })
                    .then(function (scenarioMessageDetailsError) {
                        errorArray = scenarioMessageDetailsError;
                        d.resolve(errorArray);
                    }, function (err) {
                        logger.msg('ERROR', 'campaignService', '', '', 'validateDriverAndBenefitsDetails',
                            'Error in validateDriverAndBenefitsDetails - ' + err.stack);
                        d.reject(err);
                    });
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
 * Create campaign request
 * @param campaignObj - request campaign object
 * @returns response data
 */
campaignService.createCampaignReq = function (campaignObj) {
    var d = Q.defer();
    var tableObj = {};
    var subscriptionObj = {};
    subscriptionObj.ownerType = campaignObj.ownerType;
    subscriptionObj.ownerId = campaignObj.ownerId;


    logger.msg('INFO', 'campaignService', '', '', 'createCampaignReq', 'Create campaign request');
    campaignService.constructCampaignRelatedData(campaignObj)
        .then(function (responseData) {
            tableObj = {
                'campaignTableObj': responseData.campaignTableObj,
                'scenarioTableObj': responseData.scenarioTableObj,
                'scenarioMessagesTableObj': responseData.scenarioMessagesTableObj,
                'smsMessageTableObj': responseData.smsMessageTableObj,
                'campaignEventsTableObj': responseData.campaignEventsTableObj
            };
            return campaignService.createCampaignTransaction(tableObj, subscriptionObj);
        })
        .then(function (response) {
            return campaignService.constructCreateCampaignResponse(campaignObj, tableObj.campaignTableObj.campaign_id);
        })
        .then(function (responseCampaignData) {
            d.resolve(responseCampaignData);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'createCampaignReq', 'Error in createCampaignReq - ' + err.stack);
            d.reject(err);
        });
    return d.promise;
};

/**
 * Create campaign transaction
 * @param tableObj
 * @param subscriptionObj
 * @returns {d.promise}
 */
campaignService.createCampaignTransaction = function (tableObj, subscriptionObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'createCampaignTransaction', 'Create campaign transaction');

    commonDBUtil.getDBConnection()
        .then(function (dbConn) {
            return campaignService.createCampaignRelatedEntries(tableObj);
        })
        .then(function (response) {
            return subscriptionService.subscribeCampaign(tableObj.campaignTableObj.campaign_id, subscriptionObj);
        })
        .then(function (response) {
            return oeCampaignService.oeRefreshCreateCampaign(tableObj.campaignTableObj.campaign_id);
        })
        .then(function (response) {
            return commonDBUtil.commitTransaction();
        })
        .then(function (response) {
            d.resolve(response);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'createCampaignTransaction', 'Error in createCampaignTransaction - ' + err.stack);
            commonDBUtil.rollbackTransaction()
                .then(function (errRollback) {
                    d.reject(err);
                });
        });
    return d.promise;
};

/**
 * Call to create entries in all campaign related tables
 * @param tableObj - table data to db
 * @returns success or error
 */
campaignService.createCampaignRelatedEntries = function (tableObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'createCampaignRelatedEntries', 'Create campaign related entries');

    campaignModel.storeCampaignEntry(tableObj.campaignTableObj)
        .then(function (response) {
            return campaignModel.storeCampaignScenario(tableObj.scenarioTableObj);
        })
        .then(function (response) {
            return campaignModel.storeCampaignScenarioMessage(tableObj.scenarioMessagesTableObj);
        })
        .then(function (response) {
            return campaignModel.storeCampaignSMSMessage(tableObj.smsMessageTableObj);
        })
        .then(function (response) {
            return campaignModel.storeCampaignEvents(tableObj.campaignEventsTableObj);
        })
        .then(function (response) {
            d.resolve(response);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'createCampaignRelatedEntries', 'Error in createCampaignRelatedEntries - ' + err.stack);
            d.reject(err);
        });
    return d.promise;
};


/**
 * Gather all related data to construct Array of campaigns from DB
 * @param campaignRequestParameters - parameters for requesting campaign object:
 *  status, merchantId, ownerType, driverType
 */
campaignService.getRelatedCampaignsResponseData = function(campaignRequestParameters){

    logger.msg('INFO', 'campaignService', '', '', 'getRelatedCampaignsResponseData', 'Gather all related data to construct campaigns');

    var d = Q.defer();
    var dbResult = {};


    //Get individual components: Campaigns, Scenarios
    // TODO: expand for other type of campaign.
    campaignModel.getCampaigns(campaignRequestParameters)
        .then(function (campaigns) {
            dbResult.campaigns = campaigns;
            logger.msg('INFO', 'campaignService', '', '', 'getRelatedCampaignsResponseData', 'getCampaigns=' + campaigns.length);
            return campaignModel.getRfmScenarios();
        })
        .then(function (scenarios) {
            dbResult.scenarios = scenarios;
            //logger.msg('INFO', 'campaignService', '', '', 'getRelatedCampaignsResponseData', 'getRfmScenarios=' +JSON.stringify(scenarios));
            return campaignModel.getCampaignEvents();
        })
        .then(function (events) {
            dbResult.events = events;
            //logger.msg('INFO', 'campaignService', '', '', 'getRelatedCampaignsResponseData', 'getCampaignEvents=' +JSON.stringify(events));
            return campaignService.constructCampaignsResponse(dbResult, campaignRequestParameters.isSingleResult);
        })
        .then(function (campaignsObj) {
            d.resolve(campaignsObj);
        }, function (err) {
            logger.msg('INFO', 'campaignService', '', '', 'getCampaigns', 'Error - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Deletes campaign related data from concerned database tables. This is internal function.
 *
 * @param campaignData - campaign data fetched by campaign id from database
 * @returns {d.promise}
 */
campaignService.deleteCampaignRelatedEntries = function (campaignId) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'deleteCampaignRelatedEntries', 'start');

    commonDBUtil.getDBConnection()
        .then(function (dbConn) {
            campaignModel.setStatusDeletedInCampaign(campaignId)
                .then(function (response) {
                    return subscriptionService.unsubscribeCampaign(campaignId);
                })
                .then(function (response) {
                    return oeCampaignService.oeRefreshDeleteCampaign(campaignId);
                })
                .then(function (response) {
                    return commonDBUtil.commitTransaction();
                })
                .then(function (response) {
                    d.resolve(response);
                }, function(err){
                    logger.msg('ERROR', 'campaignService', '', '', 'deleteCampaignRelatedEntries',
                        'Error in deleteCampaignRelatedEntries, ' + err.stack);
                    commonDBUtil.rollbackTransaction()
                        .then(function (errRollback) {
                            d.reject(err);
                        });
                });
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'deleteCampaignRelatedEntries',
                'Error in getting the db connection - ' + err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Construct campaign related data
 * @param campaignObj - request campaign object
 * @returns campaign data to DB
 */
campaignService.constructCampaignRelatedData = function (campaignObj) {
    var d = Q.defer();
    var campaignId, scenarioId, campaignTableObj, smsMessageTableObj, scenarioTableObj, scenarioMessagesTableObj, campaignEventsTableObj;
    logger.msg('INFO', 'campaignService', '', '', 'createCampaignReq', 'Construct data objects for CAMPAIGN related tables');

    commonDBUtil.getSequenceNextValue(constants.SEQ_CAMPAIGN_ID)
        .then(function (generatedCpgSeqId) {
            campaignId = generatedCpgSeqId;
            return commonDBUtil.getSequenceNextValue(constants.SEQ_SCENARIO_ID);
        })
        .then(function (generatedScenarioSeqId) {
            scenarioId = generatedScenarioSeqId;
            return campaignService.constructCampaignTableObj(campaignId, campaignObj);
        })
        .then(function (generatedCampaignTableObj) {
            campaignTableObj = generatedCampaignTableObj;
            return campaignService.constructScenarioTableObj(campaignId, scenarioId, campaignObj);
        })
        .then(function (generatedScenarioTableObj) {
            scenarioTableObj = generatedScenarioTableObj;
            return campaignService.constructScenarioMessagesTableObj(scenarioId, campaignObj);
        })
        .then(function (generatedScenarioMessagesTableObj) {
            scenarioMessagesTableObj = generatedScenarioMessagesTableObj;
            return campaignService.constructSMSMessageTableObj(scenarioId, campaignObj);
        })
        .then(function (generatedSMSMessageTableObj) {
            smsMessageTableObj = generatedSMSMessageTableObj;
            return campaignService.constructCampaignEventsTableObj(campaignId, campaignObj);
        })
        .then(function (generatedCampaignEventsTableObj) {
            campaignEventsTableObj = generatedCampaignEventsTableObj;
            var responseData = {
                'campaignTableObj': campaignTableObj,
                'scenarioTableObj': scenarioTableObj,
                'scenarioMessagesTableObj': scenarioMessagesTableObj,
                'smsMessageTableObj': smsMessageTableObj,
                'campaignEventsTableObj': campaignEventsTableObj
            };
            d.resolve(responseData);
        }, function (err) {
            logger.msg('ERROR', 'campaignService', '', '', 'constructCampaignRelatedData', 'Error in constructCampaignRelatedData - ' + err.stack);
            d.reject(err);
        });
    return d.promise;
};

/**
 * Construct object for CAMPAIGN table
 * @param campaignId - campaign Id
 * @param campaignObj - request campaign object
 * @returns campaign data to DB table
 */
campaignService.constructCampaignTableObj = function (campaignId, campaignObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructCampaignTableObj', 'Construct object for CAMPAIGN table');

    logger.msg('INFO', 'campaignService', '', '', 'constructCampaignTableObj', 'campaignObj.campaignDescription.driverType-'+campaignObj.driverType);
    logger.msg('INFO', 'campaignService', '', '', 'constructCampaignTableObj', 'campaignObj.campaignDescription.benefitType-'+campaignObj.benefitType);

    //Construct data object
    var campaignData = {
        'campaign_id': campaignId,
        'campaign_name': campaignObj.name,
        'campaign_bold': 0,
        'description': campaignObj.shortDescription,
        'campaign_type': serviceHelper.convertDriverTypeToDbValue(campaignObj.driverType),
        'campaign_subtype': serviceHelper.convertBenefitTypeToDBvalue(campaignObj.benefitType),
        'min_purchase': campaignObj.minimumPurchaseAmount,
        'max_purchase': campaignObj.maximumPurchaseAmount,
        'accepted_freq': serviceHelper.convertTriggerFrequencyTypeToDBvalue(campaignObj.triggerFrequencyType),
        'mono_merchant': serviceHelper.convertIsSubscribableToSeverarMerchant(campaignObj.isSubscribableToServeralMerchants),
        'start_date': campaignObj.startDate,
        'end_date': campaignObj.endDate,
        'expiry_type': serviceHelper.convertCampaignCounterResetTypeToDBvalue(serviceHelper.getCounterResetTypeByDriverType(campaignObj.driverType, campaignObj.driverAndBenefitsDetails)),
        'expiry_months': serviceHelper.getNumberOfMonthOfCounterResetTypeByDriverType(campaignObj.driverType, campaignObj.driverAndBenefitsDetails),
        'last_update_by': 1,
        'status': serviceHelper.convertStatusStringToDbValue(campaignObj.status),
        'expiry_days': serviceHelper.getNumberOfDayOfCounterResetTypeByDriverType(campaignObj.driverType, campaignObj.driverAndBenefitsDetails),
        'ent_version_code': '07.01.00',
        'override': serviceHelper.convertCounterOverrideTypeToDBvalue(serviceHelper.getCounterOverrideTypeByDriverType(campaignObj.driverType, campaignObj.driverAndBenefitsDetails)),
        'mobile_message': campaignObj.mobileMessage,
        'owner_type': serviceHelper.convertOwnerTypeToDBvalue(campaignObj.ownerType),
        'owner_id': campaignObj.ownerId,
        'cpg_capping_rule': 0,
        'referencelogo': campaignObj.imageUrl,
        'available_for_vt': serviceHelper.convertIsSubscribableToHostAndVirtualTerminalsToDBvalue(campaignObj.isSubscribableToHostAndVirtualTerminals),
        'pnt_partial_reset': serviceHelper.convertIsAwardTriggeredAgainAfterCounterResetToDBvalue(serviceHelper.getIsAwardTriggeredAgainAfterCounterReset(campaignObj)),
        'pnt_cascade_cpns': serviceHelper.convertIsCascadedAwardTriggeredToDBvalue(serviceHelper.getIsCascadedAwardTriggered(campaignObj)),
        'reward_mode': serviceHelper.getRewardMode(campaignObj),
        'discount_amount': serviceHelper.getDiscountFixedAmount(campaignObj),
        'discount_percent': serviceHelper.getDiscountPercentage(campaignObj)
    };

    d.resolve(campaignData);
    return d.promise;
};

/**
 * Construct object for SMS_MESSAGE table
 * @param scenarioId
 * @param campaignObj
 * @returns {d.promise}
 */
campaignService.constructSMSMessageTableObj = function (scenarioId, campaignObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructSMSMessageTableObj', 'Construct object for SMS_MESSAGE table');

    var scenarioIndex = 0;
    var messages = serviceHelper.getScenarioReceiptMessage(campaignObj, scenarioIndex);
    var smsMessage = messages.smsMessage;
    var smsMessageData;

    if (smsMessage) {
        commonDBUtil.getSequenceNextValue(constants.SEQ_SMS_MESSAGE_ID)
        .then(function(generatedSMSMessageId){
                //Construct data object
                smsMessageData = {
                    'sms_message_iid': generatedSMSMessageId,
                    'sms_content': smsMessage,
                    'status': constants.DB_SMS_MESSAGE_STATUS_ACTIVE,
                    'scenario_id': scenarioId
                };
                d.resolve(smsMessageData);
            }, function(err) {
                d.reject(err);
            });
    } else {
        d.resolve(smsMessageData);
    }

    return d.promise;
};

/**
 * Construct object for SCENARIO table
 * @param campaignId - campaign Id
 * @param scenarioId - scenario Id
 * @param campaignObj - request campaign object
 * @returns scenario data to DB table
 */
campaignService.constructScenarioTableObj = function (campaignId, scenarioId, campaignObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructScenarioTableObj', 'Construct object for SCENARIO table');

    //Construct data object
    var scenarioIndex = 0;
    var scenarioData = {
        'scenario_id': scenarioId,
        'campaign_id': campaignId,
        'scenario_index': 1,
        's_lower': serviceHelper.getScenarioRangeLower(campaignObj, scenarioIndex), //TODO - Need to handle more than one scenario later. Hence using the first index of array as of now.
        's_upper': serviceHelper.getScenarioRangeUpper(campaignObj, scenarioIndex), //TODO - Need to handle more than one scenario later. Hence using the first index of array as of now.
        'repeat_rwd_type': serviceHelper.convertScenarioBenefitTriggerTypeToDBvalue(serviceHelper.getBenefitTriggerFrequencyType(campaignObj, scenarioIndex)),
        //'repeat_rwd_multiple': serviceHelper.convertIsMultipleScenarioTriggerAllowedToDBvalue(serviceHelper.getIsMultipleScenarioTriggerAllowed(campaignObj)),
        's_reset': serviceHelper.convertCounterResetTypeToDBvalue(serviceHelper.getCounterResetType(campaignObj, scenarioIndex)),
        'rfm_discount_amount': serviceHelper.getScenarioFixedAmount(campaignObj, scenarioIndex),
        'rfm_discount_percent': serviceHelper.getScenarioPercentage(campaignObj, scenarioIndex),
        'rfm_discount_type': serviceHelper.convertDiscountTypeToDBvalue(serviceHelper.getScenarioDiscountType(campaignObj, scenarioIndex)),
        'last_update_by': 1,
        'status': 'E0'
    };

    // this is the case with driverType "Frequency"
    var multiple = serviceHelper.convertIsMultipleScenarioTriggerAllowedToDBvalue(serviceHelper.getIsMultipleScenarioTriggerAllowed(campaignObj));
    if(multiple !== ''){
        scenarioData.repeat_rwd_multiple = multiple;
    }

    d.resolve(scenarioData);
    return d.promise;
};

/**
 * Construct object for SCENARIO_MESSAGES table
 * @param scenarioId - scenario Id
 * @param campaignObj - request campaign object
 * @returns scenario data to DB table
 */
campaignService.constructScenarioMessagesTableObj = function (scenarioId, campaignObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructScenarioMessagesTableObj', 'Construct object for SCENARIO_MESSAGES table');

    var scenarioIndex = 0;

    var msg = serviceHelper.getScenarioReceiptMessage(campaignObj, scenarioIndex);
    var receipt = msg.messages;
    var scenarioMessagesData;

    if (receipt && receipt.length > 0) {
        //Construct data object
        scenarioMessagesData = {
            'scenario_id': scenarioId,
            'msg_line1': receipt[0].message,
            'bold1': receipt[0].bold,
            'msg_line2': receipt[1].message,
            'bold2': receipt[1].bold,
            'msg_line3': receipt[2].message,
            'bold3': receipt[2].bold,
            'msg_line4': receipt[3].message,
            'bold4': receipt[3].bold,
            'msg_line5': receipt[4].message,
            'bold5': receipt[4].bold,
            'msg_line6': receipt[5].message,
            'bold6': receipt[5].bold,
            'msg_line7': receipt[6].message,
            'bold7': receipt[6].bold,
            'msg_line8': receipt[7].message,
            'bold8': receipt[7].bold,
            'last_update_by': 1,
            'status': 'E0',
            'display_flag': serviceHelper.convertReceiptPrintingTypeToDBvalue(serviceHelper.getReceiptPrintingType(campaignObj, scenarioIndex)),
            'oe_ver': 1
        };
    }

    d.resolve(scenarioMessagesData);
    return d.promise;
};

/**
 * Construct object for CAMPAIGN_EVENTS table
 * @param campaignId
 * @param campaignObj
 * @returns {promise|*}
 */
campaignService.constructCampaignEventsTableObj = function (campaignId, campaignObj) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructCampaignEventsTableObj', 'Construct object for CAMPAIGN_EVENTS table');

    var campaignEventsData;

    var eventDaysArr = commonUtil.getNestedPropertyValue(campaignObj, 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.eventDays');
    if (eventDaysArr && eventDaysArr.length > 0) {
        campaignEventsData = {
            'campaign_id': campaignId,
            'campaign_type': '',
            'event_cpg_day1': eventDaysArr[0],
            'event_cpg_day2': eventDaysArr[1],
            'event_cpg_day3': eventDaysArr[2],
            'event_cpg_day4': eventDaysArr[3],
            'event_cpg_day5': eventDaysArr[4],
            'event_cpg_day6': eventDaysArr[5],
            'event_cpg_day7': eventDaysArr[6],
            'event_cpg_day8': eventDaysArr[7],
            'rec_cpg_start_time': '',
            'rec_cpg_end_time': '',
            'rec_cpg_dow': '',
            'rec_cpg_day1': '',
            'rec_cpg_day2': '',
            'welcome_cpg_period': '',
            'bday_cpg_days_bef': '',
            'bday_cpg_days_aft': '',
            'last_update_by': 1,
            'bday_cpg_month': 0
        };
    }

    d.resolve(campaignEventsData);
    return d.promise;
};

/**
 * Construct create campaign response
 * @param campaignObj - request campaign object
 * @param campaignId - campaign Id
 * @returns scenario data to DB table
 */
campaignService.constructCreateCampaignResponse = function (campaignObj, campaignId) {
    var d = Q.defer();
    logger.msg('INFO', 'campaignService', '', '', 'constructCreateCampaignResponse', 'Construct create campaign response');

    var campaignRequestParameters = {};
    campaignRequestParameters.campaignId = campaignId;
    campaignRequestParameters.isSingleResult = true;
    campaignRequestParameters.action = 'campaignById';
    campaignService.getRelatedCampaignsResponseData(campaignRequestParameters)
    .then(function(respCampaignObj) {
            d.resolve(respCampaignObj);
        }, function (err) {
            d.reject(err);
        });

    return d.promise;
};

/**
 * Format the response of campaigns based on the format parameter.
 * At the moment, only JSON is required.
 * @param inFormat - format of the response: 'JSON', etc
 * @param inArrayCampaigns - Array of campaign object
 * @returns Campaign Response object
 */
campaignService.formatArrayCampaignsForResponse = function(inFormat, inArrayCampaigns){
  logger.msg('INFO', 'campaignService', '', '', 'formatArrayCampaignsForResponse', 'Formatting Array campaigns for response payload');

  if(inFormat === 'JSON'){
      return inArrayCampaigns;
  }

  return '';
};

/**
 * Construct Array of message object
 * @param scenario - scenario object
 * @returns Array of message object
 */
campaignService.constructReceiptMessagesResponse = function(scenario){
    logger.msg('INFO', 'campaignService', '', '', 'constructReceiptMessagesResponse', 'Constructing Scenario messages');

    var arrayMessages = [];

    arrayMessages.push(serviceHelper.constructMessageResponse(1, scenario.msg_line1, scenario.bold1));
    arrayMessages.push(serviceHelper.constructMessageResponse(2, scenario.msg_line2, scenario.bold2));
    arrayMessages.push(serviceHelper.constructMessageResponse(3, scenario.msg_line3, scenario.bold3));
    arrayMessages.push(serviceHelper.constructMessageResponse(4, scenario.msg_line4, scenario.bold4));
    arrayMessages.push(serviceHelper.constructMessageResponse(5, scenario.msg_line5, scenario.bold5));
    arrayMessages.push(serviceHelper.constructMessageResponse(6, scenario.msg_line6, scenario.bold6));
    arrayMessages.push(serviceHelper.constructMessageResponse(7, scenario.msg_line7, scenario.bold7));
    arrayMessages.push(serviceHelper.constructMessageResponse(8, scenario.msg_line8, scenario.bold8));

    return arrayMessages;
  };

  /**
   * Construct discount benefit details object
   * @param inCampaignAwardType - type of award: Pool, Coupon, Multiplier, Discount
   * @param inAwardDetail - campaign award object based on the type of campaign Award:
   *                             - Discount object: type, amount
   * @returns basic award response object
   */
campaignService.constructDiscountBenefitDetailResponse = function(inAwardDetail){
    logger.msg('INFO', 'campaignService', '', '', 'constructDiscountBenefitDetailResponse', 'Construct discount benefit details object');

    var discount = {};

    discount.discountType = serviceHelper.convertAwardValueType(inAwardDetail.type);
    if(inAwardDetail.type === 'F') {
        discount.discountFixedAmount = inAwardDetail.amount;
    }
    else {
        discount.discountPercentage = inAwardDetail.amount;
    }

    return discount;
};
/**
 * Construct Rfm Scenario details object
 * @param inCampaign - campaign db object
 * @param inDbResult - Data retrieved from Database
 * @returns Array of Scenario response object
 */
campaignService.constructRfmScenarioDetailResponse = function(inCampaign, inDbResult){
    logger.msg('INFO', 'campaignService', '', '', 'constructRfmScenarioDetailResponse', 'constructing rfm scenarios');
    var scenarios = inDbResult.scenarios;
    var rfmScenarios = [];
    var scenario;

    for(var i=0; i<scenarios.length; i++){
      if(scenarios[i].campaign_id === inCampaign.campaign_id){
        scenario = scenarios[i];
        var sc = {};

        sc.scenarioNumber = scenario.scenario_index;

          switch(inCampaign.campaign_type){
              case constants.DB_CAMPAIGN_TYPE_FREQUENCY:
                  sc.visitSlab = {};
                  sc.visitSlab.lower = scenario.s_lower;
                  sc.visitSlab.upper = scenario.s_upper;
                  break;
              case constants.DB_CAMPAIGN_TYPE_AMOUNT:
                  sc.purchaseAmountSlab = {};
                  sc.purchaseAmountSlab.lower = scenario.s_lower;
                  sc.purchaseAmountSlab.upper = scenario.s_upper;
                  break;
          }

        sc.counterResetType = serviceHelper.convertScenarioReset(scenario.s_reset);

        sc.benefitDetails = {};
        sc.benefitDetails.benefitTriggerFrequencyType = serviceHelper.convertScenarioRepeatRewardType(scenario.repeat_rwd_type);

        // build the object for basic award detail
        var discountDetail = {};
        discountDetail.type = scenario.rfm_discount_type;
        if(scenario.rfm_discount_type === 'F') {
          discountDetail.amount = scenario.rfm_discount_amount;
        }
        else {
          discountDetail.amount = scenario.rfm_discount_percent;
        }

        if(inCampaign.campaign_subtype){
            sc.benefitDetails.discountBenefitDetails = campaignService.constructDiscountBenefitDetailResponse(discountDetail);
        }
        // TODO: else for awardBenefitsDetails


        //message
        sc.scenarioMessageDetails = {};
        sc.scenarioMessageDetails.messageChannelType = [];

        //Load SMS
        if(scenario.sms_message_iid){
            sc.scenarioMessageDetails.smsMessage = scenario.sms_content;
            sc.scenarioMessageDetails.messageChannelType.push(constants.MESSAGE_CHANNEL_TYPE_SMS);
        }

        //Load Receipt
        if (scenario.scenario_message_iid) {
            sc.scenarioMessageDetails.receiptMessageDetails = {};
            sc.scenarioMessageDetails.receiptMessageDetails.receiptPrintingType = serviceHelper.convertDisplayFlagToReceiptPrintingType(scenario.display_flag);
            sc.scenarioMessageDetails.receiptMessageDetails.receiptMessages = campaignService.constructReceiptMessagesResponse(scenario);
            sc.scenarioMessageDetails.messageChannelType.push(constants.MESSAGE_CHANNEL_TYPE_RECEIPT);
        }

        rfmScenarios.push(sc);
      }
    }

    return rfmScenarios;
  };

/**
 * Constructing basic scenario
 * @param inCampaign
 * @param inDbResult
 * @returns Basic scenario detail response
 */
campaignService.constructBasicScenarioDetailResponse = function(inCampaign, inDbResult){
    logger.msg('INFO', 'campaignService', '', '', 'constructBasicScenarioDetailResponse', 'Constructing basic scenario');
    /*TODO - JSHint error for too many statements should not be supressed*/
    /*jshint -W071 */
    var scenarioDetails = {}, basicScenarioDetails = {};
    var events = inDbResult.events, event = {}, eventDays = [], benefitDetails = {}, scenarios = inDbResult.scenarios, scenario = {};
    var scenarioMessageDetails = {};

    //Build eventDays
    for(var j=0; j<events.length; j++){
        if(events[j].campaign_id === inCampaign.campaign_id){
            event = events[j];
            break;
        }
    }
    if (event.event_cpg_day1) {eventDays.push(event.event_cpg_day1);}
    if (event.event_cpg_day2) {eventDays.push(event.event_cpg_day2);}
    if (event.event_cpg_day3) {eventDays.push(event.event_cpg_day3);}
    if (event.event_cpg_day4) {eventDays.push(event.event_cpg_day4);}
    if (event.event_cpg_day5) {eventDays.push(event.event_cpg_day5);}
    if (event.event_cpg_day6) {eventDays.push(event.event_cpg_day6);}
    if (event.event_cpg_day7) {eventDays.push(event.event_cpg_day7);}
    if (event.event_cpg_day8) {eventDays.push(event.event_cpg_day8);}

    //Build benefitDetails
    for(var i=0; i<scenarios.length; i++) {
        if (scenarios[i].campaign_id === inCampaign.campaign_id) {
            scenario = scenarios[i];
        }
    }
    benefitDetails.benefitTriggerFrequencyType = serviceHelper.convertScenarioRepeatRewardType(scenario.repeat_rwd_type);

    //Build basic award detail
    if (inCampaign.campaign_subtype === constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT) {
        var discountDetail = {};
        discountDetail.type = inCampaign.discount_amount ? 'F' : 'P';
        if (discountDetail.type === 'F') {
            discountDetail.amount = inCampaign.discount_amount;
        }
        else {
            discountDetail.amount = inCampaign.discount_percent;
        }
        benefitDetails.discountBenefitDetails = campaignService.constructDiscountBenefitDetailResponse(discountDetail);
    }

    //Build Receipt
    if (scenario.scenario_message_iid) {
        scenarioMessageDetails.receiptMessageDetails = {};
        scenarioMessageDetails.messageChannelType = [];
        scenarioMessageDetails.receiptMessageDetails.receiptPrintingType = serviceHelper.convertDisplayFlagToReceiptPrintingType(scenario.display_flag);
        scenarioMessageDetails.receiptMessageDetails.receiptMessages = campaignService.constructReceiptMessagesResponse(scenario);
        scenarioMessageDetails.messageChannelType.push(constants.MESSAGE_CHANNEL_TYPE_RECEIPT);
    }

    basicScenarioDetails.eventDays = eventDays;
    basicScenarioDetails.benefitDetails = benefitDetails;
    basicScenarioDetails.scenarioMessageDetails = scenarioMessageDetails;

    //Build basicScenarioDetails
    scenarioDetails.basicScenarioDetails = basicScenarioDetails;

    return scenarioDetails;
};

/**
 * Construct RFM campaign details object
 * @param inCampaignId - campaign Id
 * @param inDbResult - Data retrieved from Database
 * @returns Rfm campaign detail object
 */
campaignService.constructRfmCampaignDetailResponse = function(inCampaign, inDbResult){

    logger.msg('INFO', 'campaignService', '', '', 'constructRfmCampaignDetailResponse', 'constructing rfm campaign details :: campaign_id - ' + inCampaign.campaign_id);

    var campaigns = inDbResult.campaigns;
    var campaign;

    for(var j=0; j<campaigns.length; j++){
      if(campaigns[j].campaign_id === inCampaign.campaign_id){
        campaign = campaigns[j];
        break;
      }
    }

    var rfmDetail = {};
    rfmDetail.counterOverrideType = serviceHelper.convertCounterConfiguration(campaign.override);
    rfmDetail.counterResetDetails = {};
    rfmDetail.counterResetDetails.counterResetType = serviceHelper.convertCampaignCounterResetType(campaign.expiry_type);
    rfmDetail.counterResetDetails.noOfDaysFromTransactionDateToResetCounter = campaign.expiry_days;
    rfmDetail.counterResetDetails.noOfMonthsFromTransactionDateToResetCounter = campaign.expiry_months;

    switch(campaign.campaign_type){
        case constants.DB_CAMPAIGN_TYPE_FREQUENCY:
            rfmDetail.frequencyDriverScenariosAndBenefitsDetails = campaignService.constructRfmScenarioDetailResponse(campaign, inDbResult);
            break;
        case constants.DB_CAMPAIGN_TYPE_AMOUNT:
            rfmDetail.isMultipleScenarioTriggerAllowed = serviceHelper.getIsMultipleScenarioTriggerAllowed(campaign.repeat_rwd_multiple);
            rfmDetail.isAwardTriggeredAgainAfterCounterReset  = serviceHelper.convertIsAwardTriggeredAgainAfterCounterReset(campaign.pnt_partial_reset);
            rfmDetail.isCascadedAwardTriggered = serviceHelper.convertIsCascadedAwardTriggered(campaign.pnt_cascade_cpns);
            rfmDetail.amountDriverScenariosAndBenefitsDetails = campaignService.constructRfmScenarioDetailResponse(campaign, inDbResult);
            break;
    }

        return rfmDetail;

  };

campaignService.constructEventCampaignDetailResponse = function(inCampaign, inDbResult){
    logger.msg('INFO', 'campaignService', '', '', 'constructEventCampaignDetailResponse', 'Constructing event campaign details');

    var eventDetail = {};

    eventDetail.eventDayDriverScenariosAndBenefitsDetails = campaignService.constructBasicScenarioDetailResponse(inCampaign, inDbResult);

    return eventDetail;
};

/**
 * Conctruct Campaign Definition based on campaign type
 * @param inCampaignTypeDb - campaign type in DB
 * @param inCampaignId - campaign Id
 * @param inDbResult - Data retrieved from Database
 * @returns campaign detail object
 */
campaignService.constructDriverAndBenefitDetails = function(inCampaign, inDbResult){
    logger.msg('INFO', 'campaignService', '', '', 'constructDriverAndBenefitDetails', 'constructing campaigns based on campaign type in db');
      var campaignDef = {};
      var tag = '';

      switch(inCampaign.campaign_type){
        case constants.DB_CAMPAIGN_TYPE_FREQUENCY:
            campaignDef.frequencyDriverAndBenefitsDetails = campaignService.constructRfmCampaignDetailResponse(inCampaign, inDbResult);
            break;

        case constants.DB_CAMPAIGN_TYPE_AMOUNT:
            campaignDef.amountDriverAndBenefitsDetails = campaignService.constructRfmCampaignDetailResponse(inCampaign, inDbResult);
          break;

        case constants.DB_CAMPAIGN_TYPE_EVENT:
          campaignDef.eventDayDriverAndBenefitsDetails = campaignService.constructEventCampaignDetailResponse(inCampaign, inDbResult);
          break;

        default: campaignDef = {CampaignTODO: 'TODOCampaign'};
      }

      return campaignDef;
  };

/**
 * Construct Array of Campaign Response object from database.
 * @param dbResult - Data retrieved from Database
 * @param inSingleCampaign - true/false to indicate the result as array or a single object
 * @returns Array of campaign object or a single campaign object
 */
campaignService.constructCampaignsResponse = function(dbResult, inSingleCampaign){

    logger.msg('INFO', 'campaignService', '', '', 'constructCampaignsResponse', 'Construct campaign response');

    var arrayCampaignObject = [];
    var campaigns = dbResult.campaigns;
    var campaign;
    var m = moment();

    for(var i=0; i<campaigns.length; i++){
        campaign = campaigns[i];

        var cr = {};
        cr.campaignId = campaign.campaign_id;
        cr.name = campaign.campaign_name;
        cr.startDate = serviceHelper.constructDateByFormat(campaign.start_date, constants.DATEFORMAT_YYYYMMDD);
        cr.endDate = serviceHelper.constructDateByFormat(campaign.end_date, constants.DATEFORMAT_YYYYMMDD);
        cr.minimumPurchaseAmount = campaign.min_purchase;
        cr.maximumPurchaseAmount = campaign.max_purchase;
        cr.ownerType = serviceHelper.convertOwnerTypeForResponse(campaign.owner_type);
        if (campaign.owner_id) {
            cr.ownerId = campaign.owner_id;
        }
        cr.triggerFrequencyType = serviceHelper.convertCampaignAcceptedFrequency(campaign.accepted_freq);
        cr.shortDescription = campaign.description ? campaign.description : '';
        cr.driverType = serviceHelper.convertCampaignTypeForResponse(campaign.campaign_type);
        cr.benefitType = serviceHelper.convertCampaignSubTypeForResponse(campaign.campaign_subtype);
        cr.isSubscribableToServeralMerchants = serviceHelper.convertMerchantCampaignTypeForResponse(campaign.mono_merchant);
        cr.isSubscribableToHostAndVirtualTerminals = serviceHelper.convertMerchantHostAndVirtualTerminalForResponse(campaign.available_for_vt);
        cr.imageUrl = campaign.referencelogo ? campaign.referencelogo : '';
        cr.mobileMessage = campaign.mobile_message ? campaign.mobile_message : '';
        cr.status = serviceHelper.convertCampaignActiveStatus(campaign.status);
        cr.driverAndBenefitsDetails = campaignService.constructDriverAndBenefitDetails(campaign, dbResult);

        // cr.benefitCappingDetails
        // cr.benefitLiabilityDetails
        // cr.paymentCardBrand
        // cr.campaignFilters
        // cr.createdBy
        // cr.createdDateTime
        cr.lastUpdatedBy = campaign.last_update_by;
        cr.lastUpdatedDateTime = campaign.last_update_date;
        // cr.links


        arrayCampaignObject.push(cr);
    }

    // return as array or a single object
    if(inSingleCampaign === true) {
        return arrayCampaignObject[0];
    }
    else {
        return arrayCampaignObject;
    }
};

/**
 * validate all query string in GET campaigns request
 * @param inRequest - request object
 * @returns error array
 */
//TODO - unused, may be removed later and child methods also.
campaignService.validateGetCampaignsRequestQuery = function(inRequest){
    logger.msg('INFO', 'campaignService', '', '', 'validateGetCampaignsRequestQuery', 'validate all query string in GET campaigns request');
    var d = Q.defer();
    var errorArray = [];

    serviceHelper.validateRequestQuery_ownerType(inRequest.query.ownerType, errorArray)
        .then(function(errorArray) {
            return serviceHelper.validateRequestQuery_status(inRequest.query.status, errorArray);
        })
        .then(function(errorArray){
            logger.msg('INFO', 'campaignService', '', '', 'validateGetCampaignsRequestQuery', 'errorArray=' + JSON.stringify(errorArray));
            d.resolve(errorArray);
        }, function(err){
            logger.msg('INFO', 'campaignService', '', '', 'validateGetCampaignsRequestQuery', 'error=' + err.stack);
            d.reject;
        });

    return d.promise;
};

/**
 * construct parameter request to use in campaign model. All values are converted into DB value.
 * Examples:
 * If status=Active, get all campaigns with status active
 * If status=Active,Deleted, get all campaigns which matching both status active and deleted
 * If status=Active,abc, ignore wrong status 'abc' and get all campaigns with status active
 * It is same as above for parameters 'driverType' and 'ownerType'
 * If merchantId is non-numeric, response should be empty array []
 *
 * @param inRequest - request object
 * @returns campaign parameters for DB
 */
campaignService.constructRequestParameterDBFromGetCampaignsRequestQuery = function(inRequest){

    var campaignRequestParameters = {};

    //default value is All for undefined, null, empty or wrong value of parameter (status, driverType, ownerType)
    campaignRequestParameters.status = constants.STATUS_ALL;
    campaignRequestParameters.driverType = constants.STR_ALL;
    campaignRequestParameters.ownerType = constants.STR_ALL;

    //As campaignModel.getCampaigns is reused by 3 APIs,
    // this is true for deleteCampaign and getCampaignByCampaignId
    campaignRequestParameters.isSingleResult = false;

    var merchantId = inRequest.query.merchantId;
    merchantId = merchantId ? merchantId.trim() : merchantId; //Do not trim if merchantId is undefined
    if (merchantId) {
        campaignRequestParameters.merchantId = merchantId;
    }

    var ownerType = inRequest.query.ownerType;
    ownerType = ownerType ? ownerType.trim() : ownerType; //Do not trim if ownerType is undefined
    // ownerType present
    if(ownerType) {
        var ownerTypeDbArr = [];
        var ownerTypeArr = ownerType.split(',');
        for (var i = 0; i < ownerTypeArr.length; i++) {
            if (serviceHelper.convertOwnerTypeStringToDbValue(ownerTypeArr[i].trim()) !== constants.STR_ALL) {
                ownerTypeDbArr.push('\''+serviceHelper.convertOwnerTypeStringToDbValue(ownerTypeArr[i].trim())+'\'');
            }
        }
        if(ownerTypeDbArr.length > 0) {
            campaignRequestParameters.ownerType = ownerTypeDbArr.toString();
        }
    }

    var status = inRequest.query.status;
    status = status ? status.trim() : status; //Do not trim if status is undefined
    // status present
    if(status) {
        var statusDbArr = [];
        var statusArr = status.split(',');
        for (var j = 0; j < statusArr.length; j++) {
            if (serviceHelper.convertStatusStringToDbValue(statusArr[j].trim()) !== constants.STATUS_ALL) {
                statusDbArr.push('\''+serviceHelper.convertStatusStringToDbValue(statusArr[j].trim())+'\'');
            }
        }
        if(statusDbArr.length > 0) {
            campaignRequestParameters.status = statusDbArr.toString();
        }
    }

    var driverType = inRequest.query.driverType;
    driverType = driverType ? driverType.trim() : driverType; //Do not trim if driverType is undefined
    // driverType present
    if(driverType) {
        var driverTypeDbArr = [];
        var driverTypeArr = driverType.split(',');
        for (var k = 0; k < driverTypeArr.length; k++) {
            if (serviceHelper.convertDriverTypeToDbValue(driverTypeArr[k].trim()) !== constants.STR_ALL) {
                driverTypeDbArr.push('\''+serviceHelper.convertDriverTypeToDbValue(driverTypeArr[k].trim())+'\'');
            }
        }
        if(driverTypeDbArr.length > 0) {
            campaignRequestParameters.driverType = driverTypeDbArr.toString();
        }
    }

    return campaignRequestParameters;
};
