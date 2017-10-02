'use strict';

function oeCampaignModel() {
    return {};
}

module.exports = oeCampaignModel;

var Q = require('q');
var logger = require('../lib/logUtil');
var commonDBUtil = require('../lib/commonDBUtil');
var constants = require('../lib/constants');

/**
 * Delete campaign from table OE_CPG
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeCpg = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpg',
        'Delete campaign from table OE_CPG, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from oe_cpg where oe_row_flag = :oe_active_flag and cpg_iid = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpg',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpg',
                'Deleted campaign in oe_cpg table');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Delete campaign from table oe_cpg_scenario
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeCpgScenario = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgScenario',
        'Delete campaign from table oe_cpg_scenario, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from oe_cpg_scenario where oe_row_flag = :oe_active_flag and cpg_iid = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgScenario',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgScenario',
                'Deleted campaign in oe_cpg_scenario table');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Delete campaign from table oe_cpg_awd_def
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeCpgAwdDef = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgAwdDef',
        'Delete campaign from table oe_cpg_awd_def, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from oe_cpg_awd_def where oe_row_flag = :oe_active_flag and cpg_iid = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgAwdDef',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgAwdDef',
                'Deleted campaign in oe_cpg_awd_def table');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Delete campaign from table oe_cpg_pre_req
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeCpgPreReq = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPreReq',
        'Delete campaign from table oe_cpg_pre_req, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from oe_cpg_pre_req where oe_row_flag = :oe_active_flag and cpg_iid = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPreReq',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPreReq',
                'Deleted campaign in oe_cpg_pre_req table');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Delete campaign from table oe_term_merch_cpg
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeTermMerchCpg = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeTermMerchCpg',
        'Delete campaign from table oe_term_merch_cpg, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from oe_term_merch_cpg where oe_row_flag = :oe_active_flag and cpg_iid = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeTermMerchCpg',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeTermMerchCpg',
                'Deleted campaign in oe_term_merch_cpg table');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Delete campaign from table OE_CPG_PAYBRAND_RANGE
 *
 * @param campaignId
 * @param oeActiveFlag
 * @returns {d.promise}
 */
