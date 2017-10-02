/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var subscriptionModel = require('../../models/subscriptionModel');
var subscriptionService = require('../../services/subscriptionService');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var httpStatus = require('http-status');

var sinonChai = require('sinon-chai');
chai.use(sinonChai);
require('sinon-as-promised');

//========================================================================================TestCases starts below

describe('subscriptionService::Subscription Service TestSuite', () => {

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

    describe('Method: unsubscribeCampaignDiscount() - Unsubscribe discount camapign ', () => {

        it('should return successful unsubscription of discount camapign ', (done) => {

            var expectedVal = '';
            var campaignIdToBeUnsubscribed = 1;

            var updateSlotsLeftForCampaignStub = sinon.stub(subscriptionModel, 'updateSlotsLeftForCampaign');
            updateSlotsLeftForCampaignStub.resolves('');

            var setStatusDeletedInLoopCampaignStub = sinon.stub(subscriptionModel, 'setStatusDeletedInLoopCampaign');
            setStatusDeletedInLoopCampaignStub.resolves('');

            subscriptionService.unsubscribeCampaign(campaignIdToBeUnsubscribed)
                .then((actualVal) => {
                    expect(actualVal).to.deep.equal(expectedVal);
                    expect(subscriptionModel.updateSlotsLeftForCampaign).to.have.been.calledOnce;
                    expect(subscriptionModel.setStatusDeletedInLoopCampaign).to.have.been.calledOnce;
                    updateSlotsLeftForCampaignStub.restore();
                    setStatusDeletedInLoopCampaignStub.restore();
                    done();
            });

        }); //end it

    }); //end describe for Method: createCampaign()

}); //end describe


