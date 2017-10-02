'use strict';

var subscriptionModel = require('../models/subscriptionModel');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var httpStatus = require('http-status');
var commonUtil = require('../lib/commonUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var serviceHelper = require('./serviceHelper');
var Q = require('q');
var moment = require('moment');
var util = require('util');

function subscriptionService() {
}

module.exports = subscriptionService;

/**
 *  Un-subscribe campaign
 *
 * @param campaignId - campaign id
 * @returns {d.promise}
 */
subscriptionService.unsubscribeCampaign = function (campaignId) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'unsubscribeCampaign', 'Un-subscribe campaign');

    subscriptionModel.updateSlotsLeftForCampaign(campaignId, true)
        .then(function (response) {
            return subscriptionModel.setStatusDeletedInLoopCampaign(campaignId);
        })
        .then(function (response) {
            d.resolve(response);
        }, function(err){
            logger.msg('ERROR', 'subscriptionService', '', '', 'unsubscribeCampaign',
                'Error in unsubscribeCampaign '+err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Subscribe campaign for an input merchant
 * @param campaignId
 * @returns {d.promise}
 */
subscriptionService.subscribeCampaign = function (campaignId, subscriptionObj) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'subscribeCampaign', 'Subscribe campaign for an input merchant :: campaignId-'+campaignId);

    subscriptionService.constructSubscriptionRelatedTableData(campaignId, subscriptionObj)
        .then(function (subscriptionData) {
            if (subscriptionData) {
                return subscriptionService.createSubscriptionRelatedEntries(subscriptionData);
            } else {
                logger.msg('INFO', 'subscriptionService', '', '', 'subscribeCampaign', 'Skipping subscription as subscription data is not available');
                d.resolve('');
            }
        })
        .then(function (response) {
            d.resolve('');
        })
        .fail(function (err) {
            logger.msg('ERROR', 'subscriptionService', '', '', 'subscribeCampaign', 'Error during subscribeCampaign '+err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Create entries for subscription related tables
 * @param subscriptionData
 * @returns {d.promise}
 */
subscriptionService.createSubscriptionRelatedEntries = function (subscriptionData) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'createSubscriptionRelatedEntries', 'Create entries for subscription related tables');

    subscriptionModel.storeLoopCampaignEntry(subscriptionData.loopCampaignTableObj)
        .then(function (response) {
            return subscriptionModel.storeTermCampaignCount(subscriptionData.termCampaignCountTableObj);
        })
        .then(function (response) {
            return subscriptionModel.updateSlotsLeftForCampaign(subscriptionData.loopCampaignTableObj.campaign_id, false);
        })
        .then(function (response) {
            d.resolve(response);
        })
        .fail(function (err) {
            logger.msg('ERROR', 'subscriptionService', '', '', 'createSubscriptionRelatedEntries', 'Error during createSubscriptionRelatedEntries '+err.stack);
            d.reject(err);
        });

    return d.promise;
};

/**
 * Construct data objects for subscription related tables
 * @param campaignId
 * @param subscriptionObj
 * @returns {d.promise}
 */
subscriptionService.constructSubscriptionRelatedTableData = function (campaignId, subscriptionObj) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'constructSubscriptionRelatedTableData', 'Construct data objects for subscription related tables');

    if (subscriptionObj.ownerType && subscriptionObj.ownerType === constants.OWNER_TYPE_MERCHANT) {
        //TODO: Subscription for multiple merchants will be handled later
        if (subscriptionObj.ownerId) {
            var subscriptionData = {
                'loopCampaignTableObj': '',
                'termCampaignCountTableObj': ''
            };
            subscriptionService.constructLoopCampaignTableData(campaignId, subscriptionObj.ownerId)
                .then(function (loopCampaignData) {
                    subscriptionData.loopCampaignTableObj = loopCampaignData;
                    return subscriptionService.constructTermCampaignCountTableData(subscriptionObj.ownerId);
                })
                .then(function (termCampaignCountData) {
                    subscriptionData.termCampaignCountTableObj = termCampaignCountData;
                    d.resolve(subscriptionData);
                })
                .fail(function (err) {
                    logger.msg('ERROR', 'subscriptionService', '', '', 'constructSubscriptionRelatedTableData', 'Error during constructSubscriptionRelatedTableData ' + err.stack);
                    d.reject(err);
                });
        } else {
            d.resolve('');
        }
    } else {
        d.resolve('');
    }

    return d.promise;
};

/**
 * Construct LOOP_CAMPAIGN table data
 * @param campaignId
 * @param merchant_id
 * @returns {d.promise}
 */
subscriptionService.constructLoopCampaignTableData = function (campaignId, merchant_id) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'constructLoopCampaignTableData', 'Construct LOOP_CAMPAIGN table data');

    //Construct data object
    var loopCampaignData = {
        'merchant_id': merchant_id,
        'campaign_id': campaignId,
        'last_update_by': 1
    };

    d.resolve(loopCampaignData);
    return d.promise;
};

/**
 * Construct TERM_CAMPAIGN_COUNT table data
 * @param merchant_id
 * @returns {d.promise}
 */
subscriptionService.constructTermCampaignCountTableData = function (merchant_id) {
    var d = Q.defer();
    logger.msg('INFO', 'subscriptionService', '', '', 'constructTermCampaignCountTableData', 'Construct TERM_CAMPAIGN_COUNT table data');

    //Construct data object
    var termCampaignCountData = {
        'merchant_id': merchant_id,
        'last_update_by': 1
    };

    d.resolve(termCampaignCountData);
    return d.promise;
};
