/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var campaignModel = require('../../models/campaignModel');
var commonUtil = require('../../lib/commonUtil');
var commonDBUtil = require('../../lib/commonDBUtil');
var campaignService = require('../../services/campaignService');
var serviceHelper = require('../../services/serviceHelper');
var subscriptionService = require('../../services/subscriptionService');
var oeCampaignService = require('../../services/oeCampaignService');
var validateData = require('../../lib/jsonSchemaUtil');

var Q = require('q');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

var fs = require('fs');
var path = require('path');
var util = require('util');
var constants = require('../../lib/constants');

//========================================================================================TestCases starts below

describe('campaignService::Campaign Service TestSuite', () => {

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

    describe('Method: createCampaign() - create an RFM Amount (Discount) campaign ', () => {

        it('should return HTTP status 201 (CREATED) with campaign details', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            var campaignDetailsReturned = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToReturnStub_OK.json')));

            let request = {'body': campaignToCreate};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.CREATED,
                'body': campaignDetailsReturned
            };

            let stubValidateCampaignRequestData = sinon.stub(campaignService, 'validateCampaignRequestData');
            stubValidateCampaignRequestData.resolves(null);

            let stubCreateCampaignReq = sinon.stub(campaignService, 'createCampaignReq');
            stubCreateCampaignReq.resolves(campaignDetailsReturned);

            let sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.createCampaign(request, response)
                .then((campaignResponse) => {
                    expect(campaignResponse).to.deep.equal(response);
                    expect(campaignService.validateCampaignRequestData).to.have.been.calledOnce;
                    expect(campaignService.createCampaignReq).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    stubValidateCampaignRequestData.restore();
                    stubCreateCampaignReq.restore();
                    sendResponseStub.restore();
                    done();
            });

        }); //end it

        it('should return HTTP status 422 (UNPROCESSABLE_ENTITY) if type is missing in the request', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaign_ERR_unprocessableEntity.json')));

            let errorArray = [{
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'type',
                'originalValue': '',
                'errorMessage': 'Type is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#campaignDescription.type'
            }];

            let request = {'body': campaignToCreate};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.UNPROCESSABLE_ENTITY,
                'body': errorArray
            };

            let stubValidateCampaignRequestData = sinon.stub(campaignService, 'validateCampaignRequestData');
            stubValidateCampaignRequestData.resolves(errorArray);

            let sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.createCampaign(request, response)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(response);
                    expect(campaignService.validateCampaignRequestData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    stubValidateCampaignRequestData.restore();
                    sendResponseStub.restore();
                    done();
            });

        }); //end it

        it('should return HTTP status 500 (INTERNAL_SERVER_ERROR) if there is any issue during validateCampaignRequestData', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaign_ERR_unprocessableEntity.json')));

            let request = {'body': campaignToCreate};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.INTERNAL_SERVER_ERROR
            };

            let stubValidateCampaignRequestData = sinon.stub(campaignService, 'validateCampaignRequestData');
            stubValidateCampaignRequestData.rejects('errorThrown');

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            campaignService.createCampaign(request, response)
                .then((oError) => {
                    expect(oError).to.deep.equal(response);
                    expect(campaignService.validateCampaignRequestData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
                    stubValidateCampaignRequestData.restore();
                    sendResponseWoBodyStub.restore();
                    done();
                });

        }); //end it

        it('should return HTTP status 500 (INTERNAL_SERVER_ERROR) if there is any issue during createCampaignReq', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaign_ERR_unprocessableEntity.json')));

            let request = {'body': campaignToCreate};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.INTERNAL_SERVER_ERROR
            };

            let errorArray = [];
            let stubValidateCampaignRequestData = sinon.stub(campaignService, 'validateCampaignRequestData');
            stubValidateCampaignRequestData.resolves(errorArray);

            let stubCreateCampaignReq = sinon.stub(campaignService, 'createCampaignReq');
            stubCreateCampaignReq.rejects('errorThrown');

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            campaignService.createCampaign(request, response)
                .then((oError) => {
                    expect(oError).to.deep.equal(response);
                    expect(campaignService.validateCampaignRequestData).to.have.been.calledOnce;
                    expect(campaignService.createCampaignReq).to.have.been.calledOnce;
                    expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
                    stubValidateCampaignRequestData.restore();
                    stubCreateCampaignReq.restore();
                    sendResponseWoBodyStub.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: createCampaign()

    describe('Method: validateCampaignRequestData() - validate campaign request data ', () => {

        it('should return error JSON if type is not present in the request', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateCampaignRequestData_ERR_typenotpresent.json')));

            let errorArray = [{
                'errorCode': 'MISSING_FIELD_VALUE',
                'field': 'type',
                'originalValue': '',
                'errorMessage': 'Type is required',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/MISSING_FIELD_VALUE#campaignDescription.type'
            }];

            let request = {'body': campaignToCreate};

            let stubValidateSchema = sinon.stub(validateData, 'validateSchema');
            stubValidateSchema.resolves(errorArray);

            let stubValidateCampaignBasicDetails = sinon.stub(campaignService, 'validateCampaignBasicDetails');
            stubValidateCampaignBasicDetails.resolves(errorArray);

            let stubValidateDriverAndBenefitsDetails = sinon.stub(campaignService, 'validateDriverAndBenefitsDetails');
            stubValidateDriverAndBenefitsDetails.resolves(errorArray);

            campaignService.validateCampaignRequestData(request, campaignToCreate)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(validateData.validateSchema).to.have.been.calledOnce;
                    expect(campaignService.validateCampaignBasicDetails).to.have.been.calledOnce;
                    expect(campaignService.validateDriverAndBenefitsDetails).to.have.been.calledOnce;
                    stubValidateSchema.restore();
                    stubValidateCampaignBasicDetails.restore();
                    stubValidateDriverAndBenefitsDetails.restore();
                    done();
                });

        }); //end it

        it('should pass the test if there are no errors', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateCampaignRequestData_OK.json')));

            let errorArray = [];

            let request = {'body': campaignToCreate};

            let stubValidateSchema = sinon.stub(validateData, 'validateSchema');
            stubValidateSchema.resolves(errorArray);

            let stubValidateCampaignBasicDetails = sinon.stub(campaignService, 'validateCampaignBasicDetails');
            stubValidateCampaignBasicDetails.resolves(errorArray);

            let stubValidateDriverAndBenefitsDetails = sinon.stub(campaignService, 'validateDriverAndBenefitsDetails');
            stubValidateDriverAndBenefitsDetails.resolves(errorArray);

            campaignService.validateCampaignRequestData(request, campaignToCreate)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(validateData.validateSchema).to.have.been.calledOnce;
                    expect(campaignService.validateCampaignBasicDetails).to.have.been.calledOnce;
                    expect(campaignService.validateDriverAndBenefitsDetails).to.have.been.calledOnce;
                    stubValidateSchema.restore();
                    stubValidateCampaignBasicDetails.restore();
                    stubValidateDriverAndBenefitsDetails.restore();
                    done();
            });

        }); //end it

        it('should return error when there is any issue during validateSchema', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            let errorArray = [];

            let request = {'body': campaignToCreate};
            let err = 'errorThrown';
            let respErr = 'Error: errorThrown';
            let stubValidateSchema = sinon.stub(validateData, 'validateSchema');
            stubValidateSchema.rejects(err);

            campaignService.validateCampaignRequestData(request, campaignToCreate)
                .fail((responseError) => {
                    expect(responseError.toString()).to.deep.equal(respErr.toString());
                    expect(validateData.validateSchema).to.have.been.calledOnce;
                    stubValidateSchema.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateCampaignRequestData()

    describe('Method: validateCampaignBasicDetails() - validate campaign basic fields in request ', () => {

        it('should return error JSON if start date is not in expected format', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateCampaignBasicDetails_ERR_startDateInvalid.json')));

            let requestErrorArray = [];
            let errorArray = [{
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'startDate',
                'originalValue': 'A0170327',
                'errorMessage': 'Invalid start date',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#startDate'
            }];

            let stubValidateStartDateFormat = sinon.stub(serviceHelper, 'validateStartDateFormat');
            stubValidateStartDateFormat.resolves(errorArray);

            let stubValidateEndDateFormat = sinon.stub(serviceHelper, 'validateEndDateFormat');
            stubValidateEndDateFormat.resolves(errorArray);

            let stubValidateStartDateLessThanToday = sinon.stub(serviceHelper, 'validateStartDateLessThanToday');
            stubValidateStartDateLessThanToday.resolves(errorArray);

            let stubValidateEndDateLessThanStartDate = sinon.stub(serviceHelper, 'validateEndDateLessThanStartDate');
            stubValidateEndDateLessThanStartDate.resolves(errorArray);

            let stubValidateOwnerType = sinon.stub(serviceHelper, 'validateOwnerType');
            stubValidateOwnerType.resolves(errorArray);

            campaignService.validateCampaignBasicDetails(campaignToCreate, requestErrorArray)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(serviceHelper.validateStartDateFormat).to.have.been.calledOnce;
                    expect(serviceHelper.validateEndDateFormat).to.have.been.calledOnce;
                    expect(serviceHelper.validateStartDateLessThanToday).to.have.been.calledOnce;
                    expect(serviceHelper.validateEndDateLessThanStartDate).to.have.been.calledOnce;
                    expect(serviceHelper.validateOwnerType).to.have.been.calledOnce;
                    stubValidateStartDateFormat.restore();
                    stubValidateEndDateFormat.restore();
                    stubValidateStartDateLessThanToday.restore();
                    stubValidateEndDateLessThanStartDate.restore();
                    stubValidateOwnerType.restore();
                    done();
                });

        }); //end it

        it('should pass the test if there are no errors', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateCampaignBasicDetails_OK.json')));

            let requestErrorArray = [];
            let errorArray = [];

            let stubValidateStartDateFormat = sinon.stub(serviceHelper, 'validateStartDateFormat');
            stubValidateStartDateFormat.resolves(errorArray);

            let stubValidateEndDateFormat = sinon.stub(serviceHelper, 'validateEndDateFormat');
            stubValidateEndDateFormat.resolves(errorArray);

            let stubValidateStartDateLessThanToday = sinon.stub(serviceHelper, 'validateStartDateLessThanToday');
            stubValidateStartDateLessThanToday.resolves(errorArray);

            let stubValidateEndDateLessThanStartDate = sinon.stub(serviceHelper, 'validateEndDateLessThanStartDate');
            stubValidateEndDateLessThanStartDate.resolves(errorArray);

            let stubValidateOwnerType = sinon.stub(serviceHelper, 'validateOwnerType');
            stubValidateOwnerType.resolves(errorArray);

            campaignService.validateCampaignBasicDetails(campaignToCreate, requestErrorArray)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(serviceHelper.validateStartDateFormat).to.have.been.calledOnce;
                    expect(serviceHelper.validateEndDateFormat).to.have.been.calledOnce;
                    expect(serviceHelper.validateStartDateLessThanToday).to.have.been.calledOnce;
                    expect(serviceHelper.validateEndDateLessThanStartDate).to.have.been.calledOnce;
                    expect(serviceHelper.validateOwnerType).to.have.been.calledOnce;
                    stubValidateStartDateFormat.restore();
                    stubValidateEndDateFormat.restore();
                    stubValidateStartDateLessThanToday.restore();
                    stubValidateEndDateLessThanStartDate.restore();
                    stubValidateOwnerType.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateCampaignBasicDetails()

    describe('Method: validateDriverAndBenefitsDetails() - validate campaign driver and benefit details in request ', () => {

        it('should return error JSON if discount fixed amount is not in expected format', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateDriverAndBenefitsDetails_ERR_discountFixedAmountInvalid.json')));

            let requestErrorArray = [];
            let errorArray = [{
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'discountFixedAmount',
                'originalValue': 0,
                'errorMessage': 'Discount fixed amount should be between 0.01 and 9999999999.99',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#discountFixedAmount'
            }];

            let stubValidateCounterResetDetails = sinon.stub(serviceHelper, 'validateCounterResetDetails');
            stubValidateCounterResetDetails.resolves(errorArray);

            let stubValidateDiscountBenefitDetails = sinon.stub(serviceHelper, 'validateDiscountBenefitDetails');
            stubValidateDiscountBenefitDetails.resolves(errorArray);

            let stubValidateScenarioMessageDetails = sinon.stub(serviceHelper, 'validateScenarioMessageDetails');
            stubValidateScenarioMessageDetails.resolves(errorArray);

            campaignService.validateDriverAndBenefitsDetails(campaignToCreate, requestErrorArray)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(serviceHelper.validateCounterResetDetails).to.have.been.calledOnce;
                    expect(serviceHelper.validateDiscountBenefitDetails).to.have.been.calledOnce;
                    expect(serviceHelper.validateScenarioMessageDetails).to.have.been.calledOnce;
                    stubValidateCounterResetDetails.restore();
                    stubValidateDiscountBenefitDetails.restore();
                    stubValidateScenarioMessageDetails.restore();
                    done();
                });

        }); //end it

        it('should pass the test if there are no errors', (done) => {

            var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/validateDriverAndBenefitsDetails_OK.json')));

            let requestErrorArray = [];
            let errorArray = [];

            let stubValidateCounterResetDetails = sinon.stub(serviceHelper, 'validateCounterResetDetails');
            stubValidateCounterResetDetails.resolves(errorArray);

            let stubValidateDiscountBenefitDetails = sinon.stub(serviceHelper, 'validateDiscountBenefitDetails');
            stubValidateDiscountBenefitDetails.resolves(errorArray);

            let stubValidateScenarioMessageDetails = sinon.stub(serviceHelper, 'validateScenarioMessageDetails');
            stubValidateScenarioMessageDetails.resolves(errorArray);

            campaignService.validateDriverAndBenefitsDetails(campaignToCreate, requestErrorArray)
                .then((responseErrorArray) => {
                    expect(responseErrorArray).to.deep.equal(errorArray);
                    expect(serviceHelper.validateCounterResetDetails).to.have.been.calledOnce;
                    expect(serviceHelper.validateDiscountBenefitDetails).to.have.been.calledOnce;
                    expect(serviceHelper.validateScenarioMessageDetails).to.have.been.calledOnce;
                    stubValidateCounterResetDetails.restore();
                    stubValidateDiscountBenefitDetails.restore();
                    stubValidateScenarioMessageDetails.restore();
                    done();
                });

        }); //end it

    }); //end describe for Method: validateCampaignBasicDetails()

    describe('Method: createCampaignReq() - Create campaign request ', () => {

        it('should return the expected campaign response', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

			var campaignDetailsReturned = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToReturnStub_OK.json')));

            let responseData = {
                'campaignTableObj': {
                    'campaign_id': 1
                },
                'scenarioTableObj': {
                    'scenario_id': 1
                },
                'scenarioMessagesTableObj': {
                    'scenario_id': 1
                }
            };

            let stubConstructCampaignRelatedData = sinon.stub(campaignService, 'constructCampaignRelatedData');
            stubConstructCampaignRelatedData.resolves(responseData);

            let stubCreateCampaignTransaction = sinon.stub(campaignService, 'createCampaignTransaction');
            stubCreateCampaignTransaction.resolves(null);

            let stubConstructCreateCampaignResponse = sinon.stub(campaignService, 'constructCreateCampaignResponse');
            stubConstructCreateCampaignResponse.resolves(campaignDetailsReturned);

            campaignService.createCampaignReq(campaignToCreate)
                .then((campaignResponse) => {
                    expect(campaignResponse).to.deep.equal(campaignDetailsReturned);
                    expect(campaignService.constructCampaignRelatedData).to.have.been.calledOnce;
                    expect(campaignService.createCampaignTransaction).to.have.been.calledOnce;
                    expect(campaignService.constructCreateCampaignResponse).to.have.been.calledOnce;
                    stubConstructCampaignRelatedData.restore();
                    stubCreateCampaignTransaction.restore();
                    stubConstructCreateCampaignResponse.restore();
                    done();
                });

        }); //end it

        it('should return error if there is any issue in create campaign request', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            let responseData = {
                'campaignTableObj': {
                    'campaign_id': 1
                },
                'scenarioTableObj': {
                    'scenario_id': 1
                },
                'scenarioMessagesTableObj': {
                    'scenario_id': 1
                }
            };

            let stubConstructCampaignRelatedData = sinon.stub(campaignService, 'constructCampaignRelatedData');
            stubConstructCampaignRelatedData.resolves(responseData);

            let err = 'DB - Unique constraint error';
            let errResponse = 'Error: DB - Unique constraint error';
            let stubCreateCampaignTransaction = sinon.stub(campaignService, 'createCampaignTransaction');
            stubCreateCampaignTransaction.rejects(err);

            campaignService.createCampaignReq(campaignToCreate)
                .fail((errorResponse) => {
                    expect(errorResponse.toString()).to.deep.equal(errResponse.toString());
                    expect(campaignService.constructCampaignRelatedData).to.have.been.calledOnce;
                    expect(campaignService.createCampaignTransaction).to.have.been.calledOnce;
                    stubConstructCampaignRelatedData.restore();
                    stubCreateCampaignTransaction.restore();
                    done();
            });

        }); //end it

        it('should return error if there is any issue in constructCampaignRelatedData', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            let err = 'errorThrown';
            let respErr = 'Error: errorThrown';

            let stubConstructCampaignRelatedData = sinon.stub(campaignService, 'constructCampaignRelatedData');
            stubConstructCampaignRelatedData.rejects(err);

            campaignService.createCampaignReq(campaignToCreate)
                .fail((errorResponse) => {
                    expect(errorResponse.toString()).to.deep.equal(respErr.toString());
                    expect(campaignService.constructCampaignRelatedData).to.have.been.calledOnce;
                    stubConstructCampaignRelatedData.restore();
                    done();
                });

        }); //end it

    }); ////end describe for Method: createCampaignReq()


    describe('Method: createCampaignRelatedEntries() - Create entries in all campaign related tables ', () => {

        it('should create campaign related entries and return null as expected', (done) => {

            let campaignTableObj = {
                'campaign_id': 1,
                'name': 'XLS Amount Campaign 1',
                'status': 'E0'
            };

            let stubStoreCampaignEntry = sinon.stub(campaignModel, 'storeCampaignEntry');
            stubStoreCampaignEntry.resolves('');

            let stubStoreCampaignScenario = sinon.stub(campaignModel, 'storeCampaignScenario');
            stubStoreCampaignScenario.resolves('');

            let stubStoreCampaignScenarioMessage = sinon.stub(campaignModel, 'storeCampaignScenarioMessage');
            stubStoreCampaignScenarioMessage.resolves('');

            campaignService.createCampaignRelatedEntries(campaignTableObj)
                .then((response) => {
                    expect(response).to.deep.equal('');
                    expect(campaignModel.storeCampaignEntry).to.have.been.calledOnce;
                    expect(campaignModel.storeCampaignScenario).to.have.been.calledOnce;
                    expect(campaignModel.storeCampaignScenarioMessage).to.have.been.calledOnce;
                    stubStoreCampaignEntry.restore();
                    stubStoreCampaignScenario.restore();
                    stubStoreCampaignScenarioMessage.restore();
                    done();
            });

        }); //end it

        it('should throw error when there is any issue during creation of campaign related entries', (done) => {

            let campaignTableObj = {
                'campaign_id': 1,
                'name': 'XLS Amount Campaign 1',
                'status': 'E0'
            };

            let err = 'DB - Unique constraint error';
            let errResponse = 'Error: DB - Unique constraint error';

            let stubStoreCampaignEntry = sinon.stub(campaignModel, 'storeCampaignEntry');
            stubStoreCampaignEntry.rejects(err);

            campaignService.createCampaignRelatedEntries(campaignTableObj)
                .fail((errorResponse) => {
                    expect(errorResponse.toString()).to.deep.equal(errResponse.toString());
                    expect(campaignModel.storeCampaignEntry).to.have.been.calledOnce;
                    stubStoreCampaignEntry.restore();
                    done();
            });

        }); //end it

    }); ////end describe for Method: createCampaignReq()

    describe('Method: constructCampaignRelatedData() - Construct campaign related data', () => {

        it('should return campaign data when there are no errors', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            let responseData = {
                'campaignTableObj': {
                    'campaign_id': 1
                },
                'scenarioTableObj': {
                    'scenario_id': 1
                },
                'scenarioMessagesTableObj': {
                    'scenario_id': 1
                },
                'smsMessageTableObj': {
                    'sms_message_iid': 1
                },
                'campaignEventsTableObj': {
                    'campaign_id': 1
                }
            };

            let campaignTableObj = {
                'campaign_id': 1
            };

            let scenarioTableObj = {
                'scenario_id': 1
            };

            let scenarioMessagesTableObj = {
                'scenario_id': 1
            };

            let smsMessageTableObj = {
                'sms_message_iid': 1
            };

            let campaignEventsTableObj = {
                'campaign_id': 1
            };

            let stubGetSequenceNextValue = sinon.stub(commonDBUtil, 'getSequenceNextValue');
            stubGetSequenceNextValue.resolves(1);

            let stubStoreCampaignScenario = sinon.stub(campaignService, 'constructCampaignTableObj');
            stubStoreCampaignScenario.resolves(campaignTableObj);

            let stubConstructScenarioTableObj = sinon.stub(campaignService, 'constructScenarioTableObj');
            stubConstructScenarioTableObj.resolves(scenarioTableObj);

            let stubConstructScenarioMessagesTableObj = sinon.stub(campaignService, 'constructScenarioMessagesTableObj');
            stubConstructScenarioMessagesTableObj.resolves(scenarioMessagesTableObj);

            let stubConstructSMSMessageTableObj = sinon.stub(campaignService, 'constructSMSMessageTableObj');
            stubConstructSMSMessageTableObj.resolves(smsMessageTableObj);

            let stubCampaignEventsTableObj = sinon.stub(campaignService, 'constructCampaignEventsTableObj');
            stubCampaignEventsTableObj.resolves(campaignEventsTableObj);

            campaignService.constructCampaignRelatedData(campaignToCreate)
                .then((response) => {
                    expect(response).to.deep.equal(responseData);
                    expect(commonDBUtil.getSequenceNextValue).to.have.been.calledTwice;
                    expect(campaignService.constructCampaignTableObj).to.have.been.calledOnce;
                    expect(campaignService.constructScenarioTableObj).to.have.been.calledOnce;
                    expect(campaignService.constructScenarioMessagesTableObj).to.have.been.calledOnce;
                    expect(campaignService.constructSMSMessageTableObj).to.have.been.calledOnce;
                    expect(campaignService.constructCampaignEventsTableObj).to.have.been.calledOnce;
                    stubGetSequenceNextValue.restore();
                    stubStoreCampaignScenario.restore();
                    stubConstructScenarioTableObj.restore();
                    stubConstructScenarioMessagesTableObj.restore();
                    stubConstructSMSMessageTableObj.restore();
                    stubCampaignEventsTableObj.restore();
                    done();
            });

        }); //end it

        it('should return error when there is any issue during getSequenceNextValue', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

            let err = 'DB - Error while getting sequence nextval';
            let errResponse = 'Error: DB - Error while getting sequence nextval';

            let stubGetSequenceNextValue = sinon.stub(commonDBUtil, 'getSequenceNextValue');
            stubGetSequenceNextValue.rejects(err);

            campaignService.constructCampaignRelatedData(campaignToCreate)
                .fail((errorResponse) => {
                    expect(errorResponse.toString()).to.deep.equal(errResponse.toString());
                    expect(commonDBUtil.getSequenceNextValue).to.have.been.calledOnce;
                    stubGetSequenceNextValue.restore();
                    done();
            });

        }); //end it

    }); ////end describe for Method: constructCampaignRelatedData()

    describe('Method: constructCreateCampaignResponse() - Construct create campaign response', () => {

        it('should return campaign response when there are no errors', (done) => {

			var campaignToCreate = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToCreateStub_OK.json')));

			var campaignDetailsReturned = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignToReturnStub_OK.json')));

            let campaignId = 1;
            let stubGetRelatedCampaignsResponseData = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            stubGetRelatedCampaignsResponseData.resolves(campaignDetailsReturned);

            campaignService.constructCreateCampaignResponse(campaignToCreate, campaignId)
                .then((response) => {
                    expect(response).to.deep.equal(campaignDetailsReturned);
                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    stubGetRelatedCampaignsResponseData.restore();
                    done();
                });

        }); //end it

    }); ////end describe for Method: constructCreateCampaignResponse()

    describe('Method: getCampaigns() - get all campaigns', function(){

        it('should return HTTP Status 200 (OK) with empty 0/n number of campaigns', function(done){

            var campaignsResponse = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/getCampaignsResponseStub_OK.json')));
            var request = {};
            request.query = {};

            var response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
                'body': campaignsResponse
            };

            var constructRequestParameterDBFromGetCampaignsRequestQueryStub = sinon.stub(campaignService, 'constructRequestParameterDBFromGetCampaignsRequestQuery');
            constructRequestParameterDBFromGetCampaignsRequestQueryStub.returns({});

            var getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.resolves({});

            var formatArrayCampaignsForResponseStub = sinon.stub(campaignService, 'formatArrayCampaignsForResponse');
            formatArrayCampaignsForResponseStub.resolves({});

            var sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.getCampaigns(request, response)
                .then(function(campaigns){
                    expect(campaigns).to.deep.equal(response);
                    expect(campaignService.constructRequestParameterDBFromGetCampaignsRequestQuery).to.have.been.calledOnce;
                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(campaignService.formatArrayCampaignsForResponse).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    constructRequestParameterDBFromGetCampaignsRequestQueryStub.restore();
                    getRelatedCampaignsResponseDataStub.restore();
                    formatArrayCampaignsForResponseStub.restore();
                    sendResponseStub.restore();
                    done();
                });
        });

        //it();

    }); // end get all campaigns

    describe('Method: getRelatedCampaignsResponseData() - get all related campaign data from db and form array of campaign object', function(){

        it('should return Array Of campaign object', function(done){

            var campaignRequestParameters = {};
            var response = [{'test': 'testValue'}];

            // TODO: provide the content
            var model_getCampaignsStub = sinon.stub(campaignModel, 'getCampaigns');
            model_getCampaignsStub.resolves({});

            var model_getRfmScenariosStub = sinon.stub(campaignModel, 'getRfmScenarios');
            model_getRfmScenariosStub.resolves({});

            var model_getCampaignEventsStub = sinon.stub(campaignModel, 'getCampaignEvents');
            model_getCampaignEventsStub.resolves({});

            var constructCampaignsResponseStub = sinon.stub(campaignService, 'constructCampaignsResponse');
            constructCampaignsResponseStub.resolves(response);

            campaignService.getRelatedCampaignsResponseData(campaignRequestParameters)
                .then(function(arrayCampaigns){
                    expect(arrayCampaigns).to.deep.equal(response);
                    expect(campaignModel.getCampaigns).to.have.been.calledOnce;
                    expect(campaignModel.getRfmScenarios).to.have.been.calledOnce;
                    expect(campaignModel.getCampaignEvents).to.have.been.calledOnce;
                    expect(campaignService.constructCampaignsResponse).to.have.been.calledOnce;
                    model_getCampaignsStub.restore();
                    model_getRfmScenariosStub.restore();
                    model_getCampaignEventsStub.restore();
                    constructCampaignsResponseStub.restore();
                    done();
                });
        });

    }); // end of getRelatedCampaignsResponseData

    describe('Method: constructCampaignsResponse() - Construct Array of Campaign Response object from database.', function(){

        it('Should return Array of campaign object', function(done){

            var dbResult = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructCampaignsResponse_data.json')));
            var campaignsResult = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructCampaignsResponse_response.json')));

            var convertCampaignAcceptedFrequencyStub = sinon.stub(serviceHelper, 'convertCampaignAcceptedFrequency');
            convertCampaignAcceptedFrequencyStub.returns('Every transaction');
            var convertCampaignTypeForResponseStub = sinon.stub(serviceHelper, 'convertCampaignTypeForResponse');
            convertCampaignTypeForResponseStub.returns('Amount');
            var convertCampaignSubTypeForResponseStub = sinon.stub(serviceHelper, 'convertCampaignSubTypeForResponse');
            convertCampaignSubTypeForResponseStub.returns('Discount');
            var convertMerchantCampaignTypeForResponseStub = sinon.stub(serviceHelper, 'convertMerchantCampaignTypeForResponse');
            convertMerchantCampaignTypeForResponseStub.returns(false);
            var convertMerchantHostAndVirtualTerminalForResponseStub = sinon.stub(serviceHelper, 'convertMerchantHostAndVirtualTerminalForResponse');
            convertMerchantHostAndVirtualTerminalForResponseStub.returns(false);
            var constructDateByFormatStub = sinon.stub(serviceHelper, 'constructDateByFormat');
            constructDateByFormatStub.returns('20170329');
            var convertCampaignActiveStatusStub = sinon.stub(serviceHelper, 'convertCampaignActiveStatus');
            convertCampaignActiveStatusStub.returns('Active');

            var constructDriverAndBenefitDetailsStub = sinon.stub(campaignService, 'constructDriverAndBenefitDetails');
            constructDriverAndBenefitDetailsStub.returns({});

            expect(campaignService.constructCampaignsResponse(dbResult, false)).to.deep.equal(campaignsResult);
            expect(campaignService.constructDriverAndBenefitDetails).to.have.been.calledOnce;
            expect(serviceHelper.convertCampaignTypeForResponse).to.have.been.calledOnce;
            expect(serviceHelper.convertCampaignSubTypeForResponse).to.have.been.calledOnce;
            expect(serviceHelper.convertMerchantCampaignTypeForResponse).to.have.been.calledOnce;
            expect(serviceHelper.convertMerchantHostAndVirtualTerminalForResponse).to.have.been.calledOnce;
            expect(serviceHelper.constructDateByFormat).to.have.been.called;
            expect(serviceHelper.convertCampaignActiveStatus).to.have.been.calledOnce;
            convertCampaignTypeForResponseStub.restore();
            convertCampaignSubTypeForResponseStub.restore();
            convertMerchantCampaignTypeForResponseStub.restore();
            convertMerchantHostAndVirtualTerminalForResponseStub.restore();
            constructDateByFormatStub.restore();
            convertCampaignActiveStatusStub.restore();
            constructDriverAndBenefitDetailsStub.restore();
            convertCampaignAcceptedFrequencyStub.restore();

            done();

        });
    }); // end of constructCampaignsResponse

    describe('Method: constructDriverAndBenefitDetails() - construct Array Campaigns based on campaign Type in DB', function(){

        it('Should return Array of RFM campaign object for campaignType=A', function(done){

            var responseStub = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructDriverAndBenefitDetails_response.json')));
            var constructRfmCampaignDetailResponseStub = sinon.stub(campaignService, 'constructRfmCampaignDetailResponse');
            constructRfmCampaignDetailResponseStub.returns(responseStub);
            var response = {'amountDriverAndBenefitsDetails':responseStub};

            var campaign = {};
            campaign.campaign_type = 'A';
            campaign.campaign_id = 1;
            expect(campaignService.constructDriverAndBenefitDetails(campaign, {})).to.deep.equal(response);
            expect(campaignService.constructRfmCampaignDetailResponse).to.have.calledOnce;
            constructRfmCampaignDetailResponseStub.restore();

            done();
        });
    });// end of constructCampaignDefinitionResponseByCampaignTypeDb


    describe('Method: constructRfmCampaignDetailResponse() - Construct RFM campaign details object', function(){

        it('Should return Array of RFM campaign object', function(done){

            var dbResult = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructRfmCampaignDetailResponse_data.json')));
            var response = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructRfmCampaignDetailResponse_response.json')));

            var convertCounterConfigurationStub = sinon.stub(serviceHelper, 'convertCounterConfiguration');
            convertCounterConfigurationStub.returns('No Override');
            var convertCampaignCounterResetTypeStub = sinon.stub(serviceHelper, 'convertCampaignCounterResetType');
            convertCampaignCounterResetTypeStub.returns('Reset x day(s) after each transaction date');
            var constructRfmScenarioDetailResponseStub = sinon.stub(campaignService, 'constructRfmScenarioDetailResponse');
            constructRfmScenarioDetailResponseStub.returns([]);

            var campaignObj = {
                'campaign_id': 128
            };

            expect(campaignService.constructRfmCampaignDetailResponse(campaignObj, dbResult)).to.deep.equal(response);
            convertCounterConfigurationStub.restore();
            convertCampaignCounterResetTypeStub.restore();
            constructRfmScenarioDetailResponseStub.restore();

            done();

        });
    });// end of constructRfmCampaignDetailResponse

    describe('Method: constructRfmScenarioDetailResponse() - Construct Rfm Scenario details object', function(){

        it('Should return Array of RFM scenario object', function(done){

            var dbResult = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructRfmScenarioDetailResponse_data.json')));
            var response = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructRfmScenarioDetailResponse_response.json')));

            var convertScenarioRepeatRewardTypeStub = sinon.stub(serviceHelper, 'convertScenarioRepeatRewardType');
            convertScenarioRepeatRewardTypeStub.returns('Every transaction');
            var convertScenarioResetStub = sinon.stub(serviceHelper, 'convertScenarioReset');
            convertScenarioResetStub.returns('None');
            var constructDiscountBenefitDetailResponseStub = sinon.stub(campaignService, 'constructDiscountBenefitDetailResponse');
            constructDiscountBenefitDetailResponseStub.returns({});
            var constructReceiptMessagesResponseStub = sinon.stub(campaignService, 'constructReceiptMessagesResponse');
            constructReceiptMessagesResponseStub.returns([]);

            expect(campaignService.constructRfmScenarioDetailResponse(dbResult.campaigns[0], dbResult)).to.deep.equal(response);

            convertScenarioRepeatRewardTypeStub.restore();
            convertScenarioResetStub.restore();
            constructDiscountBenefitDetailResponseStub.restore();
            constructReceiptMessagesResponseStub.restore();

            done();
        });
    });// end of constructRfmScenarioDetailResponse

    describe('Method: constructDiscountBenefitDetailResponse() - Construct basic award details object of Discount', function(){

        it('Should return Discount Basic Award object', function(done){

            var discountDetail = {
                'type':'F',
                'amount': 10
            };

            var response = {
                'discountType': 'Fixed amount',
                'discountFixedAmount': 10
            };

            var convertAwardValueTypeStub = sinon.stub(serviceHelper, 'convertAwardValueType');
            convertAwardValueTypeStub.returns('Fixed amount');

            expect(campaignService.constructDiscountBenefitDetailResponse(discountDetail)).to.deep.equal(response);
            convertAwardValueTypeStub.restore();

            done();

        });
    }); // end of constructBasicAwardDetailResponse

    describe('Method: constructReceiptMessagesResponse() - Construct Array of message object', function(){

        it('Should return array of message', function(done){

            var scenario = {
                'msg_line1':'Sample receipt heading',
                'bold1':1,
                'msg_line2':'Sample receipt body',
                'bold2':0,
                'msg_line3':'','bold3':0,
                'msg_line4':'','bold4':0,
                'msg_line5':'','bold5':0,
                'msg_line6':'','bold6':0,
                'msg_line7':'','bold7':0,
                'msg_line8':'','bold8':0
            };

            var response = [
                {
                    'lineNumber': 1,
                    'message': 'Sample receipt heading',
                    'isMessagePrintedInBold': true
                },
                {
                    'lineNumber': 2,
                    'message': 'Sample receipt body',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 3,
                    'message': '',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 4,
                    'message': '',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 5,
                    'message': '',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 6,
                    'message': '',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 7,
                    'message': '',
                    'isMessagePrintedInBold': false
                },
                {
                    'lineNumber': 8,
                    'message': '',
                    'isMessagePrintedInBold': false
                }
            ];

            expect(campaignService.constructReceiptMessagesResponse(scenario)).to.deep.equal(response);

            done();
        });
    });// end of constructMessagesResponse

    describe('Method: formatArrayCampaignsForResponse() - Format the response of campaigns based on the format parameter.', function(){

        it('Should return Array of Campaigns with JSON format', function(){
            var data = {'Hello': 'HelloValue'};
            var response = {'Hello': 'HelloValue'};

            expect(campaignService.formatArrayCampaignsForResponse('JSON', data)).to.deep.equal(response);

        });
    }); // end of formatArrayCampaignsForResponse

    describe('Method: getCampaignByCampaignId() - get campaign by campaignId', function(){

        it('should return HTTP Status 200 (OK) with one campaign', function(done){

            var campaignsResponse = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/getCampaignByIdResponseStub_OK.json')));
            var request = {};
            request.query = {};
            request.params = {};
            request.params.campaignId = '1';

            var response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
                'body': campaignsResponse
            };

            var getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.resolves({});

            var formatArrayCampaignsForResponseStub = sinon.stub(campaignService, 'formatArrayCampaignsForResponse');
            formatArrayCampaignsForResponseStub.resolves({});

            var sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.getCampaignByCampaignId(request, response)
                .then(function(campaigns){
                    expect(campaigns).to.deep.equal(response);
                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(campaignService.formatArrayCampaignsForResponse).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    getRelatedCampaignsResponseDataStub.restore();
                    formatArrayCampaignsForResponseStub.restore();
                    sendResponseStub.restore();
                    done();
                });

        });

        //it();

    }); // end get all campaigns

    describe('Method: deleteCampaignRelatedEntries() - Deletes campaign related data from concerned database tables ', function(){

        it('should successfully Delete campaign related data from concerned database tables', function(done){

            var campaignId = 1;

            var getDBConnectionStub = sinon.stub(commonDBUtil, 'getDBConnection');
            getDBConnectionStub.resolves('');

            var setStatusDeletedInCampaignStub = sinon.stub(campaignModel, 'setStatusDeletedInCampaign');
            setStatusDeletedInCampaignStub.resolves('');

            var unsubscribeCampaignStub = sinon.stub(subscriptionService, 'unsubscribeCampaign');
            unsubscribeCampaignStub.resolves('');

            var oeRefreshDeleteCampaignStub = sinon.stub(oeCampaignService, 'oeRefreshDeleteCampaign');
            oeRefreshDeleteCampaignStub.resolves('');

            var commitTransactionStub = sinon.stub(commonDBUtil, 'commitTransaction');
            commitTransactionStub.resolves('');

            campaignService.deleteCampaignRelatedEntries(campaignId)
                .then(function(actualVal){
                    expect(actualVal).to.deep.equal('');
                    expect(commonDBUtil.getDBConnection).to.have.been.calledOnce;
                    expect(campaignModel.setStatusDeletedInCampaign).to.have.been.calledOnce;
                    expect(subscriptionService.unsubscribeCampaign).to.have.been.calledOnce;
                    expect(oeCampaignService.oeRefreshDeleteCampaign).to.have.been.calledOnce;
                    expect(commonDBUtil.commitTransaction).to.have.been.calledOnce;
                    getDBConnectionStub.restore();
                    setStatusDeletedInCampaignStub.restore();
                    unsubscribeCampaignStub.restore();
                    oeRefreshDeleteCampaignStub.restore();
                    commitTransactionStub.restore();
                    done();
                });
        });

    }); // end of deleteCampaignRelatedEntries

    describe('Method: deleteCampaign() - Will delete campaign, auto unsubscribe, & OE Refresh', function(){

        it('should return campaign details if campaign identifier deleted successfully ', (done) => {

            var campaignsResponse = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/getCampaignByIdResponseStub_OK.json')));

            let request = {
                'params': {'campaignId': '1'}
            };
            request.query = {};

            let tenantInfo = {
                'value': 'Basic T0NVSTpQcm90ZWN0JDE=',
                'tenantCode': 'AlphaBank',
                'isDeleteAllowedToNonMonoMerchant': 'true',
                'purpose': 'API Key to access from XLS76 UI'
            };

            var response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
                'body': campaignsResponse
            };

            var getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.resolves(campaignsResponse);

            var getTenantInfoFromGlobalStub = sinon.stub(commonUtil, 'getTenantInfoFromGlobal');
            getTenantInfoFromGlobalStub.returns(tenantInfo);

            var deleteCampaignRelatedEntriesStub = sinon.stub(campaignService, 'deleteCampaignRelatedEntries');
            deleteCampaignRelatedEntriesStub.resolves({});

            var sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.deleteCampaign(request, response)
                .then(function (campaign) {
                    expect(campaign).to.deep.equal(response);

                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(commonUtil.getTenantInfoFromGlobal).to.have.been.calledOnce;
                    expect(campaignService.deleteCampaignRelatedEntries).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;

                    getRelatedCampaignsResponseDataStub.restore();
                    getTenantInfoFromGlobalStub.restore();
                    deleteCampaignRelatedEntriesStub.restore();
                    sendResponseStub.restore();
                    done();
            });

        }); //end it

        it('should return HTTP status 422 (UNPROCESSABLE_ENTITY) if if deleteAllowed config is false and owner type is not merchant', (done) => {

            var campaignsResponse = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/deleteCampaignResponseStub_422_Multi_merchant.json')));
            var errorMessage = util.format(constants.MSG_CAMPAIGN_CAN_NOT_BE_DELETED,'Test RFM Camapign');
            var url = constants.HELP_URL + constants.INVALID_OPERATION + '#name';

            let errorJSON = [{
                'errorCode': constants.INVALID_OPERATION,
                'field': 'name',
                'originalValue': 'Test RFM Camapign',
                'errorMessage': errorMessage,
                'helpUrl': url
            }];

            let request = {
                'params': {'campaignId': '1'}
            };
            request.query = {};

            let tenantInfo = {
                'value': 'Basic T0NVSTpQcm90ZWN0JDE=',
                'tenantCode': 'AlphaBank',
                'isDeleteAllowedToNonMonoMerchant': 'false',
                'purpose': 'API Key to access from XLS76 UI'
            };

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.UNPROCESSABLE_ENTITY,
                'body': errorJSON
            };

            var getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.resolves(campaignsResponse);

            var getTenantInfoFromGlobalStub = sinon.stub(commonUtil, 'getTenantInfoFromGlobal');
            getTenantInfoFromGlobalStub.resolves(tenantInfo);

            var sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            campaignService.deleteCampaign(request, response)
                .then(function (bizError) {
                    expect(bizError).to.deep.equal(response);

                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(commonUtil.getTenantInfoFromGlobal).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;

                    getRelatedCampaignsResponseDataStub.restore();
                    getTenantInfoFromGlobalStub.restore();
                    sendResponseStub.restore();
                    done();
                });

        }); //end it

        it('should return HTTP status 404 (NOT_FOUND) if campaign identifier is non-numeric', (done) => {

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

            let request = {
                'params': {'campaignId': 'abcd1234'}
            };
            request.query = {};

            let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            var returnRes = campaignService.deleteCampaign(request, response);

            expect(returnRes).to.deep.equal(expectedVal);
            expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
            sendResponseWoBodyStub.restore();
            done();

        }); //end it

        it('should return HTTP status 404 (NOT_FOUND) if campaign identifier does not exist', (done) => {

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

            let request = {
                'params': {'campaignId': '999999999'}
            };
            request.query = {};

            let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.NOT_FOUND
            };

            let getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.resolves(null);

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            var returnRes = campaignService.deleteCampaign(request, response)
                .then(function (actual) {
                    expect(actual).to.deep.equal(expectedVal);

                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
                    getRelatedCampaignsResponseDataStub.restore();
                    sendResponseWoBodyStub.restore();
                done();
            });

        }); //end it

        it('should return HTTP status 500 (INTERNAL_SERVER_ERROR) if delete campaign throws error', (done) => {

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.INTERNAL_SERVER_ERROR
            };

            let request = {
                'params': {'campaignId': '1'}
            };
            request.query = {};

            let expectedVal = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.INTERNAL_SERVER_ERROR
            };

            let getRelatedCampaignsResponseDataStub = sinon.stub(campaignService, 'getRelatedCampaignsResponseData');
            getRelatedCampaignsResponseDataStub.rejects(expectedVal);

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            campaignService.deleteCampaign(request, response)
                .then(function (actual) {
                    expect(actual).to.deep.equal(expectedVal);

                    expect(campaignService.getRelatedCampaignsResponseData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
                    getRelatedCampaignsResponseDataStub.restore();
                    sendResponseWoBodyStub.restore();
                    done();
            });

        }); //end it

    }); //end describe for Method: deleteCampaign()

    describe('Method: createCampaignTransaction() - Create campaign, auto subscribe and OE Refresh successfully ', () => {

        it('should create camapign successfully ', (done) => {

            var expectedVal = '';
            var campaignObj = {'campaignTableObj':{'campaign_id':1}};
            var subscriptionObj = {};

            let getDBConnectionStub = sinon.stub(commonDBUtil, 'getDBConnection');
            getDBConnectionStub.resolves({});

            let createCampaignRelatedEntriesStub = sinon.stub(campaignService, 'createCampaignRelatedEntries');
            createCampaignRelatedEntriesStub.resolves('');

            let subscribeCampaignStub = sinon.stub(subscriptionService, 'subscribeCampaign');
            subscribeCampaignStub.resolves('');

            let oeRefreshCreateCampaignStub = sinon.stub(oeCampaignService, 'oeRefreshCreateCampaign');
            oeRefreshCreateCampaignStub.resolves('');

            let commitTransactionStub = sinon.stub(commonDBUtil, 'commitTransaction');
            commitTransactionStub.resolves('');

            campaignService.createCampaignTransaction(campaignObj, subscriptionObj)
                .then((actualVal) => {
                expect(actualVal).to.deep.equal(expectedVal);
                expect(commonDBUtil.getDBConnection).to.have.been.calledOnce;
                expect(campaignService.createCampaignRelatedEntries).to.have.been.calledOnce;
                expect(subscriptionService.subscribeCampaign).to.have.been.calledOnce;
                expect(oeCampaignService.oeRefreshCreateCampaign).to.have.been.calledOnce;
                expect(commonDBUtil.commitTransaction).to.have.been.calledOnce;
                getDBConnectionStub.restore();
                createCampaignRelatedEntriesStub.restore();
                subscribeCampaignStub.restore();
                oeRefreshCreateCampaignStub.restore();
                commitTransactionStub.restore();
                done();
            });

        }); //end it

    }); //end describe for Method: createCampaignTransaction()

    describe('Method: constructCampaignEventsTableObj() - Construct object for CAMPAIGN_EVENTS table', () => {

        it('should return campaign_events table object when there are no errors', (done) => {

            let campaignId = 1;
            let eventDaysArr = ['0101', '3112'];
            let campaignObj = {
                'driverAndBenefitsDetails': {
                    'eventDayDriverAndBenefitsDetails': {
                        'eventDayDriverScenariosAndBenefitsDetails': {
                            'basicScenarioDetails': {
                                'eventDays': eventDaysArr
                            }
                        }
                    }
                }
            };

            let campaignEventsData = {
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

            campaignService.constructCampaignEventsTableObj(campaignId, campaignObj)
                .then((response) => {
                    expect(response).to.deep.equal(campaignEventsData);
                    done();
                });

        }); //end it

    }); ////end describe for Method: constructCampaignEventsTableObj()

    describe('Method: constructBasicScenarioDetailResponse() - Construct RFM campaign details object', function(){

        it('Should return Array of RFM campaign object', function(done){

            var dbResult = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructEventCampaignDetailResponse_data.json')));
            var response = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/constructEventCampaignDetailResponse_response.json')));

            var constructRfmScenarioDetailResponseStub = sinon.stub(campaignService, 'constructRfmScenarioDetailResponse');
            constructRfmScenarioDetailResponseStub.returns([]);

            var campaignObj = {
                'campaign_id': 128,
                'campaign_subtype': 'D',
                'discount_amount': 5
            };

            expect(campaignService.constructBasicScenarioDetailResponse(campaignObj, dbResult)).to.deep.equal(response);
            constructRfmScenarioDetailResponseStub.restore();

            done();

        });
    });// end of constructBasicScenarioDetailResponse

}); //end describe


