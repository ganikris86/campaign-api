/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var campaignModel = require('../../models/campaignModel');
var commonUtil = require('../../lib/commonUtil');
var constants = require('../../lib/constants');
var commonDBUtil = require('../../lib/commonDBUtil');
var campaignService = require('../../services/campaignService');
var serviceHelper = require('../../services/serviceHelper');

var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

//========================================================================================TestCases starts below

describe('serviceHelper::Service Helper TestSuite', () => {

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

    describe('Method: validateStartDateFormat() - Check if campaign start date is in valid format', () => {

        it('should return an empty error array when start date is in proper format', (done) => {

            let campaignValidity = {
                    'startDate': '20270327',
                    'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateStartDateFormat(campaignValidity.startDate, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
            });

        }); //end it

        it('should return error array with error details when start date is not in proper format', (done) => {

            let campaignValidity = {
                'startDate': '20271327', //Invalid month
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'startDate',
                'originalValue': '20271327',
                'errorMessage': 'Invalid start date',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#startDate'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateStartDateFormat(campaignValidity, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it

        it('should return error if there is any issue during error JSON construction', (done) => {

            let campaignValidity = {
                'startDate': '20271327', //Invalid month
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let err = 'Error during JSON construction';
            let responseErr = 'Error: Error during JSON construction';

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.rejects(err);

            serviceHelper.validateStartDateFormat(campaignValidity, requestErrorArray)
                .fail((error) => {
                    expect(error.toString()).to.deep.equal(responseErr.toString());
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it.

    }); //end describe for Method: validateStartDateFormat()

    describe('Method: validateEndDateFormat() - Check if campaign end date is in valid format', () => {

        it('should return an empty error array when end date is in proper format', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateEndDateFormat(campaignValidity.endDate, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
            });

        }); //end it

        it('should return error array with error details when end date is not in proper format', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20271425' //Invalid month
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'endDate',
                'originalValue': '20271425',
                'errorMessage': 'Invalid end date',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#endDate'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateEndDateFormat(campaignValidity, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it

        it('should return error if there is any issue during error JSON construction', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20271425' //Invalid month
            };

            let requestErrorArray = [];
            let err = 'Error during JSON construction';
            let responseErr = 'Error: Error during JSON construction';

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.rejects(err);

            serviceHelper.validateEndDateFormat(campaignValidity, requestErrorArray)
                .fail((error) => {
                    expect(error.toString()).to.deep.equal(responseErr.toString());
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it.

    }); //end describe for Method: validateEndDateFormat()

    describe('Method: validateStartDateLessThanToday() - Check if campaign start date is less than today', () => {

        it('should return an empty error array when start date is not less than today', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateStartDateLessThanToday(campaignValidity.startDate, requestErrorArray)
                .then((errorResponse) => {
                expect(errorResponse).to.deep.equal(responseErrorArray);
            done();
            });

        }); //end it

        it('should return error array with error details when start date is less than today', (done) => {

            let campaignValidity = {
                'startDate': '20170327', //start date is less than today
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'startDate',
                'originalValue': '20170327',
                'errorMessage': 'Start date should be equal to or greater than today',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#startDate'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateStartDateLessThanToday(campaignValidity.startDate, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it

        it('should return error if there is any issue during error JSON construction', (done) => {

            let campaignValidity = {
                'startDate': '20170327', //start date is less than today
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let err = 'Error during JSON construction';
            let responseErr = 'Error: Error during JSON construction';

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.rejects(err);

            serviceHelper.validateStartDateLessThanToday(campaignValidity.startDate, requestErrorArray)
                .fail((error) => {
                    expect(error.toString()).to.deep.equal(responseErr.toString());
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it.

    }); //end describe for Method: validateStartDateLessThanToday()

    describe('Method: validateEndDateLessThanStartDate() - Check if campaign end date is less than start date', () => {

        it('should return an empty error array when end date is not less than start date', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20270425'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateEndDateLessThanStartDate(campaignValidity, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
            });

        }); //end it

        it('should return error array with error details when start date is less than today', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20270325'  //end date is less than start date
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'endDate',
                'originalValue': '20270325',
                'errorMessage': 'End date should be equal to or greater than start date',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#endDate'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateEndDateLessThanStartDate(campaignValidity, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it

        it('should return error if there is any issue during error JSON construction', (done) => {

            let campaignValidity = {
                'startDate': '20270327',
                'endDate': '20270325' //end date is less than start date
            };

            let requestErrorArray = [];
            let err = 'Error during JSON construction';
            let responseErr = 'Error: Error during JSON construction';

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.rejects(err);

            serviceHelper.validateEndDateLessThanStartDate(campaignValidity, requestErrorArray)
                .fail((error) => {
                    expect(error.toString()).to.deep.equal(responseErr.toString());
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
            });

        }); //end it.

    }); //end describe for Method: validateEndDateLessThanStartDate()

    describe('Method: convertScenarioRepeatRewardType() - Convert scenario repeatReward from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 0;
            let outputValue = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION;
            let response = serviceHelper.convertScenarioRepeatRewardType(inputValue);
            response.should.equal(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertScenarioRepeatRewardType(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertScenarioRepeatRewardType()

    describe('Method: convertCampaignActiveStatus() - Convert campaign Active Status from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = constants.DB_STATUS_ACTIVE;
            let outputValue = constants.STATUS_ACTIVE;
            let response = serviceHelper.convertCampaignActiveStatus(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = '-1';
            let response = serviceHelper.convertCampaignActiveStatus(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCampaignActiveStatus()

    describe('Method: convertScenarioReset() - Convert scenario reset from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 0;
            let outputValue = constants.COUNTER_RESET_TYPE_NONE;
            let response = serviceHelper.convertScenarioReset(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertScenarioReset(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertScenarioReset()

    describe('Method: convertAwardValueType() - Convert Award value method from DB to string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 'F';
            let outputValue = constants.DISCOUNT_TYPE_FIXED_AMOUNT;
            let response = serviceHelper.convertAwardValueType(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = '-1';
            let response = serviceHelper.convertAwardValueType(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertAwardValueType()

    describe('Method: convertCounterResetType() - Convert Counter Reset Type from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 0;
            let outputValue = constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let response = serviceHelper.convertCampaignCounterResetType(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertCampaignCounterResetType(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCounterResetType()

    describe('Method: convertCampaignTypeForResponse() - Convert Campaign Type from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 'A';
            let outputValue = constants.DRIVER_TYPE_AMOUNT;
            let response = serviceHelper.convertCampaignTypeForResponse(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = '-1';
            let response = serviceHelper.convertCampaignTypeForResponse(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCampaignTypeForResponse()

    describe('Method: convertCampaignSubTypeForResponse() - Convert Campaign Sub Type from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 'D';
            let outputValue = constants.BENEFIT_TYPE_DISCOUNT;
            let response = serviceHelper.convertCampaignSubTypeForResponse(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = '-1';
            let response = serviceHelper.convertCampaignSubTypeForResponse(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCampaignSubTypeForResponse()

    describe('Method: constructDateByFormat() - Construct Date and Time based on format parameter', () => {

        it('should return date in input format when value passed in is of type date', (done) => {

            let format = 'YYYYMMDD';
            let outputValue = 'Invalid Date';
            let response = serviceHelper.constructDateByFormat(new Date(), format);
            response.should.not.containEql(outputValue);
            done();

        }); //end it

        /*
        it('should return error invalid date when input is not of type date', (done) => {

            let format = 'YYYYMMDD';
            let outputValue = 'Invalid date';
            let response = serviceHelper.constructDateByFormat('31-03-2017', format);
            response.should.containEql(outputValue);
            done();

        }); //end it
        */

    }); //end describe for Method: constructDateByFormat()

    describe('Method: convertMerchantCampaignTypeForResponse() - Convert Merchant Type from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 0;
            let outputValue = true;
            let response = serviceHelper.convertMerchantCampaignTypeForResponse(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertMerchantCampaignTypeForResponse(inputValue);
            expect(response).to.be.undefined;
            done();

        }); //end it

    }); //end describe for Method: convertMerchantCampaignTypeForResponse()

    describe('Method: convertCounterConfiguration() - Convert Override Counter from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = 1;
            let outputValue = constants.COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_HIGHER;
            let response = serviceHelper.convertCounterConfiguration(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertCounterConfiguration(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCounterConfiguration()

    describe('Method: convertMerchantHostAndVirtualTerminalForResponse() - Convert Merchant Host and Virtual Terminal from DB to defined string', () => {

        it('should return true when input has a defined value', (done) => {

            let inputValue = 1;
            let response = serviceHelper.convertMerchantHostAndVirtualTerminalForResponse(inputValue);
            expect(response).to.be.true;
            done();

        }); //end it

        it('should return false when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertMerchantHostAndVirtualTerminalForResponse(inputValue);
            expect(response).to.be.false;
            done();

        }); //end it

    }); //end describe for Method: convertMerchantHostAndVirtualTerminalForResponse()

    describe('Method: convertOwnerTypeForResponse() - Convert owner type from DB to defined string', () => {

        it('should return a not null string when input has a defined value', (done) => {

            let inputValue = constants.DB_OWNERTYPE_CORPORTATE;
            let outputValue = constants.OWNER_TYPE_CORPORATE;
            let response = serviceHelper.convertOwnerTypeForResponse(inputValue);
            response.should.containEql(outputValue);
            done();

        }); //end it

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertOwnerTypeForResponse(inputValue);
            expect(response).to.be.empty;
            done();

        }); //end it

    }); //end describe for Method: convertCounterConfiguration()


    describe('Method: convertCampaignAcceptedFrequency() - convert accepted frequency from DB to defined String', () => {

        it('should return a not null string when input has a defined value', (done) => {
            let inputValue = 1;
            let outputValue = constants.TRIGGER_FREQUENCY_ONCE_PER_DAY;
            let response = serviceHelper.convertCampaignAcceptedFrequency(inputValue);
            response.should.containEql(outputValue);
            done();
        });

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertCampaignAcceptedFrequency(inputValue);
            expect(response).to.be.empty;
            done();
        }); //end it
    });

    describe('Method: validateRequestQuery_ownerType() - ', function(){
        it('Should return empty array for defined ownerType String', function(done){
            let inputValue = 'Merchant';
            let outputValue = [];
            serviceHelper.validateRequestQuery_ownerType(inputValue, [])
                .then(function(response){
                    expect(response).to.deep.equal(outputValue);
                    done();
                });
        });

        it('Should return empty array for defined ownerType String with extra trailing spaces', function(done){
            let inputValue = 'Merchant     ';
            let outputValue = [];
            serviceHelper.validateRequestQuery_ownerType(inputValue, [])
                .then(function(response){
                    expect(response).to.deep.equal(outputValue);
                    done();
                });
        });

        it('Should return error array for undefined ownerType String', function(done){
            let inputValue = 'Unknown';
            serviceHelper.validateRequestQuery_ownerType(inputValue, [])
                .then(function(response){
                    response.length.should.equal(1);
                    done();
                });
        });
    });

    describe('Method: validateRequestQuery_status() - ', function(){
        it('Should return empty array for defined ownerType String', function(done){
            let inputValue = 'Inactive';
            let outputValue = [];
            serviceHelper.validateRequestQuery_status(inputValue, [])
                .then(function(response){
                    expect(response).to.deep.equal(outputValue);
                    done();
                });
        });

        it('Should return empty array for defined ownerType String with extra trailing spaces', function(done){
            let inputValue = 'Inactive     ';
            let outputValue = [];
            serviceHelper.validateRequestQuery_status(inputValue, [])
                .then(function(response){
                    expect(response).to.deep.equal(outputValue);
                    done();
                });
        });

        it('Should return error array for undefined ownerType String', function(done){
            let inputValue = 'Unknown';
            serviceHelper.validateRequestQuery_status(inputValue, [])
                .then(function(response){
                    response.length.should.equal(1);
                    done();
                });
        });
    });

    describe('Method: convertOwnerTypeStringToDbValue() - ', function(){
        it('should return a not null string when input has a defined value', function(done){
            let inputValue = constants.OWNER_TYPE_MERCHANT;
            let outputValue = constants.DB_OWNERTYPE_MERCHANT;
            let response = serviceHelper.convertOwnerTypeStringToDbValue(inputValue);
            response.should.equal(outputValue);
            done();
        });

        it('should return null string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertOwnerTypeStringToDbValue(inputValue);
            response.should.equal('All');
            done();
        }); //end it
    });

    describe('Method: convertStatusStringToDbValue() - ', function(){

        it('should return a not null string when input has a defined value', function(done){
            let inputValue = constants.STATUS_ACTIVE;
            let outputValue = constants.DB_STATUS_ACTIVE;
            let response = serviceHelper.convertStatusStringToDbValue(inputValue);
            response.should.equal(outputValue);
            done();
        });

        it('should return All string when input does not have a defined value', (done) => {

            let inputValue = -1;
            let response = serviceHelper.convertStatusStringToDbValue(inputValue);
            response.should.equal('All');
            done();
        }); //end it
    });

    describe('Method: constructMessageResponse() - Construct individual message for response', function(){
        it('Should return message structure', function(done){

            let outputValue = {
                'lineNumber':1,
                'message':'test',
                'isMessagePrintedInBold':true
            };

            let response = serviceHelper.constructMessageResponse(1, 'test', 1);

            expect(response).to.deep.equal(outputValue);
            done();
        });
    });

    describe('Method: convertDriverTypeToDbValue() - Convert DriverType string to db value', function(){
        it('Should return db value of campaign type Amount', function(done){

            let inputValue = constants.DRIVER_TYPE_AMOUNT;
            let expectedValue = constants.DB_CAMPAIGN_TYPE_AMOUNT;
            let result = serviceHelper.convertDriverTypeToDbValue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let result = serviceHelper.convertDriverTypeToDbValue(inputValue);
            result.should.equal('All');
            done();
        });
    });

    describe('Method: convertBenefitTypeToDBvalue() - Convert BenefitType string to db value', function(){
        it('Should return db value of campaign benefit type', function(done){

            let inputValue = constants.BENEFIT_TYPE_DISCOUNT;
            let expectedValue = constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT;
            let result = serviceHelper.convertBenefitTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let result = serviceHelper.convertBenefitTypeToDBvalue(inputValue);
            expect(result).to.be.empty;
            done();
        });
    });

    describe('Method: convertTriggerFrequencyTypeToDBvalue() - Convert TriggerFrequencyType string to db value', function(){
        it('Should return db value of trigger frequency type', function(done){

            let inputValue = constants.TRIGGER_FREQUENCY_EVERY_TRANSACTION;
            let expectedValue = constants.DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION;
            let result = serviceHelper.convertTriggerFrequencyTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION;
            let result = serviceHelper.convertTriggerFrequencyTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsSubscribableToSeverarMerchant() - Convert Multi-merchant subscribe string to db value', function(){
        it('Should return db value of multi/mono merchant', function(done){

            let inputValue = true;
            let expectedValue = constants.DB_MERCHANT_MULTI_MERCHANT;
            let result = serviceHelper.convertIsSubscribableToSeverarMerchant(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_MERCHANT_MONO_MERCHANT;
            let result = serviceHelper.convertIsSubscribableToSeverarMerchant(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertCampaignCounterResetType() - Convert Campaign Counter Reset Type from DB to defined string', function(){
        it('Should return string value of campaign counter reset type', function(done){

            let inputValue = constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let expectedValue = constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let result = serviceHelper.convertCampaignCounterResetType(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let result = serviceHelper.convertCampaignCounterResetType(inputValue);
            expect(result).to.be.empty;
            done();
        });
    });

    describe('Method: convertCampaignCounterResetTypeToDBvalue() - Convert campaign counter reset type to db value', function(){
        it('Should return db value of multi/mono merchant', function(done){

            let inputValue = constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let expectedValue = constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let result = serviceHelper.convertCampaignCounterResetTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let result = serviceHelper.convertCampaignCounterResetTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getCounterResetTypeByDriverType() - Get scenario counter reset type by driver type', function(){
        it('Should return counter reset type', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {
                'amountDriverAndBenefitsDetails': {
                    'counterResetDetails': {
                        'counterResetType': constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY
                    }
                }
            };
            let expectedValue = constants.COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY;
            let result = serviceHelper.getCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {};
            let result = serviceHelper.getCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            expect(result).to.be.empty;
            done();
        });
    });

    describe('Method: getNumberOfMonthOfCounterResetTypeByDriverType() - Get scenario number of reset month by driver type', function(){
        it('Should return number of month', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {
                'amountDriverAndBenefitsDetails': {
                    'counterResetDetails': {
                        'noOfMonthsFromTransactionDateToResetCounter': 10
                    }
                }
            };
            let expectedValue = 10;
            let result = serviceHelper.getNumberOfMonthOfCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {};
            let expectedValue = 0;
            let result = serviceHelper.getNumberOfMonthOfCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getCounterOverrideTypeByDriverType() - Get scenario counter override by driver type', function(){

        it('Should return Counter Override type string', function(done){
            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {
                'amountDriverAndBenefitsDetails': {
                    'counterOverrideType': constants.COUNTER_OVERRIDE_TYPE_NO_OVERRIDE
                }
            };
            let expectedValue = constants.COUNTER_OVERRIDE_TYPE_NO_OVERRIDE;
            let result = serviceHelper.getCounterOverrideTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {};
            let result = serviceHelper.getCounterOverrideTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            expect(result).to.be.empty;
            done();
        });
    });

    describe('Method: getNumberOfDayOfCounterResetTypeByDriverType() - Get scenario reset number of days by driver type', function(){
        it('Should return number of days', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {
                'amountDriverAndBenefitsDetails': {
                    'counterResetDetails': {
                        'noOfDaysFromTransactionDateToResetCounter': 100
                    }
                }
            };
            let expectedValue = 100;
            let result = serviceHelper.getNumberOfDayOfCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueDriverType = constants.DRIVER_TYPE_AMOUNT;
            let inputValueDriverDetails = {};
            let expectedValue = 0;
            let result = serviceHelper.getNumberOfDayOfCounterResetTypeByDriverType(inputValueDriverType, inputValueDriverDetails);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertCounterOverrideTypeToDBvalue() - Convert counter override type to db value', function(){
        it('Should return db value of counter override type', function(done){

            let inputValue = constants.COUNTER_OVERRIDE_TYPE_NO_OVERRIDE;
            let expectedValue = constants.DB_OVERRIDE_NO_OVERRIDE;
            let result = serviceHelper.convertCounterOverrideTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_OVERRIDE_NO_OVERRIDE;
            let result = serviceHelper.convertCounterOverrideTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertOwnerTypeToDBvalue() - Convert ownertype string to db value', function(){
        it('Should return db value of owner type', function(done){

            let inputValue = constants.OWNER_TYPE_CORPORATE;
            let expectedValue = constants.DB_OWNERTYPE_CORPORTATE;
            let result = serviceHelper.convertOwnerTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertOwnerTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: validateOwnerType() - Validate owner type and owner Id', () => {

        it('should return an empty error array when owner type and owner id are valid', (done) => {

            let ownerType = constants.OWNER_TYPE_MERCHANT;
            let ownerId = 1;

            let requestErrorArray = [];
            let responseErrorArray = [];

            let stubCheckMerchantIdExists = sinon.stub(campaignModel, 'checkMerchantIdExists');
            stubCheckMerchantIdExists.resolves(requestErrorArray);

            serviceHelper.validateOwnerType(ownerType, ownerId, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
                });

        }); //end it

        it('should return error array with error details when owner Id is not present for owner type Merchant', (done) => {

            let ownerType = constants.OWNER_TYPE_MERCHANT;
            let ownerId = '';

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'ownerId',
                'originalValue': '',
                'errorMessage': 'Owner identifier is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#ownerId'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateOwnerType(ownerType, ownerId, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateOwnerType()


}); //end describe


