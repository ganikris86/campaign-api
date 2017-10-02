/*global describe:false, it:false, before:false, after:false, afterEach:false*/

'use strict';

var commonUtil = require('../../lib/commonUtil');

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

describe('commonUtil::common Utility TestSuite', () => {

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

    describe('Method: constructErrorJSONStructure() - Construct error JSON structure', () => {

        it('should return error JSON structure', (done) => {

            let errorCode = 'INVALID_FIELD_VALUE';
            let fieldName = 'endDate';
            let fieldValue = '20170329';
            let errorMessage = 'End date should be equal to or greater than start date';

            let responseErrorJSON =   {
                'errorCode': 'INVALID_FIELD_VALUE',
                'field': 'endDate',
                'originalValue': '20170329',
                'errorMessage': 'End date should be equal to or greater than start date',
                'helpUrl': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/INVALID_FIELD_VALUE#endDate'
            };

            commonUtil.constructErrorJSONStructure(errorCode, fieldName, fieldValue, errorMessage)
                .then((errorResponse) => {
                expect(errorResponse).to.deep.equal(responseErrorJSON);
                done();
            });

        }); //end it

    }); //end describe for Method: constructErrorJSONStructure()

    describe('Method: getFieldName() - Get field name', () => {

        it('should return field name', (done) => {

            let errObj = '0: instance additionalProperty "campaignId" exists in instance when not allowed';
            let responseFieldName = 'campaignId';

            var response = commonUtil.getFieldName(errObj);
            response.should.containEql(responseFieldName);
            done();

        }); //end it

    }); //end describe for Method: getFieldName()

    describe('Method: getParentFieldName() - Get parent field name', () => {

        it('should return parent field name', (done) => {

            let errObj = '0: instance.campaign additionalProperty "campaignId" exists in instance when not allowed';
            let responseFieldName = 'campaign';

            var response = commonUtil.getParentFieldName(errObj);
            response.should.containEql(responseFieldName);
            done();

        }); //end it

    }); //end describe for Method: getParentFieldName()

    describe('Method: trimRequestObject() - Utility to trim the values for string elements in request body', () => {

        it('should return trimmed request body', (done) => {

            let requestBody = {
                'name': ' XLS Campaign        '
            };
            let responseBody = {
                'name': 'XLS Campaign'
            };

            commonUtil.trimRequestObject(requestBody)
                .then((response) => {
                    expect(response).to.deep.equal(responseBody);
                    done();
            });

        }); //end it

    }); //end describe for Method: trimRequestObject()

    describe('Method: getIncludeParamFromRequest() - Fetch include parameter from the request', () => {

        it('should return fetched include parameter', (done) => {

            let request = {
                'query': {'include': 'ALL'}
            };
            let includeParam = 'ALL';

            commonUtil.getIncludeParamFromRequest(request)
                .then((response) => {
                    expect(response).to.deep.equal(includeParam);
                    done();
            });

        }); //end it

    }); //end describe for Method: getIncludeParamFromRequest()

    describe('Method: getExpandParamFromRequest() - Fetch expand parameter from the request', () => {

        it('should return fetched expand parameter', (done) => {

            let request = {
                'query': {'expand': 'ALL'}
            };
            let expandParam = 'ALL';

            commonUtil.getExpandParamFromRequest(request)
                .then((response) => {
                    expect(response).to.deep.equal(expandParam);
                    done();
            });

        }); //end it

    }); //end describe for Method: getExpandParamFromRequest()

    describe('Method: getSearchParamFromRequest() - Fetch search parameter from the request', () => {

        it('should return fetched expand parameter', (done) => {

            let request = {
                'query': {'search': 'ALL'}
            };
            let searchParam = 'all';

            commonUtil.getSearchParamFromRequest(request)
                .then((response) => {
                    expect(response).to.deep.equal(searchParam);
                    done();
            });

        }); //end it

    }); //end describe for Method: getSearchParamFromRequest()

}); //end describe
