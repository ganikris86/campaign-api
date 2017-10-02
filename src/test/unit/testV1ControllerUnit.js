/*global describe:false, it:false, before:false, after:false, beforeEach:false, afterEach:false */

'use strict';

var kraken = require('kraken-js');
var express = require('express');

var request = require('supertest');
var expect = require('chai').expect;
var assert = require('chai').assert;
var sinon = require('sinon');

var httpStatus = require('http-status');

var requestController = require('../../lib/requestController');

describe('Unit Test V1 Controller', () => {
    var app, mock;
    var getCampaignsServiceStub;

    // Stub the service layer
    var campaignService = require('../../services/campaignService');
    var logUtilStub;

    before(function (done) {
        // Stub the logUtil to ensure that log details are not printed while executing unit tests
        var logUtil = require('../../lib/logUtil');
        logUtilStub = sinon.stub(logUtil, 'msg',
            function (level, controller, model, lib, method, info) {
                return '';
            });

        app = express();
        app.on('start', done);
        app.use(requestController);
        app.use(kraken({
            basedir: process.cwd()
        }));

        mock = app.listen(3000);
    });

    after(function (done) {
        logUtilStub.restore();
        mock.close(done);
    });

    describe('Generic HTTP Validations', () => {
        // Get generic request stub
        var genericRequestStub = require('nconf').file({file: './test/unit/data/controllerGenericRequestStub.json'});

        var validAcceptHeaderRequest = genericRequestStub.stores.file.store.validAcceptHeaderRequest;
        var validContentTypeRequest = genericRequestStub.stores.file.store.validContentTypeRequest;
        var invalidAcceptHeaderRequest = genericRequestStub.stores.file.store.invalidAcceptHeaderRequest;
        var invalidContentTypeRequest = genericRequestStub.stores.file.store.invalidContentTypeRequest;
        var invalidURIRequest = genericRequestStub.stores.file.store.invalidURIRequest;
        var emptyContentTypeRequest = genericRequestStub.stores.file.store.emptyContentTypeRequest;
        var emptyBodyRequest = genericRequestStub.stores.file.store.emptyBodyRequest;
        var invalidAuthorizationRequest = genericRequestStub.stores.file.store.invalidAuthorizationRequest;
        var invalidUserIdRequest = genericRequestStub.stores.file.store.invalidUserIdRequest;

        // Get generic response stub
        var genericResponseStub = require('nconf').file({file: './test/unit/data/controllerGenericResponseStub.json'});

        var validAcceptHeaderResponse = genericRequestStub.stores.file.store.validAcceptHeaderResponse;
        var validContentTypeResponse = genericRequestStub.stores.file.store.validContentTypeResponse;
        var invalidAcceptHeaderResponse = genericRequestStub.stores.file.store.invalidAcceptHeaderResponse;
        var invalidContentTypeResponse = genericRequestStub.stores.file.invalidContentTypeResponse;
        var invalidURIResponse = genericRequestStub.stores.file.store.invalidURIResponse;
        var emptyContentTypeResponse = genericRequestStub.stores.file.store.emptyContentTypeResponse;
        var emptyBodyResponse = genericRequestStub.stores.file.store.emptyBodyResponse;
        var invalidAuthorizationResponse = genericRequestStub.stores.file.invalidAuthorizationResponse;
        var invalidUserIdResponse = genericRequestStub.stores.file.invalidUserIdResponse;

        it('Valid accept header', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(validContentTypeResponse.response.body);
                });

            request(app)
                .get(validAcceptHeaderRequest.uri)
                .set(validAcceptHeaderRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, validAcceptHeaderRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(validAcceptHeaderRequest.expected.status);
                            expect(res.body).to.deep.equal(validAcceptHeaderRequest.expected.body);
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

        it('Valid content type in header', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(validContentTypeResponse.response.body);
                });

            request(app)
                .get(validContentTypeRequest.uri)
                .set(validContentTypeRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, validContentTypeRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(validContentTypeRequest.expected.status);
                            expect(res.body).to.deep.equal(validContentTypeRequest.expected.body);
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

        it('Invalid accept header', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(invalidAcceptHeaderResponse.response.body);
                });

            request(app)
                .get(invalidAcceptHeaderRequest.uri)
                .set(invalidAcceptHeaderRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, invalidAcceptHeaderRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(invalidAcceptHeaderRequest.expected.status);
                            expect(res.body).be.empty;
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

        it('Invalid content type', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(invalidContentTypeResponse.response.body);
                });

            request(app)
                .get(invalidContentTypeRequest.uri)
                .set(invalidContentTypeRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, invalidContentTypeRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(invalidContentTypeRequest.expected.status);
                            expect(res.body).be.empty;
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

        it('Invalid uri', (done) => {
            // No need to create a stub here as app will throw the exception
            request(app)
                .get(invalidURIRequest.uri)
                .set(invalidURIRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, invalidURIRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(invalidURIRequest.expected.status);
                            expect(res.body).be.empty;
                        }
                        done();
                    });
        });

        it('Empty content type', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(emptyContentTypeResponse.response.body);
                });

            request(app)
                .get(emptyContentTypeRequest.uri)
                .set(emptyContentTypeRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, emptyContentTypeRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(emptyContentTypeRequest.expected.status);
							expect(res.body).to.deep.equal(emptyContentTypeRequest.expected.body);
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

        it('Invalid user id header', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(invalidUserIdResponse.response.body);
                });

            request(app)
                .get(invalidUserIdRequest.uri)
                .set(invalidUserIdRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, invalidUserIdRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(invalidUserIdRequest.expected.status);
                            expect(res.body).be.empty;
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });

    });

    describe('Unit Test for Campaign Endpoints', () => {
        // CAMPAIGNS: Reference the request stub
        var campaignRequestStub = require('nconf').file({file: './test/unit/data/controllerCampaignRequestStub.json'});

        // Get all request json
        var validGetCampaignsRequest = campaignRequestStub.stores.file.store.validGetCampaignsRequest;

        // CAMPAIGNS: Reference the response stub
        var campaignResponseStub = require('nconf').file({file: './test/unit/data/controllerCampaignResponseStub.json'});

        // Get all response json
        var validGetCampaignsResponse = campaignResponseStub.stores.file.store.validGetCampaignsResponse;

        it('Valid get campaigns using /v1/campaigns endpoint', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaigns',
                function (req, res, next) {
                    res.json(validGetCampaignsResponse.response.body);
                });

            request(app)
                .get(validGetCampaignsRequest.uri)
                .set(validGetCampaignsRequest.headers)
                .end(
                    function (err, res) {
                        if (err) {
                            assert.fail(err.status, validGetCampaignsRequest.expected.status);
                        } else {
                            expect(res.status).to.equal(validGetCampaignsRequest.expected.status);
                            expect(res.body).to.deep.equal(validGetCampaignsRequest.expected.body);
                        }
                        getCampaignsServiceStub.restore();
                        done();
                    });
        });
    });


    describe('Unit Test for Campaign by campaignId Endpoints', () => {
        // CAMPAIGNS: Reference the request stub
        var campaignRequestStub = require('nconf').file({file: './test/unit/data/controllerCampaignByIdRequestStub.json'});

        // Get all request json
        var validGetCampaignsRequest = campaignRequestStub.stores.file.store.validGetCampaignsRequest;

        // CAMPAIGNS: Reference the response stub
        var campaignResponseStub = require('nconf').file({file: './test/unit/data/controllerCampaignByIdResponseStub.json'});

        // Get all response json
        var validGetCampaignsResponse = campaignResponseStub.stores.file.store.validGetCampaignsResponse;

        it('Valid get campaign using /v1/campaign/campaignId endpoint', (done) => {
            getCampaignsServiceStub = sinon.stub(campaignService, 'getCampaignByCampaignId',
                function (req, res, next) {
                    res.json(validGetCampaignsResponse.response.body);
                });

        request(app)
            .get(validGetCampaignsRequest.uri)
            .set(validGetCampaignsRequest.headers)
            .end(
                function (err, res) {
                    if (err) {
                        assert.fail(err.status, validGetCampaignsRequest.expected.status);
                    } else {
                        expect(res.status).to.equal(validGetCampaignsRequest.expected.status);
                        expect(res.body).to.deep.equal(validGetCampaignsRequest.expected.body);
                    }
                    getCampaignsServiceStub.restore();
                    done();
                });
        });
    });


});
