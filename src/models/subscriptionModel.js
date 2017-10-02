'use strict';

function subscriptionModel() {
    return {};
}

module.exports = subscriptionModel;

var Q = require('q');
var logger = require('../lib/logUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var constants = require('../lib/constants');
var DBUtil = require('../lib/dbUtil');
var modelHelper = require('./modelHelper');

/**
 * Set status to E3 = Deleted in loop_campaign table
 *
 * @param campaignId
 * @returns {d.promise}
 */
subscriptionModel.setStatusDeletedInLoopCampaign = function (campaignId) {
    logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'setStatusDeletedInLoopCampaign',
        'Set status to E3 = Deleted in loop_campaign table, campaignId='+campaignId);
    var d = Q.defer();

    var sql = ' update loop_campaign l ' +
        ' set l.status = :STATUS_DELETED, '+
        ' l.last_update_date = sysdate, ' +
        ' l.camp_end_date = sysdate ' +
        ' where exists (select campaign_id ' +
        ' from campaign ' +
        ' where status = :STATUS_DELETED ' +
        ' and campaign_id = l.campaign_id) ' +
        ' and l.campaign_id = :CAMPAIGN_ID' +
        ' and l.status = :STATUS_ACTIVE ';


    //Construct params object
    var params = [constants.DB_STATUS_DELETED, constants.DB_STATUS_DELETED, parseInt(campaignId),
        constants.DB_STATUS_ACTIVE];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'subscriptionService', 'subscriptionModel', '', 'setStatusDeletedInLoopCampaign',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'setStatusDeletedInLoopCampaign',
                'Set status to Deleted in loop_campaign table');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Update slots left for campaign
 * @param campaignId
 * @param isUnSubscribed - true/false
 * @returns {d.promise}
 */
subscriptionModel.updateSlotsLeftForCampaign = function (campaignId, isUnSubscribed) {
    logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'updateSlotsLeftForCampaign', 'Update slots left for campaign');
    var d = Q.defer();

    var sqlUpdateSlotsLeftForCampaign = ' UPDATE TERM_CAMPAIGN_COUNT TC' +
                                        '   SET SLOTS_LEFT = SLOTS_LEFT ';
    if (isUnSubscribed) {
        sqlUpdateSlotsLeftForCampaign = sqlUpdateSlotsLeftForCampaign +  ' + ';
    } else {
        sqlUpdateSlotsLeftForCampaign = sqlUpdateSlotsLeftForCampaign +  ' - ';
    }
    sqlUpdateSlotsLeftForCampaign = sqlUpdateSlotsLeftForCampaign +  ' (SELECT COUNT(1) ' +
                                        '                       FROM LOOP_CAMPAIGN LC ' +
                                        '                      WHERE LC.STATUS = :STATUS_ACTIVE ' +
                                        '                        AND LC.CAMPAIGN_ID = :CAMPAIGN_ID ' +
                                        '                        AND LC.TERMINAL_ID = TC.TERMINAL_ID) ' +
                                        ' WHERE TC.CAMPAIGN_TYPE = :MANUAL ' +
                                        '   AND TC.TERMINAL_ID IN ' +
                                        '       (SELECT TERMINAL_ID ' +
                                        '          FROM LOOP_CAMPAIGN LC ' +
                                        '         WHERE LC.STATUS = :STATUS_ACTIVE ' +
                                        '           AND LC.CAMPAIGN_ID = :CAMPAIGN_ID) ';
    //Construct data object
    var sqlUpdateSlotsLeftForCampaignData = [constants.DB_STATUS_ACTIVE,
                                             parseInt(campaignId),
                                             constants.DB_CAMPAIGN_SUBSCRIBE_MANUAL,
                                             constants.DB_STATUS_ACTIVE,
                                             parseInt(campaignId)
    ];

    commonDBUtil.getDbConn().execute(sqlUpdateSlotsLeftForCampaign, sqlUpdateSlotsLeftForCampaignData, function (err) {
        if (err) {
            logger.msg('ERROR', 'subscriptionService', 'subscriptionModel', '', 'updateSlotsLeftForCampaign', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'updateSlotsLeftForCampaign', 'Update of slots_left for campaign is successful');
            d.resolve('');
        }
    });

    return d.promise;
};

