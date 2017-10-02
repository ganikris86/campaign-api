'use strict';

var oeCampaignModel = require('../models/oeCampaignModel');
var oeCommonService = require('./oeCommonService');
var subscriptionModel = require('../models/subscriptionModel');
var logger = require('../lib/logUtil');
var Q = require('q');

function oeCampaignService() {
}

module.exports = oeCampaignService;

/**
 *  OE Refresh after delete and un-subscribe campaign
 *
 * @param campaignId - campaign id
 * @returns {d.promise}
 */
oeCampaignService.oeRefreshDeleteCampaign = function (campaignId) {
    var d = Q.defer();
    logger.msg('INFO', 'oeCampaignService', '', '', 'oeRefreshDeleteCampaign', 'OE Refresh for Delete campaign');
    var oeActiveFlag = 0;

    oeCommonService.getOeActiveFlag()
        .then(function (oeActiveFlagDb) {
            oeActiveFlag = oeActiveFlagDb;
            return oeCampaignModel.deleteRowInOeCpg(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.deleteRowInOeCpgScenario(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.deleteRowInOeCpgAwdDef(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.deleteRowInOeCpgPreReq(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.deleteRowInOeTermMerchCpg(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.deleteRowInOeCpgPaybrandRange(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            d.resolve(response);
        }, function(err){
            logger.msg('ERROR', 'oeCampaignService', '', '', 'oeRefreshDeleteCampaign',
                'Error in oeRefreshDeleteCampaign '+err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * OE Refresh for Create campaign
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignService.oeRefreshCreateCampaign = function (campaignId) {
    var d = Q.defer();
    logger.msg('INFO', 'oeCampaignService', '', '', 'oeRefreshCreateCampaign', 'OE Refresh for Create campaign');
    var oeActiveFlag = 0;

    oeCommonService.getOeActiveFlag()
        .then(function (oeActiveFlagDb) {
            oeActiveFlag = oeActiveFlagDb;
            return oeCampaignModel.storeOECpgEntry(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.storeOECpgScenarioEntry(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.storeOECpgAwdDefEntry(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.storeOECpgPreReqEntry(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.storeOETermMerchCpg(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return oeCampaignModel.storeOECpgPaybrandRangeEntry(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            return subscriptionModel.setLoopCampaignActivationAckDate(campaignId, oeActiveFlag);
        })
        .then(function (response) {
            d.resolve(response);
        }, function (err) {
            logger.msg('ERROR', 'oeCampaignService', '', '', 'oeRefreshCreateCampaign', 'Error during OE Refresh for Create campaign '+err.stack);
            d.reject(err);
        });

    return d.promise;
};
