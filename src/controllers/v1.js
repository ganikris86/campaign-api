'use strict';

var campaignService = require('../services/campaignService');
var statisticsService = require('../services/statisticsService');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var commonUtil = require('../lib/commonUtil');
var httpStatus = require('http-status');


module.exports = function (router) {

    router.options('/*', function (req, res) {
        logger.msg('INFO', 'v1', '', '', 'OPTIONS ', 'sets the Cross-origin resource sharing (CORS) headers');
        /*sets the Cross-origin resource sharing (CORS) headers*/
        commonUtil.setCorsResponseHeaders(res)
            .then(function (res) {
                res.sendStatus(httpStatus.OK);
            });
    });

    //Create campaign
    router.post(constants.URI_CREATE_CAMPAIGN, function (req, res) {
        logger.msg('INFO', 'v1', '', '', 'POST ' + constants.URI_CREATE_CAMPAIGN, 'Create campaign - ' + JSON.stringify(req.body));
        campaignService.createCampaign(req, res);
    });

    //Get Campaigns
    router.get(constants.URI_GET_CAMPAIGNS, function(req, res){
       logger.msg('INFO', 'v1', '', '', 'GET ' + constants.URI_GET_CAMPAIGNS, 'GET all campaigns');
       campaignService.getCampaigns(req, res);
    });

    //Delete Campaign - it is soft delete from database
    router.delete(constants.URI_DELETE_CAMPAIGN, function(req, res){
        logger.msg('INFO', 'v1', '', '', 'DELETE ' + constants.URI_DELETE_CAMPAIGN,
            'Delete campaign, campaignId = '+req.params.campaignId);
        campaignService.deleteCampaign(req, res);
    });

    //Get Campaign by campaignId
    router.get(constants.URI_GET_CAMPAIGN_WITH_CAMPAIGNID, function(req, res){
        logger.msg('INFO', 'v1', '', '', 'GET ' + constants.URI_GET_CAMPAIGN_WITH_CAMPAIGNID, 'GET campaign with campaignId');
        campaignService.getCampaignByCampaignId(req, res);
    });

    //Compute Merchant Campaign Statistics
    router.post(constants.URI_CAMPAIGN_STATISTICS, function(req, res){
        logger.msg('INFO', 'v1', '', '', 'POST ' + constants.URI_CAMPAIGN_STATISTICS, 'Compute campaign statistics - ' + JSON.stringify(req.body));
        statisticsService.campaignStatistics(req, res);
    });

    //Compute Merchant Statistics
    router.post(constants.URI_MERCHANT_STATISTICS, function(req, res){
        logger.msg('INFO', 'v1', '', '', 'POST ' + constants.URI_MERCHANT_STATISTICS, 'Compute merchant statistics - ' + JSON.stringify(req.body));
        statisticsService.merchantStatistics(req, res);
    });

};
