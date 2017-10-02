'use strict';
/**
 * Utility module that allows the following:
 *
 */

function commonUtil() {
}

module.exports = commonUtil;

var logger = require('./logUtil');
var constants = require('./constants');
var Q = require('q');
var util = require('util');
var moment = require('moment');
var Validator = require('jsonschema').Validator;
var baseSchema = require('../schema/baseSchema');
var frequencyDriverSchema = require('../schema/frequencyDriverSchema');
var eventDayDriverSchema = require('../schema/eventDayDriverSchema');
var amountDriverSchema = require('../schema/amountDriverSchema');
var statisticsSchema = require('../schema/statisticsSchema');
var async = require('async');
var httpStatus = require('http-status');
var unset = require('object-unset');

/**
 * Construct error JSON structure
 * @param errorCode
 * @param fieldName
 * @param fieldValue
 * @param errorMessage
 * @returns {d.promise} - Error response in JSON
 */
commonUtil.constructErrorJSONStructure = function (errorCode, fieldName, fieldValue, errorMessage) {
    var d = Q.defer();

    var url = constants.HELP_URL + errorCode + '#' + fieldName;

    var errorJSON = {
        errorCode: errorCode,
        field: fieldName,
        originalValue: fieldValue,
        errorMessage: errorMessage.capitalizeFirstLetter(),
        helpUrl: url
    };
    d.resolve(errorJSON);

    return d.promise;
};

/**
 * Send response with body
 * @param res
 * @param httpCode
 * @param renderingContent
 */
commonUtil.sendResponse = function (res, httpCode, renderingContent) {
    commonUtil.constructCommonResponseHeader(res, httpCode)
        .then(function (res) {
            res.status(httpCode);
            res.end(JSON.stringify(renderingContent, null, 2));
        });

};

/**
 * Send response without body
 * @param res
 * @param httpCode
 */
commonUtil.sendResponseWoBody = function (res, httpCode) {
    commonUtil.constructCommonResponseHeader(res, httpCode)
        .then(function (res) {
            res.status(httpCode);
            res.end();
        });

};

/**
 * Prepare href
 * @param req
 * @param resource
 * @param id
 * @returns {string}
 */
commonUtil.prepareHref = function (req, resource, id) {
    //req.originalUrl.substring(0, 4) returns /v1/ or /v2/
    var protocol = (req) ? req.protocol : ''; // http
    var host = (req) ? req.get('host') : ''; // localhost:8001
    var originalUrl = (req) ? req.originalUrl.substring(0, 4) : ''; // /v1/
    var fullUrl = protocol + '://' + host + originalUrl;
    return fullUrl + resource + '/' + id;
};

/**
 * Store href with replaceable strings
 * @param resource
 * @param id
 * @returns {string}
 */
commonUtil.storeHref = function (resource, id) {
    var fullUrl = '<base_url>' + '<version>';
    return fullUrl + resource + '/' + id;
};

/**
 * Replace href with correct value in the input href
 * @param req
 * @param href
 * @returns {*}
 */
commonUtil.replaceHref = function (req, href) {
    var config = require('nconf').file({file: 'config/config.json'});
    //Replace base_url, version with correct values
    var version = (req) ? req.originalUrl.substring(0, 4) : ''; // /v1/
    var replacedBaseUrl = href.replace('<base_url>', config.get('hrefBaseUrl')); // http://localhost:8001
    var replacedVersionHref = replacedBaseUrl.replace('<version>', version);
    return replacedVersionHref;
};

/**
 * Replace href globally with correct value in the input JSON
 * @param req
 * @param inputJSON
 * @returns {*}
 */
