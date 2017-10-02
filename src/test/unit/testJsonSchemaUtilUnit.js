/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var fs = require('fs');
var path = require('path');

var jsonSchemaUtil = require('../../lib/jsonSchemaUtil');
var baseSchema = require('../../schema/baseSchema');

describe('Unit Test for Json Schema Utility Library', () => {

    let logUtilStub;

    before(function (done) {
        // Stub the logUtil to ensure that log details are not printed while executing unit tests
        let logUtil = require('../../lib/logUtil');
        logUtilStub = sinon.stub(logUtil, 'msg',
            function (level, controller, model, lib, method, info) {
                return '';
            });
        done();
    });

    after(function (done) {
        logUtilStub.restore();
        done();
    });

    describe('Method: validateSchema - Check campaign schema', () => {
        // Get generic request stub
        // var validateSchemaRequestStub = require('nconf').file({file: './test/unit/data/libJsonSchemaRequestStub.json'});
        it('should validate successfully if campaign object (mandatory) is valid against campaign schema', (done) => {

            var reqObject = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            jsonSchemaUtil.validateSchema(reqObject, baseSchema.createCampaignReqSchemaDef)
                .then((schemaError) => {
                    expect(schemaError).to.equal(null);
                    done();
                });
        });

        it('should validate successfully if campaign object (complete) is valid against campaign schema', (done) => {

            var reqObject = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            jsonSchemaUtil.validateSchema(reqObject, baseSchema.createCampaignReqSchemaDef)
                .then((schemaError) => {
                    expect(schemaError).to.equal(null);
                    done();
                });
        });

        it('should return errors for mandatory fields if campaign object is empty', (done) => {
            let reqObject = {};

            let expectedReturnValue = [
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'name',
                    'originalValue': '',
                    'errorMessage': 'Name is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#name'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'startDate',
                    'originalValue': '',
                    'errorMessage': 'Start date is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#startDate'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'endDate',
                    'originalValue': '',
                    'errorMessage': 'End date is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#endDate'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'minimumPurchaseAmount',
                    'originalValue': '',
                    'errorMessage': 'Minimum purchase amount is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#minimumPurchaseAmount'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'maximumPurchaseAmount',
                    'originalValue': '',
                    'errorMessage': 'Maximum purchase amount is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#maximumPurchaseAmount'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'ownerType',
                    'originalValue': '',
                    'errorMessage': 'Owner type is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#ownerType'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'driverType',
                    'originalValue': '',
                    'errorMessage': 'Driver type is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#driverType'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'benefitType',
                    'originalValue': '',
                    'errorMessage': 'Benefit type is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#benefitType'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'driverAndBenefitsDetails',
                    'originalValue': '',
                    'errorMessage': 'Driver and benefit details is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#driverAndBenefitsDetails'
                }
            ];

            jsonSchemaUtil.validateSchema(reqObject, baseSchema.createCampaignReqSchemaDef)
                .then((schemaError) => {
                    expect(schemaError).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });

    describe('Method: constructErrorMessages - one error in request object', () => {
        it('should return errors for required and minimum length cases', (done) => {

            let reqObject = {
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let schemaValidationErrors = [
                '0: instance.name is required',
                '1: instance.driverType is required',
                '2: instance.benefitType is required',
                '3: instance.startDate is required',
                '4: instance.endDate is required'
            ];

            let expectedReturnValue = [
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'name',
                    'originalValue': '',
                    'errorMessage': 'Name is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#name'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'driverType',
                    'originalValue': '',
                    'errorMessage': 'Driver type is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#driverType'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'benefitType',
                    'originalValue': '',
                    'errorMessage': 'Benefit type is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#benefitType'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'startDate',
                    'originalValue': '',
                    'errorMessage': 'Start date is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#startDate'
                },
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'endDate',
                    'originalValue': '',
                    'errorMessage': 'End date is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#endDate'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, schemaValidationErrors)
                .then((errorArray) => {
                    expect(errorArray).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });

    describe('Method: constructMaxLengthError', () => {
        it('should return the max length error successfully', (done) => {

            let reqObject = {
                'name': 'XLS Amount Campaign 1222222223333333333334444444444',
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.name does not meet maximum length of 50'];
            let expectedReturnValue = [
                {
                    'errorCode': 'INVALID_FIELD_LENGTH',
                    'field': 'name',
                    'originalValue': 'XLS Amount Campaign 1222222223333333333334444444444',
                    'errorMessage': 'Name maximum length is 50 characters',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_LENGTH#name'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(JSON.stringify(errorArray)).to.deep.equal(JSON.stringify(expectedReturnValue));
                    done();
                });
        });
    });

    describe('Method: constructRequiredFieldError', () => {
        it('should return the required field error successfully', (done) => {
            let reqObject = {
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount12',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.name is required'];
            let expectedReturnValue = [
                {
                    'errorCode': 'MISSING_FIELD_VALUE',
                    'field': 'name',
                    'originalValue': '',
                    'errorMessage': 'Name is required',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#name'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(errorArray).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });

    describe('Method: constructFormatError', () => {
        it('should return the start date format error successfully', (done) => {
            let reqObject = {
                'name': 'ITRI AmountDisc11',
                'startDate': 20170601,
                'endDate': '20181231',
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount12',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.startDate is not of a type(s) string'];
            let expectedReturnValue = [
                {
                    'errorCode': 'BAD_FORMAT',
                    'field': 'startDate',
                    'originalValue': 20170601,
                    'errorMessage': 'Start date is not of expected datatype',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/BAD_FORMAT#startDate'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(JSON.stringify(errorArray)).to.deep.equal(JSON.stringify(expectedReturnValue));
                    done();
                });
        });

    });

    describe('Method: constructUnknownFieldValueError', () => {
        it('should return the unknown field error successfully', (done) => {

            let reqObject = {
                'name': 'ITRI AmountDisc11',
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount12',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.type is not one of enum values: Amount'];
            let expectedReturnValue = [
                {
                    'errorCode': 'UNKNOWN_FIELD_VALUE',
                    'field': 'type',
                    'errorMessage': 'No type of undefined found',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/UNKNOWN_FIELD_VALUE#type'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(JSON.stringify(errorArray)).to.deep.equal(JSON.stringify(expectedReturnValue));
                    done();
                });
        });
    });

    describe('Method: constructDatatypeError', () => {
        it('should return the data type error successfully', (done) => {

            let reqObject = {
                'name': 'ITRI AmountDisc11',
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': '1',
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount12',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.minimumPurchaseAmount is not of a type(s) number'];
            let expectedReturnValue = [
                {
                    'errorCode': 'BAD_FORMAT',
                    'field': 'minimumPurchaseAmount',
                    'originalValue': '1',
                    'errorMessage': 'Minimum purchase amount is not of expected datatype',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/BAD_FORMAT#minimumPurchaseAmount'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(errorArray).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });

    describe('Method: constructMinValueError', () => {
        it('should return the min value error successfully', (done) => {

            let reqObject = {
                'name': 'ITRI AmountDisc11',
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': 0,
                'maximumPurchaseAmount': 500000,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active'
            };

            let errorObject = ['0: instance.minimumPurchaseAmount must have a minimum value of 0'];
            let expectedReturnValue = [
                {
                    'errorCode': 'INVALID_FIELD_VALUE',
                    'field': 'minimumPurchaseAmount',
                    'originalValue': 0,
                    'errorMessage': 'Incorrect format - minimum purchase amount cannot be less than 0',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#minimumPurchaseAmount'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(errorArray).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });

    describe('Method: constructMaxValueError', () => {
        it('should return the max value error successfully', (done) => {

            let reqObject = {
                'name': 'ITRI AmountDisc11',
                'startDate': '20170601',
                'endDate': '20181231',
                'minimumPurchaseAmount': 1,
                'maximumPurchaseAmount': 99999999,
                'ownerType': 'Merchant',
                'ownerId': 12,
                'triggerFrequencyType': 'Once per day',
                'shortDescription': 'This is short Description',
                'driverType': 'Amount',
                'benefitType': 'Discount',
                'isSubscribableToServeralMerchants': false,
                'isSubscribableToHostAndVirtualTerminals': false,
                'imageUrl': 'TODO',
                'mobileMessage': 'This is mobile message',
                'status': 'Active',
                'driverAndBenefitsDetails': {
                    'amountDriverAndBenefitsDetails': {
                        'counterOverrideType': 'No Override',
                        'counterResetDetails': {
                            'counterResetType': 'Reset x day(s) after 1st transaction date',
                            'noOfDaysFromTransactionDateToResetCounter': 10
                        }
                    }
                }
            };

            let errorObject = ['0: instance.maximumPurchaseAmount must have a maximum value of 9999999.99'];
            let expectedReturnValue = [
                {
                    'errorCode': 'INVALID_FIELD_VALUE',
                    'field': 'maximumPurchaseAmount',
                    'originalValue': 99999999,
                    'errorMessage': 'Incorrect format - maximum purchase amount cannot be more than 9999999.99',
                    'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#maximumPurchaseAmount'
                }
            ];

            jsonSchemaUtil.constructErrorMessages(baseSchema.createCampaignReqSchemaDef, reqObject, errorObject)
                .then((errorArray) => {
                    expect(errorArray).to.deep.equal(expectedReturnValue);
                    done();
                });
        });
    });
})
; //end describe

