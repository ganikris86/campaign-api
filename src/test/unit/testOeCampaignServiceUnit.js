/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var oeCampaignModel = require('../../models/oeCampaignModel');
var subscriptionModel = require('../../models/subscriptionModel');
var oeCampaignService = require('../../services/oeCampaignService');
var oeCommonService = require('../../services/oeCommonService');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

//========================================================================================TestCases starts below

describe('oeCampaignService::OE Campaign Service TestSuite', () => {

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

    describe('Method: oeRefreshDeleteCampaign() - OE Refresh for delete campaign after unsubscribe campaign ', () => {

        it('should run successful OE refresh for delete camapign  ', (done) => {

            var expectedVal = '';
            var campaignIdTobeDeleted = 1;

            let stubGetOeActiveFlag = sinon.stub(oeCommonService, 'getOeActiveFlag');
            stubGetOeActiveFlag.resolves(1);

            let stubDeleteRowInOeCpg = sinon.stub(oeCampaignModel, 'deleteRowInOeCpg');
            stubDeleteRowInOeCpg.resolves('');

            let stubDeleteRowInOeCpgScenario = sinon.stub(oeCampaignModel, 'deleteRowInOeCpgScenario');
            stubDeleteRowInOeCpgScenario.resolves('');

            let stubDeleteRowInOeCpgAwdDef = sinon.stub(oeCampaignModel, 'deleteRowInOeCpgAwdDef');
            stubDeleteRowInOeCpgAwdDef.resolves('');

            let stubDeleteRowInOeCpgPreReq = sinon.stub(oeCampaignModel, 'deleteRowInOeCpgPreReq');
            stubDeleteRowInOeCpgPreReq.resolves('');

            let stubDeleteRowInOeTermMerchCpg = sinon.stub(oeCampaignModel, 'deleteRowInOeTermMerchCpg');
            stubDeleteRowInOeTermMerchCpg.resolves('');

            let stubDeleteRowInOeCpgPaybrandRange = sinon.stub(oeCampaignModel, 'deleteRowInOeCpgPaybrandRange');
            stubDeleteRowInOeCpgPaybrandRange.resolves('');

            oeCampaignService.oeRefreshDeleteCampaign(campaignIdTobeDeleted)
                .then((actualVal) => {
                    expect(actualVal).to.deep.equal(expectedVal);
                    expect(oeCommonService.getOeActiveFlag).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeCpg).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeCpgScenario).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeCpgAwdDef).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeCpgPreReq).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeTermMerchCpg).to.have.been.calledOnce;
                    expect(oeCampaignModel.deleteRowInOeCpgPaybrandRange).to.have.been.calledOnce;
                    stubGetOeActiveFlag.restore();
                    stubDeleteRowInOeCpg.restore();
                    stubDeleteRowInOeCpgScenario.restore();
                    stubDeleteRowInOeCpgAwdDef.restore();
                    stubDeleteRowInOeCpgPreReq.restore();
                    stubDeleteRowInOeTermMerchCpg.restore();
                    stubDeleteRowInOeCpgPaybrandRange.restore();
                    done();
            });

        }); //end it

    }); //end describe for Method: oeRefreshDeleteCampaign()

    describe('Method: oeRefreshCreateCampaign() - OE Refresh for create campaign after auto subscribe campaign ', () => {

        it('should run successful OE refresh for create camapign  ', (done) => {

            var expectedVal = '';
            var campaignIdTobeCreated = 1;

            let stubGetOeActiveFlag = sinon.stub(oeCommonService, 'getOeActiveFlag');
            stubGetOeActiveFlag.resolves(1);

            let storeOECpgEntryStub = sinon.stub(oeCampaignModel, 'storeOECpgEntry');
            storeOECpgEntryStub.resolves('');

            let storeOECpgScenarioEntryStub = sinon.stub(oeCampaignModel, 'storeOECpgScenarioEntry');
            storeOECpgScenarioEntryStub.resolves('');

            let storeOECpgAwdDefEntryStub = sinon.stub(oeCampaignModel, 'storeOECpgAwdDefEntry');
            storeOECpgAwdDefEntryStub.resolves('');

            let storeOECpgPreReqEntryStub = sinon.stub(oeCampaignModel, 'storeOECpgPreReqEntry');
            storeOECpgPreReqEntryStub.resolves('');

            let storeOETermMerchCpgStub = sinon.stub(oeCampaignModel, 'storeOETermMerchCpg');
            storeOETermMerchCpgStub.resolves('');

            let storeOECpgPaybrandRangeEntryStub = sinon.stub(oeCampaignModel, 'storeOECpgPaybrandRangeEntry');
            storeOECpgPaybrandRangeEntryStub.resolves('');

            let setLoopCampaignActivationAckDateStub = sinon.stub(subscriptionModel, 'setLoopCampaignActivationAckDate');
            setLoopCampaignActivationAckDateStub.resolves('');

            oeCampaignService.oeRefreshCreateCampaign(campaignIdTobeCreated)
                .then((actualVal) => {
                expect(actualVal).to.deep.equal(expectedVal);
                expect(oeCommonService.getOeActiveFlag).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOECpgEntry).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOECpgScenarioEntry).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOECpgAwdDefEntry).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOECpgPreReqEntry).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOETermMerchCpg).to.have.been.calledOnce;
                expect(oeCampaignModel.storeOECpgPaybrandRangeEntry).to.have.been.calledOnce;
                expect(subscriptionModel.setLoopCampaignActivationAckDate).to.have.been.calledOnce;
                stubGetOeActiveFlag.restore();
                storeOECpgEntryStub.restore();
                storeOECpgScenarioEntryStub.restore();
                storeOECpgAwdDefEntryStub.restore();
                storeOECpgPreReqEntryStub.restore();
                storeOETermMerchCpgStub.restore();
                storeOECpgPaybrandRangeEntryStub.restore();
                setLoopCampaignActivationAckDateStub.restore();
                done();
            });

        }); //end it

    }); //end describe for Method: oeRefreshCreateCampaign()

}); //end describe


