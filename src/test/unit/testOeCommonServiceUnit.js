/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var oeCommonModel = require('../../models/oeCommonModel');
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

describe('oeCommonService::OE Common Service TestSuite', () => {

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

    describe('Method: getOeActiveFlag() - Get OE Active flag ', () => {

        it('should return OE active flag value from database ', (done) => {

            var expectedVal = 1;

            var stubOeCommonModel = sinon.stub(oeCommonModel, 'getOeActiveFlag');
            stubOeCommonModel.resolves(expectedVal);

            oeCommonService.getOeActiveFlag()
                .then((actualVal) => {
                    expect(actualVal).to.deep.equal(expectedVal);
                    expect(oeCommonModel.getOeActiveFlag).to.have.been.calledOnce;
                    stubOeCommonModel.restore();
                    done();
            });

        }); //end it

    }); //end describe for Method: createCampaign()

}); //end describe