/**
 * Store entry in term_campaign_count (Do not insert if the entry is already available)
 * @param termCampaignCountTable
 * @returns {d.promise}
 */
subscriptionModel.storeTermCampaignCount = function (termCampaignCountTable) {
    logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'storeTermCampaignCount', 'Store entry in term_campaign_count');
    var d = Q.defer();

    var sqlTermCampaignCount = ' MERGE INTO TERM_CAMPAIGN_COUNT TCC' +
                               ' USING (SELECT TC.TERMINAL_ID       TERMINAL_ID,' +
                               '               S.SLOT_TYPE          CAMPAIGN_TYPE,' +
                               '               TC.MERCHANT_ID       MERCHANT_ID,' +
                               '               TC.CORPORATE_ID      CORPORATE_ID,' +
                               '               S.MAX_SLOT_AVAILABLE SLOTS_LEFT,' +
                               '               :LAST_UPDATE_BY      LAST_UPDATE_BY,' +
                               '               SYSDATE              LAST_UPDATE_DATE' +
                               '          FROM (SELECT DISTINCT S2.SLOT_TYPE, S2.MAX_SLOT_AVAILABLE' +
                               '                  FROM SUBSCRIPTION_CONFIG S1, SLOT_CONFIG S2' +
                               '                 WHERE S1.TERMINAL_TYPE = :TERMINAL_TYPE' +
                               '                   AND S1.SLOT_TYPE = S2.SLOT_TYPE' +
                               '                   AND S1.STATUS = :STATUS) S,' +
                               '               (SELECT m.merchant_id, c.corporate_id, t.terminal_id' +
                               '                  FROM merchant m, corporate c, terminal t' +
                               '                 WHERE m.corporate_id = c.corporate_id' +
                               '                   AND m.merchant_id = t.merchant_id' +
                               '                   AND m.merchant_id = :MERCHANT_ID' +
                               '                   AND m.status = :STATUS' +
                               '                   AND c.status = :STATUS' +
                               '                   AND t.status = :STATUS) TC) T' +
                               ' ON (T.TERMINAL_ID = TCC.TERMINAL_ID AND T.CAMPAIGN_TYPE = TCC.CAMPAIGN_TYPE)' +
                               ' WHEN NOT MATCHED THEN' +
                               '   INSERT' +
                               '     (TERMINAL_ID,' +
                               '      CAMPAIGN_TYPE,' +
                               '      MERCHANT_ID,' +
                               '      CORPORATE_ID,' +
                               '      SLOTS_LEFT,' +
                               '      LAST_UPDATE_BY,' +
                               '      LAST_UPDATE_DATE)' +
                               '   VALUES' +
                               '     (T.TERMINAL_ID,' +
                               '      T.CAMPAIGN_TYPE,' +
                               '      T.MERCHANT_ID,' +
                               '      T.CORPORATE_ID,' +
                               '      T.SLOTS_LEFT,' +
                               '      T.LAST_UPDATE_BY,' +
                               '      T.LAST_UPDATE_DATE)';

    //Construct params object
    var sqlTermCampaignCountData = [termCampaignCountTable.last_update_by,
                                    constants.DB_TERMINAL_TYPE,
                                    constants.DB_STATUS_ACTIVE,
                                    termCampaignCountTable.merchant_id,
                                    constants.DB_STATUS_ACTIVE,
                                    constants.DB_STATUS_ACTIVE,
                                    constants.DB_STATUS_ACTIVE
    ];

    commonDBUtil.getDbConn().execute(sqlTermCampaignCount, sqlTermCampaignCountData, function (err) {
        if (err) {
            logger.msg('ERROR', 'subscriptionService', 'subscriptionModel', '', 'storeTermCampaignCount', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'storeTermCampaignCount', 'TermCampaignCount SQL execution is successful');
            d.resolve('');
        }
    });

    return d.promise;
};

/**
 * Insert an entry into LOOP_CAMPAIGN table
 * @param loopCampaignTable
 * @returns {d.promise}
 */