oeCampaignModel.deleteRowInOeCpgPaybrandRange = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPaybrandRange',
        'Delete campaign from table OE_CPG_PAYBRAND_RANGE, campaignId ='+campaignId);

    var d = Q.defer();

    var sql = ' delete from OE_CPG_PAYBRAND_RANGE where oe_row_flag = :oe_active_flag and campaign_id = :cpg_iid';


    //Construct params object
    var params = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPaybrandRange',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'deleteRowInOeCpgPaybrandRange',
                'Deleted campaign in OE_CPG_PAYBRAND_RANGE table');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Create entries in OE_CPG table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOECpgEntry = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgEntry', 'Create entries in OE_CPG table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOECpgEntry = ' INSERT INTO OE_CPG(CPG_IID,CPG_VER,NAME,NAME_ATTR,CPG_TYPE,CPG_SUBTYPE,START_DATE,END_DATE,' +
                        ' PRINT_BALANCE,AWD_FREQ,AWD_CASCADED,AWD_AFTER_RESET,EXPIRY_TYPE,EXPIRY_PERIOD,PUNCH_MIN,' +
                        ' PUNCH_MAX,EVENT_EDAY_DAY1,EVENT_EDAY_DAY2,EVENT_EDAY_DAY3,EVENT_EDAY_DAY4,EVENT_EDAY_DAY5,' +
                        ' EVENT_EDAY_DAY6,EVENT_EDAY_DAY7,EVENT_EDAY_DAY8,EVENT_RDH_START_TIME,EVENT_RDH_END_TIME,' +
                        ' EVENT_RDH_DOW,EVENT_RDH_DAY1,EVENT_RDH_DAY2,EVENT_WEL_EVERY_VISIT,EVENT_WEL_PERIOD,EVENT_BDAY_DAYS_BEFORE,' +
                        ' EVENT_BDAY_DAYS_AFTER,EVENT_BDAY_CPG_MONTH,PROD_SVC_IID,PROD_SVC_ATTR_IID,BANK_OPS_ATTR_FLAG,' +
                        ' BANK_OPS_IID,BANK_OPS_PARAM_IID,INBOUND_CHANNEL_IID,TXN_FREQ_IND,RUN_MAX,RUN_MAX_VALIDITY, ' +
                        ' ITEM_START_TIME,ITEM_END_TIME,OE_ROW_FLAG) ' +
                        ' SELECT C.CAMPAIGN_ID, ' +
                        '        C.OE_VER, ' +
                        '        C.CAMPAIGN_NAME, ' +
                        '        NVL(C.CAMPAIGN_BOLD, 0), ' +
                        '        C.CAMPAIGN_TYPE, ' +
                        '        NVL(C.CAMPAIGN_SUBTYPE,\'S\'), ' +
                        '        C.START_DATE, ' +
                        '        C.END_DATE, ' +
                        '        NVL(C.PRINT_BAL, 0), ' +
                        '        NVL(C.ACCEPTED_FREQ, 0), ' +
                        '        NVL(C.PNT_CASCADE_CPNS, 0), ' +
                        '        NVL(C.PNT_PARTIAL_RESET, 0), ' +
                        '        NVL(C.EXPIRY_TYPE, 0), ' +
                        '        GREATEST(NVL(C.EXPIRY_MONTHS, 0), ' +
                        '                 NVL(C.EXPIRY_DAYS, 0), ' +
                        '                 NVL(C.EXPIRY_WEEKS, 0)), ' +
                        '        NVL(C.PUNCH_MIN, 0), ' +
                        '        NVL(C.PUNCH_MAX, 0), ' +
                        '        CE.EVENT_CPG_DAY1, ' +
                        '        CE.EVENT_CPG_DAY2, ' +
                        '        CE.EVENT_CPG_DAY3, ' +
                        '        CE.EVENT_CPG_DAY4, ' +
                        '        CE.EVENT_CPG_DAY5, ' +
                        '        CE.EVENT_CPG_DAY6, ' +
                        '        CE.EVENT_CPG_DAY7, ' +
                        '        CE.EVENT_CPG_DAY8, ' +
                        '        CE.REC_CPG_START_TIME, ' +
                        '        CE.REC_CPG_END_TIME, ' +
                        '        CE.REC_CPG_DOW, ' +
                        '        CE.REC_CPG_DAY1, ' +
                        '        CE.REC_CPG_DAY2, ' +
                        '        C.REWARD_TYPE, ' +
                        '        CE.WELCOME_CPG_PERIOD, ' +
                        '        CE.BDAY_CPG_DAYS_BEF, ' +
                        '        CE.BDAY_CPG_DAYS_AFT, ' +
                        '        CE.BDAY_CPG_MONTH, ' +
                        '        DECODE(CC.RWD_PROD_IID, -1, NULL, SEPS.DEF_IID), ' +
                        '        DECODE(CC.RWD_ATTRIB_IID, -1, NULL, CC.RWD_ATTRIB_IID), ' +
                        '        CC.RWD_BNKOP_ATTRIB_FLAG, ' +
                        '        DECODE(CC.RWD_BNKOP_IID, -1, NULL, SEBO.DEF_IID), ' +
                        '        DECODE(CC.RWD_PARAM_IID, -1, NULL, SEBOP.DEF_IID), ' +
                        '        DECODE(CC.RWD_INBCHNL_IID, -1, NULL, SECH.DEF_IID), ' +
                        '        DECODE(CC.RWD_TXNFREQ_IND, \'N\', 0, 1), ' +
                        '        DECODE(CC.CPGN_RUN_MAX, 0, NULL, CC.CPGN_RUN_MAX), ' +
                        '        DECODE(CC.CPGN_RUN_MAX, 0, NULL, DECODE(CC.CPGN_RUN_MAX_VAL, \'DY\', 1, \'WK\', 2, \'MN\', 3, NULL)), ' +
                        '        C.RETAIL_START_TIME, ' +
                        '        C.RETAIL_END_TIME, ' +
                        '        :OE_ROW_FLAG ' +
                        '   FROM CAMPAIGN C ' +
                        '   LEFT JOIN CAMPAIGN_EVENTS CE ON CE.CAMPAIGN_ID = C.CAMPAIGN_ID ' +
                        '   LEFT JOIN CPGN_CONTEXT CC ON CC.CPGN_IID = C.CAMPAIGN_ID ' +
                        '   LEFT JOIN SYSTEM_ENTITY SEPS ON CC.RWD_PROD_IID = SEPS.ENT_IID ' +
                        '   LEFT JOIN SYSTEM_ENTITY SEBO ON CC.RWD_BNKOP_IID = SEBO.ENT_IID ' +
                        '   LEFT JOIN SYSTEM_ENTITY SECH ON CC.RWD_INBCHNL_IID = SECH.ENT_IID ' +
                        '   LEFT JOIN SYSTEM_ENTITY SEBOP ON CC.RWD_PARAM_IID = SEBOP.ENT_IID ' +
                        '  WHERE C.CAMPAIGN_ID = :CAMPAIGN_ID ';

    //Construct params object
    var sqlOECpgEntryData = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sqlOECpgEntry, sqlOECpgEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgEntry', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgEntry', 'SQL for storing entries in oe_cpg table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Create entries in OE_CPG_SCENARIO table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOECpgScenarioEntry = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgScenarioEntry', 'Create entries in OE_CPG_SCENARIO table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOECpgScenarioEntry = ' INSERT INTO OE_CPG_SCENARIO(CPG_IID,SCENARIO_INDEX,LOWER_LIMIT,UPPER_LIMIT,REPEAT,REPEAT_MO,' +
                                ' RESET,OE_ROW_FLAG)' +
                                '   SELECT S1.CPG_IID, ' +
                                '          S1.SCENARIO_INDEX, ' +
                                '          S1.LOWER_LIMIT, ' +
                                '          S1.UPPER_LIMIT, ' +
                                '          S1.REPEAT, ' +
                                '          S1.REPEAT_MO, ' +
                                '          S1.RESET, ' +
                                '          :OE_ROW_FLAG ' +
                                '     FROM ( ' +
                                //TODO: Need to include SQL for type other than Monetary (RFM)
                                //THIS IS FOR ALL RFM SCENARIOS
                                '           SELECT S.CAMPAIGN_ID CPG_IID, ' +
                                '                  S.SCENARIO_INDEX SCENARIO_INDEX, ' +
                                '                  S.S_LOWER LOWER_LIMIT, ' +
                                '                  S.S_UPPER UPPER_LIMIT, ' +
                                '                  S.REPEAT_RWD_TYPE REPEAT, ' +
                                '                  S.REPEAT_RWD_MULTIPLE REPEAT_MO, ' +
                                '                  S.S_RESET RESET' +
                                '             FROM SCENARIO S ' +
                                '             JOIN CAMPAIGN SC ON SC.CAMPAIGN_ID = S.CAMPAIGN_ID ' +
                                '            WHERE S.STATUS <> \'E3\') S1 ' +
                                '    WHERE CPG_IID = :CPG_IID ';

    //Construct params object
    var sqlOECpgScenarioEntryData = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sqlOECpgScenarioEntry, sqlOECpgScenarioEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgScenarioEntry', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgScenarioEntry', 'SQL for storing entries in oe_cpg_scenario table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Create entries in OE_CPG_AWD_DEF table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOECpgAwdDefEntry = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgAwdDefEntry', 'Create entries in OE_CPG_AWD_DEF table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOECpgAwdDefEntry = ' INSERT INTO OE_CPG_AWD_DEF(CPG_IID,SCENARIO_INDEX,ENTITY_TYPE,ENTITY_IID,' +
                              '    AWD_TYPE,RATE,MON_UNIT,POINTS,MULTIPLIER_RATIO,DISCOUNT_AMOUNT,' +
                              '    DISCOUNT_PERCENT,DELIVERY_OPT,DELIVERY_DATE,DELIVERY_PERIOD,DELIVERY_COUNT,' +
                              '    MAX_ISSUE,PTS_EXPIRY_DATE,EXPIRY_PERIOD,EXPIRY_COUNT,OE_ROW_FLAG)' +
                              '   SELECT CPG_IID,' +
                              '          SCENARIO_INDEX,' +
                              '          ENTITY_TYPE,' +
                              '          ENTITY_IID,' +
                              '          AWD_TYPE,' +
                              '          RATE,' +
                              '          MON_UNIT,' +
                              '          POINTS,' +
                              '          MULTIPLIER_RATIO,' +
                              '          DISCOUNT_AMOUNT,' +
                              '          DISCOUNT_PERCENT,' +
                              '          DELIVERY_OPT,' +
                              '          DELIVERY_DATE,' +
                              '          DELIVERY_PERIOD,' +
                              '          DELIVERY_COUNT,' +
                              '          MAX_ISSUE,' +
                              '          PTSEXPIRYDATE,' +
                              '          EXPIRYPERIOD,' +
                              '          EXPIRYCOUNT,' +
                              '          :OE_ROW_FLAG' +
                              '     FROM ( ' +
                              //TODO: Need to add SQL for PL, eCpn, etc .. whenever required
                              //scenario msg
                              '           SELECT s.campaign_id cpg_iid,' +
                              '                  s.scenario_index scenario_index,' +
                              '                  \'MS\' entity_type,' +
                              '                  sm.scenario_message_iid entity_iid,' +
                              '                  NULL awd_type, NULL rate, NULL mon_unit, NULL points, NULL multiplier_ratio, NULL discount_amount, NULL discount_percent,' +
                              '                  1 delivery_opt,' +
                              '                  NULL delivery_date, NULL delivery_period, NULL delivery_count, NULL max_issue,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 1, c.POOL_VALIDITY_PERIOD,    NULL) PtsExpiryDate,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 2, decode(c.POOL_EXPIRY_UNIT_IID,1,3,NULL),    NULL) ExpiryPeriod,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 2, c.POOL_EXPIRY_UNIT_NUM,    NULL) ExpiryCount' +
                              '             FROM scenario s' +
                              '             JOIN campaign c' +
                              '               ON s.campaign_id = c.campaign_id' +
                              '             JOIN scenario_messages sm' +
                              '               ON sm.scenario_id = s.scenario_id' +
                              '              AND sm.status <> \'E3\'' +
                              '            WHERE s.status <> \'E3\'' +
                              '           UNION ALL ' +
                              //scenario discount
                              '           SELECT s.campaign_id cpg_iid,' +
                              '                  s.scenario_index scenario_index,' +
                              '                  \'DS\' entity_type,' +
                              '                  s.campaign_id entity_iid,' +
                              '                  NULL, NULL, NULL, NULL, NULL,' +
                              '                  DECODE(s.rfm_discount_type, \'F\', s.rfm_discount_amount, NULL) discount_amount,' +
                              '                  DECODE(s.rfm_discount_type, \'P\', s.rfm_discount_percent, NULL) discount_percent,' +
                              '                  NULL, NULL, NULL, NULL, NULL,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 1, c.POOL_VALIDITY_PERIOD,    NULL) PtsExpiryDate,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 2, decode(c.POOL_EXPIRY_UNIT_IID,1,3,NULL),    NULL) ExpiryPeriod,' +
                              '                  decode(c.POOL_VALIDITY_FLAG, 2, c.POOL_EXPIRY_UNIT_NUM,    NULL) ExpiryCount' +
                              '             FROM scenario s' +
                              '             JOIN campaign c' +
                              '               ON c.campaign_id = s.campaign_id' +
                              '              AND c.campaign_subtype = \'D\'' +
                              '            WHERE s.status <> \'E3\'' +
                              '         )' +
                              '    WHERE CPG_IID = :CPG_IID';

    //Construct params object
    var sqlOECpgAwdDefEntryData = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sqlOECpgAwdDefEntry, sqlOECpgAwdDefEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgAwdDefEntry', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgAwdDefEntry', 'SQL for storing entries in oe_cpg_awd_def table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Create entries in OE_CPG_PRE_REQ table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOECpgPreReqEntry = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPreReqEntry', 'Create entries in OE_CPG_PRE_REQ table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOECpgPreReqEntry = ' INSERT INTO OE_CPG_PRE_REQ(CPG_IID,PRE_REQ_INDEX,PROD_SVC_IID,PROD_SVC_ATTR_IID,BANK_OPS_ATTR_FLAG,' +
                              '    BANK_OPS_IID,BANK_OPS_PARAM_IID,INBOUND_CHANNEL_IID,CUMULATE_IND,TXN_FREQ_IND,RANGE_OPERATOR,' +
                              '    MIN_VALUE,MAX_VALUE,VALUE_UNIT,MAINTAIN_ELIG_IND,OE_ROW_FLAG)' +
                              ' SELECT CPG_IID,' +
                              '       PRE_REQ_INDEX,' +
                              '       PROD_SVC_IID,' +
                              '       PROD_SVC_ATTR_IID,' +
                              '       BANK_OPS_ATTR_FLAG,' +
                              '       BANK_OPS_IID,' +
                              '       BANK_OPS_PARAM_IID,' +
                              '       INBOUND_CHANNEL_IID,' +
                              '       CUMULATE_IND,' +
                              '       TXN_FREQ_IND,' +
                              '       RANGE_OPERATOR,' +
                              '       MIN_VALUE,' +
                              '       MAX_VALUE,' +
                              '       VALUE_UNIT,' +
                              '       MAINTAIN_ELIG_IND,' +
                              '       :OE_ROW_FLAG' +
                              '   FROM' +
                              '     (SELECT CPRE.CAMPAIGN_ID  CPG_IID,' +
                              '            1                 PRE_REQ_INDEX,' +
                              '            NULL              PROD_SVC_IID,' +
                              '            NULL              PROD_SVC_ATTR_IID,' +
                              '            NULL              BANK_OPS_ATTR_FLAG,' +
                              '            NULL              BANK_OPS_IID,' +
                              '            NULL              BANK_OPS_PARAM_IID,' +
                              '            NULL              INBOUND_CHANNEL_IID,' +
                              '            0                 CUMULATE_IND,' +
                              '            0                 TXN_FREQ_IND,' +
                              '            DECODE(CPRE.CAMPAIGN_TYPE, \'I\', 4, 7) RANGE_OPERATOR,' +
                              '            CPRE.MIN_PURCHASE MIN_VALUE,' +
                              '            CPRE.MAX_PURCHASE MAX_VALUE,' +
                              '            NULL              VALUE_UNIT,' +
                              '            0                 MAINTAIN_ELIG_IND' +
                              '       FROM CAMPAIGN CPRE' +
                              '      WHERE CPRE.CAMPAIGN_TYPE <> \'Z\'' +
                              //TODO: Need to include SQL which pulls data from CPGN_PREREQUISITE whenever required
                              '     )' +
                              '    WHERE CPG_IID = :CPG_IID';

    //Construct params object
    var sqlOECpgPreReqEntryData = [oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sqlOECpgPreReqEntry, sqlOECpgPreReqEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPreReqEntry', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPreReqEntry', 'SQL for storing entries in oe_cpg_pre_req table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Create entries in OE_TERM_MERCH_CPG table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOETermMerchCpg = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOETermMerchCpg', 'Create entries in OE_TERM_MERCH_CPG table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOETermMerchCpgEntry = ' INSERT INTO OE_TERM_MERCH_CPG(TERMINAL_IID,MERCHANT_IID,CPG_IID,FL_OE_APPLICABLE,' +
                                 ' FL_PPE_APPLICABLE,OE_ROW_FLAG,CPG_VER)' +
                                 '   SELECT TERMINAL_ID,' +
                                 '          MERCHANT_ID,' +
                                 '          CAMPAIGN_ID,' +
                                 '          (CASE' +
                                 '             WHEN LAST_STATUS = \'E0\' THEN' +
                                 '              1' +
                                 '             ELSE' +
                                 '              0' +
                                 '           END) AS FL_OE_APPLICABLE,' +
                                 '          1 AS FL_PPE_APPLICABLE,' +
                                 '          :OE_ROW_FLAG,' +
                                 '          OE_VER' +
                                 '     FROM (SELECT STC.TERMINAL_ID,' +
                                 '                  T.MERCHANT_ID,' +
                                 '                  STC.CAMPAIGN_ID,' +
                                 '                  MAX(STC.STATUS) KEEP(DENSE_RANK LAST ORDER BY STC.LAST_UPDATE_DATE) AS LAST_STATUS,' +
                                 '                  MAX(C.OE_VER) AS OE_VER' +
                                 '             FROM TERMINAL_CAMPAIGN_HISTORY STC' +
                                 '             JOIN TERMINAL T ON T.TERMINAL_ID = STC.TERMINAL_ID' +
                                 '             JOIN CAMPAIGN C ON C.CAMPAIGN_ID = STC.CAMPAIGN_ID AND C.CAMPAIGN_ID = :CAMPAIGN_ID' +
                                 // Grace period
                                 '            WHERE TRUNC(C.END_DATE) >= (TRUNC(SYSDATE) - 180)' +
                                 '            GROUP BY STC.TERMINAL_ID, T.MERCHANT_ID, STC.CAMPAIGN_ID)' +
                                 '    WHERE LAST_STATUS IN (:STATUS_ACTIVE, :STATUS_EXPIRED)';

    //Construct params object
    var sqlOETermMerchCpgEntryData = [oeActiveFlag, campaignId, constants.DB_STATUS_ACTIVE, constants.DB_STATUS_EXPIRED];

    commonDBUtil.getDbConn().execute(sqlOETermMerchCpgEntry, sqlOETermMerchCpgEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOETermMerchCpg', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOETermMerchCpg', 'SQL for storing entries in oe_term_merch_cpg table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};


/**
 * Create entries in OE_CPG_PAYBRAND_RANGE table
 * @param campaignId
 * @returns {d.promise}
 */
oeCampaignModel.storeOECpgPaybrandRangeEntry = function (campaignId, oeActiveFlag) {
    logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPaybrandRangeEntry', 'Create entries in OE_CPG_PAYBRAND_RANGE table');

    var d = Q.defer();

    //TODO - Hardcoded values should be pulled from constants file
    var sqlOECpgPaybrandRangeEntry = ' INSERT INTO OE_CPG_PAYBRAND_RANGE(RANGE_LOWER, RANGE_UPPER, CAMPAIGN_ID, OE_ROW_FLAG) '+
        ' SELECT 0, 999999, CAMPAIGN_ID, OE_ROW_FLAG '+
        ' FROM CAMPAIGN CPG, OE_CPG OC '+
        ' WHERE OC.OE_ROW_FLAG = :OE_ACTIVE_FLAG1 '+
        ' AND CPG.ALL_CARDS_ELIGIBLE = \'Y\' '+
        ' AND OC.CPG_IID = CPG.CAMPAIGN_ID '+
        ' AND CPG.CAMPAIGN_ID = :CAMPAIGN_ID1 '+
        ' UNION '+
        ' SELECT RANGE_LOWER, RANGE_UPPER, CPG_NORM_PAY_BRAND.CAMPAIGN_ID, OE_ROW_FLAG '+
        ' FROM CPG_NORM_PAY_BRAND, OE_CPG OCPG, CAMPAIGN CP '+
        ' WHERE OCPG.OE_ROW_FLAG = :OE_ACTIVE_FLAG2 '+
        ' AND OCPG.CPG_IID = CPG_NORM_PAY_BRAND.CAMPAIGN_ID '+
        ' AND OCPG.CPG_IID = CP.CAMPAIGN_ID '+
        ' AND CP.CAMPAIGN_ID = :CAMPAIGN_ID2 '+
        ' AND CP.ALL_CARDS_ELIGIBLE = \'N\' ';

    //Construct params object
    var sqlOECpgPaybrandRangeEntryData = [oeActiveFlag, campaignId, oeActiveFlag, campaignId];

    commonDBUtil.getDbConn().execute(sqlOECpgPaybrandRangeEntry, sqlOECpgPaybrandRangeEntryData, function (err) {
        if (err) {
            logger.msg('ERROR', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPaybrandRangeEntry',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'ocCampaignService', 'oeCampaignModel', '', 'storeOECpgPaybrandRangeEntry',
                'SQL for storing entries in OE_CPG_PAYBRAND_RANGE table is successful');
            d.resolve('');
        }
    });
    return d.promise;
};
