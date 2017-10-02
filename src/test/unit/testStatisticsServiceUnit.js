/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var statisticsModel = require('../../models/statisticsModel');
var commonUtil = require('../../lib/commonUtil');
var commonDBUtil = require('../../lib/commonDBUtil');
var statisticsService = require('../../services/statisticsService');
var serviceHelper = require('../../services/serviceHelper');
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

describe('statisticsService::Statistics Service TestSuite', () => {

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

    describe('Method: campaignStatistics() - Campaign statistics ', () => {

        it('should return HTTP status 200 (OK) with statistics details', (done) => {

            var statisticsRequest = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/controllerGenericRequestStub.json')));

            var statisticsResponse = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/controllerGenericResponseStub.json')));

            let request = {'body': statisticsRequest};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.OK,
                'body': statisticsResponse
            };

            let stubValidateCampaignStatisticsRequestData = sinon.stub(statisticsService, 'validateCampaignStatisticsRequestData');
            stubValidateCampaignStatisticsRequestData.resolves(null);

            let stubComputeCampaignStatistics = sinon.stub(statisticsService, 'computeCampaignStatistics');
            stubComputeCampaignStatistics.resolves(statisticsResponse);

            let sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            statisticsService.campaignStatistics(request, response)
                .then((campaignStatisticsResponse) => {
                    expect(campaignStatisticsResponse).to.deep.equal(response);
                    expect(statisticsService.validateCampaignStatisticsRequestData).to.have.been.calledOnce;
                    expect(statisticsService.computeCampaignStatistics).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    stubValidateCampaignStatisticsRequestData.restore();
                    stubComputeCampaignStatistics.restore();
                    sendResponseStub.restore();
                    done();
            });

        }); //end it

        it('should return HTTP status 422 (UNPROCESSABLE_ENTITY) if rollUpPeriodType is missing in the request', (done) => {

            var statisticsRequest = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignStatisticsRequestStub_ERR_rollUpPeriodType.json')));

            let errorArray = [{
                'errorCode': 'UNKNOWN_FIELD_VALUE',
                'field': 'rollUpPeriodType',
                'originalValue': 'Per Week1',
                'errorMessage': 'No roll up period type of Per Week1 found',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/UNKNOWN_FIELD_VALUE#rollUpPeriodType'
            }];

            let request = {'body': statisticsRequest};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.UNPROCESSABLE_ENTITY,
                'body': errorArray
            };

            let stubValidateCampaignStatisticsRequestData = sinon.stub(statisticsService, 'validateCampaignStatisticsRequestData');
            stubValidateCampaignStatisticsRequestData.resolves(errorArray);

            let sendResponseStub = sinon.stub(commonUtil, 'sendResponse');
            sendResponseStub.returns(response);

            statisticsService.campaignStatistics(request, response)
                .then((errorResponse) => {
                    expect(errorResponse).to.deep.equal(response);
                    expect(statisticsService.validateCampaignStatisticsRequestData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponse).to.have.been.calledOnce;
                    stubValidateCampaignStatisticsRequestData.restore();
                    sendResponseStub.restore();
                    done();
            });

        }); //end it

        it('should return HTTP status 500 (INTERNAL_SERVER_ERROR) if there is any issue during validateCampaignRequestData', (done) => {

            var statisticsRequest = JSON.parse(fs.readFileSync(path.join(__dirname, '/data/createCampaignStatisticsRequestStub_ERR_rollUpPeriodType.json')));

            let request = {'body': statisticsRequest};

            let response = {
                'Content-Type': 'application/json; charset=utf-8',
                'Status': httpStatus.INTERNAL_SERVER_ERROR
            };

            let stubValidateCampaignStatisticsRequestData = sinon.stub(statisticsService, 'validateCampaignStatisticsRequestData');
            stubValidateCampaignStatisticsRequestData.rejects('errorThrown');

            let sendResponseWoBodyStub = sinon.stub(commonUtil, 'sendResponseWoBody');
            sendResponseWoBodyStub.returns(response);

            statisticsService.campaignStatistics(request, response)
                .then((oError) => {
                    expect(oError).to.deep.equal(response);
                    expect(statisticsService.validateCampaignStatisticsRequestData).to.have.been.calledOnce;
                    expect(commonUtil.sendResponseWoBody).to.have.been.calledOnce;
                    stubValidateCampaignStatisticsRequestData.restore();
                    sendResponseWoBodyStub.restore();
                    done();
                });

        }); //end it

        /*
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
        */

    }); //end describe for Method: createCampaign()


}); //end describe