subscriptionModel.storeLoopCampaignEntry = function (loopCampaignTable) {
    logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'storeLoopCampaignEntry', 'Insert an entry into LOOP_CAMPAIGN table loopCampaignTable-'+JSON.stringify(loopCampaignTable));
    var d = Q.defer();

    var sqlLoopCampaign = ' INSERT INTO LOOP_CAMPAIGN(CORPORATE_ID,MERCHANT_ID,TERMINAL_ID,CAMPAIGN_ID,LAST_UPDATE_BY,'+
                          ' LAST_UPDATE_DATE,CAMP_JOIN_DATE,STATUS)' +
                          ' SELECT C.CORPORATE_ID, M.MERCHANT_ID, T.TERMINAL_ID, :CAMPAIGN_ID, :LAST_UPDATE_BY,' +
                          ' SYSDATE, SYSDATE, :STATUS' +
                          ' FROM MERCHANT M, CORPORATE C, TERMINAL T' +
                          ' WHERE M.CORPORATE_ID = C.CORPORATE_ID' +
                          ' AND M.MERCHANT_ID = T.MERCHANT_ID AND M.MERCHANT_ID = :MERCHANT_ID AND M.STATUS = :STATUS' +
                          ' AND C.STATUS = :STATUS AND T.STATUS = :STATUS';

    //Construct data object
    var sqlLoopCampaignData = [loopCampaignTable.campaign_id,
                               loopCampaignTable.last_update_by,
                               constants.DB_STATUS_ACTIVE,
                               loopCampaignTable.merchant_id,
                               constants.DB_STATUS_ACTIVE,
                               constants.DB_STATUS_ACTIVE,
                               constants.DB_STATUS_ACTIVE
    ];

    commonDBUtil.getDbConn().execute(sqlLoopCampaign, sqlLoopCampaignData, function (err) {
        if (err) {
            logger.msg('ERROR', 'subscriptionService', 'subscriptionModel', '', 'storeLoopCampaignEntry', 'Error during executing loop campaign SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'storeLoopCampaignEntry', 'Loop campaign entry SQL execution is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Update activation_ack_date in loop_campaign table
 *
 * @param campaignId
 * @returns {d.promise}
 */
subscriptionModel.setLoopCampaignActivationAckDate = function (campaignId, ocActiveFlag) {
    logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'setLoopCampaignActivationAckDate',
        'update activation_ack_date in loop_campaign table, campaignId='+campaignId);
    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlLoopCampaignActivationAckDate = ' UPDATE LOOP_CAMPAIGN LC '+
        ' SET LC.ACTIVATION_ACK_DATE = SYSDATE '+
        ' WHERE  (LC.TERMINAL_ID,LC.CAMPAIGN_ID) IN '+
        ' ( '+
        '    SELECT OTMC.TERMINAL_IID, OTMC.CPG_IID '+
        ' FROM   OE_TERM_MERCH_CPG OTMC, '+
        '    OE_TERM OT '+
        ' WHERE  OTMC.OE_ROW_FLAG = :OE_ACTIVE_FLAG '+
        ' AND    OT.OE_ROW_FLAG = :OE_ACTIVE_FLAG '+
        ' AND    OT.OE_THIN_CLIENT = 1 '+
        ' AND    OTMC.MERCHANT_IID = OT.MIID '+
        ' AND    OTMC.TERMINAL_IID = OT.TIID '+
        ' AND    OTMC.FL_OE_APPLICABLE = 1 '+
        ' ) '+
        ' AND    LC.STATUS = :STATUS_ACTIVE '+
        ' AND    LC.CAMPAIGN_ID = :CAMPAIGN_ID '+
        ' AND    LC.ACTIVATION_ACK_DATE IS NULL ';

    //Construct params object
    var sqlLoopCampaignActivationAckDateData = [ocActiveFlag, ocActiveFlag, constants.DB_STATUS_ACTIVE, campaignId];

    commonDBUtil.getDbConn().execute(sqlLoopCampaignActivationAckDate, sqlLoopCampaignActivationAckDateData, function (err) {
        if (err) {
            logger.msg('ERROR', 'subscriptionService', 'subscriptionModel', '', 'setLoopCampaignActivationAckDate',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'subscriptionService', 'subscriptionModel', '', 'setLoopCampaignActivationAckDate',
                'Update activation_ack_date in loop_campaign table');
            d.resolve('');
        }
    });
    return d.promise;
};

