'use strict';


var logger = require('./logUtil');
var Validator = require('jsonschema').Validator;
var constants = require('./constants');
var Q = require('q');
var async = require('async');
var util = require('util');
var commonUtil = require('./commonUtil');
var baseSchema = require('../schema/baseSchema');
var statisticsSchema = require('../schema/statisticsSchema');

function jsonSchemaUtil() {
}

module.exports = jsonSchemaUtil;

//Get the field name Eg: campaignId
function getFieldName(errObj) {
    var tempFieldArr = errObj.split(' '); //eg: 0: instance.name does not meet maximum length of 50
    var fieldName = tempFieldArr[1].split('instance.').pop(); //Returns the right most value in a string separated
    return fieldName;
}

function getFieldValue(reqData, fieldName, errorObject) {
    // As there is a security risk,the below line needs to be refactored.
    var fieldValue = eval('reqData.' + fieldName);
    return fieldValue;

}

//validates request.body's JSON data against given schema definition
jsonSchemaUtil.validateSchema = function (reqData, schemaName) {
    var d = Q.defer();
    commonUtil.validateSchema(reqData, schemaName)
        .then(function (result) {
            if (result.trim() === '') {
                logger.msg('DEBUG', 'v1', '', 'jsonSchemaUtil', 'validateSchema', 'schema validation is passed');
                d.resolve(null);
            } else {
                logger.msg('DEBUG', 'v1', '', 'jsonSchemaUtil', 'validateSchema', 'schema validation is failed\n' + result);
                var schemaResult = result.split('\n');

                jsonSchemaUtil.constructErrorMessages(schemaName, reqData, schemaResult)
                    .then(function (errorArray) {
                        d.resolve(errorArray);
                    });
            }
        })
        .fail(function (err) {
            d.reject(err);
        });
    return d.promise;
};

jsonSchemaUtil.constructErrorMessages = function (schemaName, reqData, schemaResult) {
    var errorArray = [];
    var d = Q.defer();

    async.eachSeries(schemaResult, function (errorObject, callback) {


        if (errorObject.indexOf(constants.MIN_LENGTH_PARSING) > 0) {
            var errorFieldName = getFieldName(errorObject);
            var fieldValue = getFieldValue(reqData, errorFieldName, errorObject).trim();
            //minimum length error is used to find required field(If the user supplied field is empty)
            if (fieldValue === '') {
                jsonSchemaUtil.constructRequiredFieldError(schemaName, reqData, errorObject)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        callback(null);
                    });
            } else {
                jsonSchemaUtil.constructMinLengthError(schemaName, reqData, errorObject)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        callback(null);
                    });
            }

        } else if (errorObject.indexOf(constants.MAX_LENGTH_PARSING) > 0) {
            jsonSchemaUtil.constructMaxLengthError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.REQUIRED_PARSING) > 0) {
            jsonSchemaUtil.constructRequiredFieldError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.FORMAT_PARSING) > 0) {
            jsonSchemaUtil.constructFormatError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.ENUM_PARSING) > 0) {
            jsonSchemaUtil.constructUnknownFieldValueError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.PATTERN_PARSING) > 0) {
            var fieldName = getFieldName(errorObject);
            if (errorArray.find(error => error.errorCode === constants.MISSING_FIELD_VALUE && error.field === fieldName.trim())) {
                // If the filed already has 'MISSING_FIELD_VALUE' error, then no need to construct regex, errors.
                callback(null);
            } else {
                jsonSchemaUtil.constructFormatError(schemaName, reqData, errorObject)
                    .then(function (errorJSON) {
                        errorArray.push(errorJSON);
                        callback(null);
                    });
            }

        } else if (errorObject.indexOf(constants.DATATYPE_PARSING) > 0) {
            jsonSchemaUtil.constructDatatypeError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.MIN_VALUE_PARSING) > 0) {
            jsonSchemaUtil.constructMinValueError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else if (errorObject.indexOf(constants.MAX_VALUE_PARSING) > 0) {
            jsonSchemaUtil.constructMaxValueError(schemaName, reqData, errorObject)
                .then(function (errorJSON) {
                    errorArray.push(errorJSON);
                    callback(null);
                });
        } else {
            callback(null);
        }

    }, function (err) {
        d.resolve(errorArray);
    });

    return d.promise;
};