commonUtil.replaceHrefGlobally = function (req, inputJSON) {
    var config = require('nconf').file({file: 'config/config.json'});
    //Replace base_url, version with correct values
    var version = (req) ? req.originalUrl.substring(0, 4) : ''; // /v1/
    var str = JSON.stringify(inputJSON);
    var baseUrlReplacedStr = str.replace(/<base_url>/g, config.get('hrefBaseUrl')); //replace base_url globally
    var versionReplacedStr = baseUrlReplacedStr.replace(/<version>/g, version); //replace version globally
    var outputJSON = JSON.parse(versionReplacedStr); //convert back to array
    return outputJSON;
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

commonUtil.getCurrentDateInUTCFormat = function () {
    return moment.utc().format(constants.AUDIT_TRAIL_DATE_FORMAT);
};

/**
 * Get current date in local timezone (without time component)
 * @returns {*}
 */
commonUtil.getCurrentDateInLocalTimezoneWithoutTime = function () {
    return moment().format(constants.DATE_FORMAT);
};

/**
 * Get current date in local timezone
 * @returns {*}
 */
commonUtil.getCurrentDateInLocalTimezone = function () {
    return moment().format(constants.AUDIT_TRAIL_DATE_FORMAT);
};

/**
 * Convert date format
 * @param source
 * @param sourceFormat
 * @param targetFormat
 * @returns {*}
 */
commonUtil.convertDateFormat = function (source, sourceFormat, targetFormat) {
    return moment(source, sourceFormat).format(targetFormat);
};

/**
 * Utility to validate request data against schema definition
 * @param reqData
 * @param schema
 * @returns {d.promise}
 */
commonUtil.validateSchema = function (reqData, schema) {
    var d = Q.defer();
    var v = new Validator();
    logger.msg('INFO', 'commonUtil', '', '', 'validateSchema', 'request data - ' + reqData);

    /*jshint -W071 */
    //Add sub schemas if necessary
    if (schema.id === '/campaign') {
        //if request body is empty or driverType missing or benefitType missing
        if (!reqData || !reqData.driverType || !reqData.benefitType) {
            v.addSchema(baseSchema.dummyDriverAndBenefitsDetailsSchemaDef, '/driverAndBenefitsDetails');
        } else if (reqData.driverType === constants.DRIVER_TYPE_AMOUNT) {
            v.addSchema(amountDriverSchema.driverAndBenefitsDetailsSchemaDef, '/driverAndBenefitsDetails');
            v.addSchema(amountDriverSchema.amountDriverAndBenefitsDetailsSchemaDef, '/amountDriverAndBenefitsDetails');
            v.addSchema(baseSchema.counterResetDetailsSchemaDef, '/counterResetDetails');
            v.addSchema(amountDriverSchema.amountDriverScenariosAndBenefitsDetailsSchemaDef, '/amountDriverScenariosAndBenefitsDetails');
            v.addSchema(amountDriverSchema.purchaseAmountSlabSchemaDef, '/purchaseAmountSlab');
            v.addSchema(baseSchema.benefitDetailsSchemaDef, '/benefitDetails');
            if (reqData.benefitType === constants.BENEFIT_TYPE_DISCOUNT) {
                v.addSchema(baseSchema.discountBenefitDetailsSchemaDef, '/discountBenefitDetails');
            } else {
                v.addSchema(baseSchema.dummyBenefitDetailsSchemaDef, '/discountBenefitDetails');
            }
            v.addSchema(baseSchema.scenarioMessageDetailsSchemaDef, '/scenarioMessageDetails');
            v.addSchema(baseSchema.receiptMessageDetailsSchemaDef, '/receiptMessageDetails');
            v.addSchema(baseSchema.receiptMessagesSchemaDef, '/receiptMessages');
        } else if (reqData.driverType === constants.DRIVER_TYPE_FREQUENCY) {
            v.addSchema(frequencyDriverSchema.driverAndBenefitsDetailsSchemaDef, '/driverAndBenefitsDetails');
            v.addSchema(frequencyDriverSchema.frequencyDriverAndBenefitsDetailsSchemaDef, '/frequencyDriverAndBenefitsDetails');
            v.addSchema(baseSchema.counterResetDetailsSchemaDef, '/counterResetDetails');
            v.addSchema(frequencyDriverSchema.frequencyDriverScenariosAndBenefitsDetailsSchemaDef,
                '/frequencyDriverScenariosAndBenefitsDetails');
            v.addSchema(frequencyDriverSchema.visitSlabSchemaDef, '/visitSlab');
            v.addSchema(baseSchema.benefitDetailsSchemaDef, '/benefitDetails');
            if (reqData.benefitType === constants.BENEFIT_TYPE_DISCOUNT) {
                v.addSchema(baseSchema.discountBenefitDetailsSchemaDef, '/discountBenefitDetails');
            } else {
                v.addSchema(baseSchema.dummyBenefitDetailsSchemaDef, '/discountBenefitDetails');
            }
            v.addSchema(baseSchema.scenarioMessageDetailsSchemaDef, '/scenarioMessageDetails');
            v.addSchema(baseSchema.receiptMessageDetailsSchemaDef, '/receiptMessageDetails');
            v.addSchema(baseSchema.receiptMessagesSchemaDef, '/receiptMessages');
        } else if (reqData.driverType === constants.DRIVER_TYPE_EVENT_DAY) {
            v.addSchema(eventDayDriverSchema.driverAndBenefitsDetailsSchemaDef, '/driverAndBenefitsDetails');
            v.addSchema(eventDayDriverSchema.eventDayDriverAndBenefitsDetailsSchemaDef, '/eventDayDriverAndBenefitsDetails');
            v.addSchema(eventDayDriverSchema.eventDayDriverScenariosAndBenefitsDetailsSchemaDef, '/eventDayDriverScenariosAndBenefitsDetails');
            v.addSchema(eventDayDriverSchema.basicScenarioDetailsSchemaDef, '/basicScenarioDetails');
            v.addSchema(baseSchema.benefitDetailsSchemaDef, '/benefitDetails');
            if (reqData.benefitType === constants.BENEFIT_TYPE_DISCOUNT) {
                v.addSchema(baseSchema.discountBenefitDetailsSchemaDef, '/discountBenefitDetails');
            } else {
                v.addSchema(baseSchema.dummyBenefitDetailsSchemaDef, '/discountBenefitDetails');
            }
            v.addSchema(baseSchema.scenarioMessageDetailsSchemaDef, '/scenarioMessageDetails');
            v.addSchema(baseSchema.receiptMessageDetailsSchemaDef, '/receiptMessageDetails');
            v.addSchema(baseSchema.receiptMessagesSchemaDef, '/receiptMessages');
        } else {
            v.addSchema(baseSchema.dummyDriverAndBenefitsDetailsSchemaDef, '/driverAndBenefitsDetails');
        }
    } else if (schema.id === '/campaignStatistics') {
        v.addSchema(statisticsSchema.periodSchemaDef, '/period');
    } else if (schema.id === '/merchantStatistics') {
        v.addSchema(statisticsSchema.periodSchemaDef, '/period');
    }

    var result = '' + v.validate(reqData, schema);
    d.resolve(result);
    return d.promise;
};

/**
 * Get field name from error msg (instance additionalProperty "long123" exists in instance when not allowed) Eg: lat
 * @param errObj
 * @returns {*}
 */
commonUtil.getFieldName = function (errObj) {
    var tempFieldArr = errObj.split(' '); //eg: 0: instance additionalProperty "long123" exists in instance when not allowed
    var fieldName = tempFieldArr[3]; //"long123"
    fieldName = fieldName.substr(1, fieldName.length - 2); //Remove quotes
    return fieldName;
};

/**
 * Get parent field name from error msg
 * @param errObj
 * @returns {*}
 */
commonUtil.getParentFieldName = function (errObj) {
    if (errObj.includes('instance.')) {
        // This means that additional properties are inside a nested object(or block)
        var temp = errObj.split('instance.').pop(); //Returns the right most value in a string separated
        var tempFieldArr = temp.split(' ');
        return tempFieldArr[0];
    } else {
        // This means that additional properties are not inside a object
        return '';
    }

};

/**
 * Utility to validate additional properties
 * @param reqBody
 * @param schema
 * @returns {d.promise}
 */
commonUtil.validateAdditionalProperties = function (reqBody, schema) {
    var d = Q.defer();
    commonUtil.validateSchema(reqBody, schema)
        .then(function (result) {
            if (result.trim() === '') {
                d.resolve(reqBody);
            } else {
                var schemaResult = result.split('\n');
                async.eachSeries(schemaResult, function (errorObject, callback) {

                    //Check if schemaResult contains any error for additional property
                    if (errorObject.indexOf('additionalProperty') > 0) {
                        var fieldName = commonUtil.getFieldName(errorObject);
                        var parentFieldName = commonUtil.getParentFieldName(errorObject);
                        if (parentFieldName !== '') {
                            // This means that additional properties are inside an object
                            let temp = parentFieldName + '.' + fieldName;
                            unset(reqBody, temp);
                        } else {
                            // This means that additional properties are plain object
                            unset(reqBody, fieldName);
                        }
                        callback(null);
                    } else {
                        callback(null);
                    }
                });
                d.resolve(reqBody);
            }
        }, function (err) {
            d.reject(err);
        });
    return d.promise;
};

/**
 * Utility to trim the values for string elements in request body
 * @param reqBody
 * @returns {d.promise}
 */
commonUtil.trimRequestObject = function (reqBody) {
    var d = Q.defer();
    var reqObj = reqBody;
    //Trim field values
    for (var key in reqObj) {
        if (typeof reqObj[key] === 'string') {
            reqObj[key] = reqObj[key].trim();
        }
        /*jshint -W073 */
        //By passing JSHint error - Blocks are nested too deeply
        if (typeof reqObj[key] === 'object') {
            for (var key2 in reqObj[key]) {
                if (typeof reqObj[key][key2] === 'string') {
                    reqObj[key][key2] = reqObj[key][key2].trim();
                }
            }
        }
    }
    d.resolve(reqObj);
    return d.promise;
};

//Utility to parse the request body
//Takes care of the below,
//1. Removing elements (which are not defined in schema definition) from request body
//2. Trimming the string values in request body
commonUtil.parseRequestObject = function (reqObj, schema) {
    var d = Q.defer();
    commonUtil.validateAdditionalProperties(reqObj, schema)
        .then(function (respObj) {
            return commonUtil.trimRequestObject(respObj);
        })
        .then(function (parsedReqObj) {
            d.resolve(parsedReqObj);
        })
        .fail(function (err) {
            d.reject(err);
        });
    return d.promise;
};

/**
 * Utility to construct Common Response Header
 * @param res
 * @param httpCode
 * @returns {d.promise}
 */
commonUtil.constructCommonResponseHeader = function (res, httpCode) {
    var d = Q.defer();
    res.contentType(constants.CON_TYPE_UTF);
    res.header('Cache-Control', 'no-cache');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('X-FRAME-OPTIONS', 'deny');
    res.header('Server', 'Node JS / 6.1.0');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('X-WebKit-CSP', 'default-src self');
    res.header('X-Content-Type-Options', 'nosniff');

    /*sets the Cross-origin resource sharing (CORS) headers*/
    commonUtil.setCorsResponseHeaders(res)
        .then(function (res) {
            if (httpCode === httpStatus.UNAUTHORIZED) {
                res.writeHead(httpStatus.UNAUTHORIZED, {
                    'WWW-Authenticate': 'Basic realm=XLSCampaignAPI'
                });
            }
            d.resolve(res);
        });

    return d.promise;
};

/**
 * Utility to set Cross-origin resource sharing (CORS) headers
 * @param res
 * @returns {d.promise}
 */
commonUtil.setCorsResponseHeaders = function (res) {
    var d = Q.defer();

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type, accept, authorization, from');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    d.resolve(res);
    return d.promise;
};

/**
 * Fetch user id from input request header
 * @param req
 * @returns {d.promise}
 */
commonUtil.getUserIdFromRequest = function (req) {
    logger.msg('INFO', 'service', '', '', 'getUserIdFromRequest', 'Get userId from request header');
    var d = Q.defer();
    var userId = req.get(constants.REQ_HEADER_USER_ID);
    userId = userId ? userId.trim() : userId; //Do not trim if userId is undefined
    d.resolve(userId);
    return d.promise;
};

/**
 * Fetch include parameter in the request
 * @param req
 * @returns {d.promise}
 */
commonUtil.getIncludeParamFromRequest = function (req) {
    logger.msg('INFO', 'service', '', '', 'getIncludeParamFromRequest', 'Get include parameter from request');
    var d = Q.defer();
    var includeParam = req.query.include;
    includeParam = includeParam ? includeParam.trim().toUpperCase() : '';
    d.resolve(includeParam);
    return d.promise;
};

/**
 * Fetch expand parameter in the request
 * @param req
 * @returns {d.promise}
 */
commonUtil.getExpandParamFromRequest = function (req) {
    logger.msg('INFO', 'service', '', '', 'getExpandParamFromRequest', 'Get expand parameter from request');
    var d = Q.defer();
    var expandParam = req.query.expand;
    expandParam = expandParam ? expandParam.trim().toUpperCase() : '';
    d.resolve(expandParam);
    return d.promise;
};

/**
 * Fetch search parameter in the request
 * @param req
 * @returns {d.promise}
 */
commonUtil.getSearchParamFromRequest = function (req) {
    logger.msg('INFO', 'service', '', '', 'getSearchParamFromRequest', 'Get search parameter from request');
    var d = Q.defer();
    var searchParam = req.query.search;
    searchParam = searchParam ? searchParam.trim().toLowerCase() : '';
    d.resolve(searchParam);
    return d.promise;
};


/**
 * Read tenant code from file "config/authorizationConfig.json" by request authorization header.
 * Then, set the tenant code to global object of NodeJS, so that it can used any where without passing
 * as input parameter.
 *
 * @param req
 */
commonUtil.setTenantInfoToGlobal = function (req) {
    logger.msg('INFO', 'commonUtil', '', '', 'setTenantInfoToGlobal', 'Start');

    try {
        var authorization = req.get('Authorization');
        var authorizationConfig = require('nconf').file({file: 'config/authorizationConfig.json'});
        var apiKeyArray = authorizationConfig.get('keys');
        var apiKeyObj = apiKeyArray.find(obj => obj.key.value === authorization);
        var tenantCode = apiKeyObj.key.tenantCode;
        var tenantConfig = require('nconf').file({file: 'config/settingsTenant' + tenantCode + '.json'});
        var tenantInfo = tenantConfig.get('tenantConfig');
        global.tenantInfo = {};
        global.tenantInfo = tenantInfo;
    } catch (error) {
        logger.msg('ERROR', 'commonUtil', '', '', 'setTenantInfoToGlobal', 'Error occurred, ' + error.stack);
    }

    logger.msg('INFO', 'commonUtil', '', '', 'setTenantInfoToGlobal',
        'global.tenantInfo.tenantCode = ' + global.tenantInfo.tenantCode);
    logger.msg('INFO', 'commonUtil', '', '', 'setTenantInfoToGlobal', 'End');
};

/**
 * Get tenant code from global object of NodeJS
 *
 * @returns {*}
 */
commonUtil.getTenantInfoFromGlobal = function () {
    logger.msg('INFO', 'commonUtil', '', '', 'getTenantInfoFromGlobal', 'Start');
    return global.tenantInfo;
};

/**
 * Get nested property value if exists. Otherwize return undefined.
 * @param obj - Json Object containing the property.
 * @param key - key to search in obj, example: "test1.test2.test3"
 * @returns value if exist, or undefined if not exist
 */
commonUtil.getNestedPropertyValue = function (obj, key) {
    // Get property array from key string
    var properties = key.split('.');

    // Iterate through properties, returning undefined if object is null or property doesn't exist
    for (var i = 0; i < properties.length; i++) {
        if (!obj || !obj.hasOwnProperty(properties[i])) {
            return;
        }
        obj = obj[properties[i]];
    }

    // Nested property found, so return the value
    return obj;
};
