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

    describe('Method: getScenarioRangeLower() - Get scenario range lower value based on driver type', function(){
        it('Should return scenario lower range', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'purchaseAmountSlab':{
                                'lower':1
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = 1;
            let result = serviceHelper.getScenarioRangeLower(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getScenarioRangeLower(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getScenarioRangeUpper() - Get scenario range upper value based on driver type', function(){
        it('Should return scenario upper range', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'purchaseAmountSlab':{
                                'upper':10000
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = 10000;
            let result = serviceHelper.getScenarioRangeUpper(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getScenarioRangeUpper(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getBenefitTriggerFrequencyType() - Get benefitTriggerFrequencyType based on the driverType', function(){
        it('Should return benefit trigger frequency', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'benefitDetails':{
                                'benefitTriggerFrequencyType':constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_ONLY_ONCE
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_ONLY_ONCE;
            let result = serviceHelper.getBenefitTriggerFrequencyType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return -1 if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getBenefitTriggerFrequencyType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertScenarioBenefitTriggerTypeToDBvalue() - convert scenario benefitTriggerType to db value', function(){
        it('Should return db value of benefitType', function(done){

            let inputValue = constants.BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION;
            let expectedValue = constants.DB_REPEAT_REWARD_TYPE_EVERY_TRANSACTION;
            let result = serviceHelper.convertScenarioBenefitTriggerTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertScenarioBenefitTriggerTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getIsMultipleScenarioTriggerAllowed() - Get isMultipleScenarioTriggerAllowed based on driverType', function(){

        it('Should return scenario isMultipleScenarioTriggerAllowed', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'isMultipleScenarioTriggerAllowed':true
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = true;
            let result = serviceHelper.getIsMultipleScenarioTriggerAllowed(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return false if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = false;
            let result = serviceHelper.getIsMultipleScenarioTriggerAllowed(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsMultipleScenarioTriggerAllowedToDBvalue() - Convert IsMultipleScenarioTriggerAllowed to db value', function(){
        it('Should return db value of multiple scenario trigger', function(done){

            let inputValue = true;
            let expectedValue = constants.DB_REPEAT_REWARD_MULTIPLE_TRUE;
            let result = serviceHelper.convertIsMultipleScenarioTriggerAllowedToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return 0 if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_REPEAT_REWARD_MULTIPLE_FALSE;
            let result = serviceHelper.convertIsMultipleScenarioTriggerAllowedToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getCounterResetType() - Get CounterResetType based on driverType', function(){

        it('Should return scenario isMultipleScenarioTriggerAllowed', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                           'counterResetType': constants.COUNTER_RESET_TYPE_NONE
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = constants.COUNTER_RESET_TYPE_NONE;
            let result = serviceHelper.getCounterResetType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getCounterResetType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertCounterResetTypeToDBvalue() - Convert CounterResetType string to db value', function(){
        it('Should return db value of counter reset type', function(done){

            let inputValue = constants.COUNTER_RESET_TYPE_NONE;
            let expectedValue = constants.DB_SCENARIO_RESET_NONE;
            let result = serviceHelper.convertCounterResetTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return 0 if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_SCENARIO_RESET_NONE;
            let result = serviceHelper.convertCounterResetTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getScenarioDiscountType() - Get scenario discount type based on driverType and BenefitType', function(){

        it('Should return scenario discount type', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'benefitType':constants.BENEFIT_TYPE_DISCOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'benefitDetails': {
                                'discountBenefitDetails':{
                                    'discountType':constants.DISCOUNT_TYPE_FIXED_AMOUNT
                                }
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = constants.DISCOUNT_TYPE_FIXED_AMOUNT;
            let result = serviceHelper.getScenarioDiscountType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getScenarioDiscountType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

    });

    describe('Method: convertDiscountTypeToDBvalue() - Convert discountType to db value', function(){
        it('Should return db value of scenario discount type', function(done){

            let inputValue = constants.DISCOUNT_TYPE_FIXED_AMOUNT;
            let expectedValue = constants.DB_DISCOUNT_TYPE_FIXED_AMOUNT;
            let result = serviceHelper.convertDiscountTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertDiscountTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getScenarioFixedAmount() - ', function(){

        it('Should return scenario discount fixed amount', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'benefitType':constants.BENEFIT_TYPE_DISCOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'benefitDetails': {
                                'discountBenefitDetails':{
                                    'discountFixedAmount':15
                                }
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = 15;
            let result = serviceHelper.getScenarioFixedAmount(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return 0 if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = 0;
            let result = serviceHelper.getScenarioFixedAmount(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

    });

    describe('Method: getScenarioPercentage() - Get scenario percentage value based on driverType and benefitType', function(){

        it('Should return scenario discount percentage', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'benefitType':constants.BENEFIT_TYPE_DISCOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'benefitDetails': {
                                'discountBenefitDetails':{
                                    'discountPercentage':10
                                }
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = 10;
            let result = serviceHelper.getScenarioPercentage(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return 0 if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = 0;
            let result = serviceHelper.getScenarioPercentage(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });


    describe('Method: getScenarioReceiptMessage() - ', function(){
        it('Should return scenario discount percentage', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'scenarioMessageDetails': {
                                'messageChannelType':[constants.MESSAGE_CHANNEL_TYPE_RECEIPT],
                                'receiptMessageDetails':{
                                    'receiptMessages':[
                                        {
                                            'lineNumber':1,
                                            'message': 'test1',
                                            'isMessagePrintedInBold': true
                                        },
                                        {
                                            'lineNumber':2,
                                            'message': 'test2',
                                            'isMessagePrintedInBold': false
                                        }
                                    ]
                                }
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;

            let expectedValue = {};
            let messages = [];
            var m;
            for(var j=0; j<8; j++){
                m = {};
                m.message = '';
                m.bold = constants.DB_MESSAGE_ATTRIBUTE_NORMAL;
                messages.push(m);
            }

            messages[0].message = 'test1';
            messages[0].bold = constants.DB_MESSAGE_ATTRIBUTE_BOLD;
            messages[1].message = 'test2';
            messages[1].bold = constants.DB_MESSAGE_ATTRIBUTE_NORMAL;
            expectedValue.messages = messages;
            expectedValue.smsMessage = '';

            let result = serviceHelper.getScenarioReceiptMessage(inputValueRequestObj, inputValueScenarioIndex);
            expect(result).to.deep.equal(expectedValue);
            done();
        });

        it('Should return message structure with all empty lines if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = {};
            let messages = [];

            expectedValue.messages = messages;
            expectedValue.smsMessage = '';
            let result = serviceHelper.getScenarioReceiptMessage(inputValueRequestObj, inputValueScenarioIndex);
            expect(result).to.deep.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsSubscribableToHostAndVirtualTerminalsToDBvalue() - Convert isSubscribableToHostAndVirtualTerminals to db value', function(){
        it('Should return db value of subscribe virtual terminal', function(done){

            let inputValue = true;
            let expectedValue = constants.DB_AVAILABLE_FOR_VT_TRUE;
            let result = serviceHelper.convertIsSubscribableToHostAndVirtualTerminalsToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.DB_AVAILABLE_FOR_VT_FALSE;
            let result = serviceHelper.convertIsSubscribableToHostAndVirtualTerminalsToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsAwardTriggeredAgainAfterCounterReset() - Convert awardtriggeredAgain db value to boolean', function(){
        it('Should return boolean of awardTriggeredAgainAfterCounterReset', function(done){

            let inputValue = constants.DB_PNT_PARTIAL_RESET_ENABLE;
            let expectedValue = true;
            let result = serviceHelper.convertIsAwardTriggeredAgainAfterCounterReset(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = false;
            let result = serviceHelper.convertIsAwardTriggeredAgainAfterCounterReset(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsCascadedAwardTriggered() - Convert CascadeAwardTriggered db value to boolean', function(){
        it('Should return boolean of CascadedAwardTriggered', function(done){

            let inputValue = constants.DB_PNT_CASCADE_CPNS_ENABLE;
            let expectedValue = true;
            let result = serviceHelper.convertIsCascadedAwardTriggered(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = false;
            let result = serviceHelper.convertIsCascadedAwardTriggered(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsAwardTriggeredAgainAfterCounterResetToDBvalue() - Convert AwardTriggeredAgainAfterCounterReset into DB value', function(){
        it('Should return db value of AwardTriggeredAgainAfterCounterReset', function(done){

            let inputValue = true;
            let expectedValue = constants.DB_PNT_PARTIAL_RESET_ENABLE;
            let result = serviceHelper.convertIsAwardTriggeredAgainAfterCounterResetToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertIsAwardTriggeredAgainAfterCounterResetToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertIsCascadedAwardTriggeredToDBvalue() - Convert CascadedAwardTriggered to db value', function(){
        it('Should return db value of CascadedAwardTriggered', function(done){

            let inputValue = true;
            let expectedValue = constants.DB_PNT_CASCADE_CPNS_ENABLE;
            let result = serviceHelper.convertIsCascadedAwardTriggeredToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertIsCascadedAwardTriggeredToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getIsAwardTriggeredAgainAfterCounterReset() - Get IsAwardTriggeredAgainAfterCounterReset based on driver type', function(){

        it('Should return IsAwardTriggeredAgainAfterCounterReset (true/false)', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'isAwardTriggeredAgainAfterCounterReset':true
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = true;
            let result = serviceHelper.getIsAwardTriggeredAgainAfterCounterReset(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getIsAwardTriggeredAgainAfterCounterReset(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getIsCascadedAwardTriggered() - Get IsCascadedAwardTriggered based on driver type', function(){

        it('Should return IsCascadedAwardTriggered (true/false)', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'isCascadedAwardTriggered':true
                    }
                }
            };
            let inputValueScenarioIndex = 0;
            let expectedValue = true;
            let result = serviceHelper.getIsCascadedAwardTriggered(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';
            let result = serviceHelper.getIsCascadedAwardTriggered(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: getReceiptPrintingType() - Get ReceiptPrintingType based on driver Type', function(){
        it('Should return receiptPrntingType', function(done){

            let inputValueRequestObj = {
                'driverType':constants.DRIVER_TYPE_AMOUNT,
                'driverAndBenefitsDetails':{
                    'amountDriverAndBenefitsDetails':{
                        'amountDriverScenariosAndBenefitsDetails':[{
                            'scenarioMessageDetails': {
                                'messageChannelType':constants.MESSAGE_CHANNEL_TYPE_RECEIPT,
                                'receiptMessageDetails':{
                                    'receiptPrintingType':constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT
                                }
                            }
                        }]
                    }
                }
            };
            let inputValueScenarioIndex = 0;

            let expectedValue = constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT;

            let result = serviceHelper.getReceiptPrintingType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValueRequestObj = {};
            let inputValueScenarioIndex = 0;
            let expectedValue = '';

            let result = serviceHelper.getReceiptPrintingType(inputValueRequestObj, inputValueScenarioIndex);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertReceiptPrintingTypeToDBvalue() - Convert ReceiptPrintingType to db value', function(){
        it('Should return db value of ReceiptPrintingType', function(done){

            let inputValue = constants.RECEIPT_PRINTING_TYPE_NEW_RECEIPT_SEPARATE_FROM_PAYMENT;
            let expectedValue = constants.DB_DISPLAY_FLAG_NEW_RECEIPT;
            let result = serviceHelper.convertReceiptPrintingTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = '';
            let result = serviceHelper.convertReceiptPrintingTypeToDBvalue(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: convertDisplayFlagToReceiptPrintingType() - ', function(){
        it('Should return string ReceiptPrintingType', function(done){

            let inputValue = constants.DB_DISPLAY_FLAG_NEW_RECEIPT;
            let expectedValue = constants.RECEIPT_PRINTING_TYPE_NEW_RECEIPT_SEPARATE_FROM_PAYMENT;
            let result = serviceHelper.convertDisplayFlagToReceiptPrintingType(inputValue);
            result.should.equal(expectedValue);
            done();
        });

        it('Should return empty string if not found', function(done){

            let inputValue = 999;
            let expectedValue = constants.RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT;
            let result = serviceHelper.convertDisplayFlagToReceiptPrintingType(inputValue);
            result.should.equal(expectedValue);
            done();
        });
    });

    describe('Method: validateCounterResetDetails() - Validate counter reset details', () => {

        it('should return an empty error array when counter details are in proper format', (done) => {

            let counterResetDetails = {
                'counterResetType': 'Reset x day(s) after 1st transaction date',
                'noOfDaysFromTransactionDateToResetCounter': 10
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateCounterResetDetails(counterResetDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
                });

        }); //end it

        it('should return error array with error details when no. of days is missing', (done) => {

            let counterResetDetails = {
                'counterResetType': 'Reset x day(s) after 1st transaction date'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'noOfDaysFromTransactionDateToResetCounter',
                'originalValue': '',
                'errorMessage': 'Number of days from transaction date to reset counter is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#noOfDaysFromTransactionDateToResetCounter'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateCounterResetDetails(counterResetDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when no. of days is not between 1 and 365', (done) => {

            let counterResetDetails = {
                'counterResetType': 'Reset x day(s) after 1st transaction date',
                'noOfDaysFromTransactionDateToResetCounter': 0
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'noOfDaysFromTransactionDateToResetCounter',
                'originalValue': '',
                'errorMessage': 'Number of days should be between 1 and 365',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#noOfDaysFromTransactionDateToResetCounter'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateCounterResetDetails(counterResetDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when no. of months is missing', (done) => {

            let counterResetDetails = {
                'counterResetType': 'Reset x month(s) after 1st transaction date'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'noOfMonthsFromTransactionDateToResetCounter',
                'originalValue': '',
                'errorMessage': 'Number of months from transaction date to reset counter is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#noOfMonthsFromTransactionDateToResetCounter'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateCounterResetDetails(counterResetDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when no. of months is not between 1 and 12', (done) => {

            let counterResetDetails = {
                'counterResetType': 'Reset x month(s) after 1st transaction date',
                'noOfMonthsFromTransactionDateToResetCounter': 0
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'noOfMonthsFromTransactionDateToResetCounter',
                'originalValue': '',
                'errorMessage': 'Number of months should be between 1 and 12',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#noOfMonthsFromTransactionDateToResetCounter'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateCounterResetDetails(counterResetDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateCounterResetDetails()


    describe('Method: validateDiscountBenefitDetails() - Validate discount benefit details', () => {

        it('should return an empty error array when discount benefit details are in proper format', (done) => {

            let discountBenefitDetails = {
                'discountType': 'Fixed amount',
                'discountFixedAmount': 10
            };

            let requestErrorArray = [];
            let responseErrorArray = [];

            serviceHelper.validateDiscountBenefitDetails(discountBenefitDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    done();
                });

        }); //end it

        it('should return error array with error details when discount fixed amount is missing', (done) => {

            let discountBenefitDetails = {
                'discountType': 'Fixed amount'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'discountFixedAmount',
                'originalValue': '',
                'errorMessage': 'Discount fixed amount is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#discountFixedAmount'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateDiscountBenefitDetails(discountBenefitDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when discount fixed amount is not between specified limit', (done) => {

            let discountBenefitDetails = {
                'discountType': 'Fixed amount',
                'discountFixedAmount': 0
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'discountFixedAmount',
                'originalValue': 0,
                'errorMessage': 'Discount fixed amount should be between 0.01 and 9999999999.99',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#discountFixedAmount'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateDiscountBenefitDetails(discountBenefitDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when discount percentage is missing', (done) => {

            let discountBenefitDetails = {
                'discountType': 'Percentage of purchase amount'
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'discountPercentage',
                'originalValue': '',
                'errorMessage': 'Discount percentage is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#discountPercentage'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateDiscountBenefitDetails(discountBenefitDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

        it('should return error array with error details when discount percentage is not between specified limit', (done) => {

            let discountBenefitDetails = {
                'discountType': 'Percentage of purchase amount',
                'discountPercentage': 0
            };

            let requestErrorArray = [];
            let responseErrorArray = [];
            let errorJSON = {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'discountPercentage',
                'originalValue': 0,
                'errorMessage': 'Discount percentage should be between 0.01 and 100',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#discountPercentage'
            };
            responseErrorArray.push(errorJSON);

            let stubConstructErrorJSONStructure = sinon.stub(commonUtil, 'constructErrorJSONStructure');
            stubConstructErrorJSONStructure.resolves(errorJSON);

            serviceHelper.validateDiscountBenefitDetails(discountBenefitDetails, requestErrorArray)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(responseErrorArray);
                    expect(commonUtil.constructErrorJSONStructure).to.have.been.calledOnce;
                    stubConstructErrorJSONStructure.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateDiscountBenefitDetails()

}); //end describe