//Get parent field name Eg: campaignDescription (when structure is campaignDescription.campaignId)
function getParentFieldName(errObj) {
    var tempFieldArr = errObj.split(' '); //eg: 0: instance.name does not meet maximum length of 50
    var tempFieldArr2 = tempFieldArr[1].split('.'); //eg: instance.parent.name
    var parentFieldName = tempFieldArr2[1]; //eg: parent
    return parentFieldName;
}


// Below function gets the display field name(based on the schema and the field name)
function getDisplayFieldName(schemaName, fieldName) {
    if (schemaName.id === '/campaign') {
        if (baseSchema.campaignResourceMapping[fieldName] !== undefined) {
            fieldName = baseSchema.campaignResourceMapping[fieldName];
        } else if (fieldName.endsWith('lineNumber') || fieldName.endsWith('message') ||
            fieldName.endsWith('isMessagePrintedInBold')) {
            var shortFieldName = fieldName.split('.');
            fieldName = baseSchema.campaignResourceMapping[shortFieldName[shortFieldName.length - 1]];
        }
    } else if (schemaName.id === '/campaignStatistics' || schemaName.id === '/merchantStatistics') {
        if (statisticsSchema.statisticsResourceMapping[fieldName] !== undefined) {
            fieldName = statisticsSchema.statisticsResourceMapping[fieldName];
        }
    }
    return fieldName;
}

jsonSchemaUtil.constructMaxLengthError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var tempFieldArr = errorObject.split(' '); //eg: 0: instance.name does not meet maximum length of 50
    var maxLength = tempFieldArr[tempFieldArr.length - 1];
    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_INVALID_LENGTH, getDisplayFieldName(schemaName, fieldName), maxLength);

    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_LENGTH, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructMinLengthError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var tempFieldArr = errorObject.split(' '); //eg: 0: instance.name does not meet maximum length of 50
    var maxLength = tempFieldArr[tempFieldArr.length - 1];
    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_INVALID_MIN_LENGTH, getDisplayFieldName(schemaName, fieldName), maxLength);

    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_LENGTH, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructRequiredFieldError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var fieldName = getFieldName(errorObject);
    var fieldValue = '';
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_MISSING_VALUE, getDisplayFieldName(schemaName, fieldName));

    commonUtil.constructErrorJSONStructure(constants.MISSING_FIELD_VALUE, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructFormatError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    //eg 0: instance.website does not conform to the "uri" format
    //eg 1: instance.twitter_handle does not match pattern "^(@)",

    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = '';
    if (fieldName === 'startDate' || fieldName === 'endDate') {
        errorMessage = util.format(constants.MSG_BAD_FORMAT_DATE_PATTERN);
    }

    commonUtil.constructErrorJSONStructure(constants.BAD_FORMAT, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructUnknownFieldValueError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_UNKNOWN_VALUE, getDisplayFieldName(schemaName, fieldName), fieldValue);

    commonUtil.constructErrorJSONStructure(constants.UNKNOWN_FIELD_VALUE, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructDatatypeError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();
    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_BAD_FORMAT_DATATYPE, getDisplayFieldName(schemaName, fieldName));
    commonUtil.constructErrorJSONStructure(constants.BAD_FORMAT, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructMinValueError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var tempFieldArr = errorObject.split(' '); //eg: 0: instance.campaignDescription.campaignId must have a minimum value of 1
    var minValue = tempFieldArr[tempFieldArr.length - 1];
    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_INVALID_MIN_VALUE, getDisplayFieldName(schemaName, fieldName), minValue);
    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};

jsonSchemaUtil.constructMaxValueError = function (schemaName, reqData, errorObject) {
    var d = Q.defer();

    var tempFieldArr = errorObject.split(' '); //eg: 0: instance.campaignDescription.campaignId must have a maximum value of 1
    var maxValue = tempFieldArr[tempFieldArr.length - 1];
    var fieldName = getFieldName(errorObject);
    var fieldValue = getFieldValue(reqData, fieldName, errorObject);
    //Commented the below line as we want the entire field name. Eg., campaignDescription.type instead of type
    //fieldName = fieldName.split('.').pop(); //Returns the right most value in a string separated .
    var errorMessage = util.format(constants.MSG_INVALID_MAX_VALUE, getDisplayFieldName(schemaName, fieldName), maxValue);
    commonUtil.constructErrorJSONStructure(constants.INVALID_FIELD_VALUE, fieldName, fieldValue, errorMessage)
        .then(function (errorJSON) {
            d.resolve(errorJSON);
        });

    return d.promise;
};
