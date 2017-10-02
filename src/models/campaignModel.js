'use strict';

function campaignModel() {
    return {};
}

module.exports = campaignModel;

var Q = require('q');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var commonDBUtil = require('../lib/commonDBUtil');
var DBUtil = require('../lib/dbUtil');
var modelHelper = require('./modelHelper');
var fileName = 'campaignModel';

//MERGE an entry into CAMPAIGN table
campaignModel.storeCampaignEntry = function (campaignTableObj) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignEntry', 'storeCampaignEntry - ' + JSON.stringify(campaignTableObj));
    var d = Q.defer();

    var sqlCampaign = 'MERGE INTO CAMPAIGN C USING (SELECT' +
                      ' :CAMPAIGN_ID CAMPAIGN_ID,' +
                      ' :CAMPAIGN_NAME CAMPAIGN_NAME,' +
                      ' :CAMPAIGN_BOLD CAMPAIGN_BOLD,' +
                      ' :DESCRIPTION DESCRIPTION,' +
                      ' :CAMPAIGN_TYPE CAMPAIGN_TYPE,' +
                      ' :CAMPAIGN_SUBTYPE CAMPAIGN_SUBTYPE,' +
                      ' :MIN_PURCHASE MIN_PURCHASE,' +
                      ' :MAX_PURCHASE MAX_PURCHASE,' +
                      ' :ACCEPTED_FREQ ACCEPTED_FREQ,' +
                      ' :MONO_MERCHANT MONO_MERCHANT,' +
                      ' to_date(:START_DATE,\'' + constants.DATE_FORMAT + '\') START_DATE,' +
                      ' to_date(:END_DATE,\'' + constants.DATE_FORMAT + '\') END_DATE,' +
                      ' :EXPIRY_TYPE EXPIRY_TYPE,' +
                      ' :EXPIRY_MONTHS EXPIRY_MONTHS,' +
                      ' :LAST_UPDATE_BY LAST_UPDATE_BY,' +
                      ' SYSDATE LAST_UPDATE_DATE,' +
                      ' :STATUS STATUS,' +
                      ' :EXPIRY_DAYS EXPIRY_DAYS,' +
                      ' :ENT_VERSION_CODE ENT_VERSION_CODE,' +
                      ' :OVERRIDE OVERRIDE,' +
                      ' :MOBILE_MESSAGE MOBILE_MESSAGE,' +
                      ' :OWNER_TYPE OWNER_TYPE,' +
                      ' :OWNER_ID OWNER_ID,' +
                      ' :CPG_CAPPING_RULE CPG_CAPPING_RULE,' +
                      ' :REFERENCELOGO REFERENCELOGO,' +
                      ' :AVAILABLE_FOR_VT AVAILABLE_FOR_VT,' +
                      ' :PNT_PARTIAL_RESET PNT_PARTIAL_RESET,' +
                      ' :PNT_CASCADE_CPNS PNT_CASCADE_CPNS,' +
                      ' :DISCOUNT_AMOUNT DISCOUNT_AMOUNT,' +
                      ' :DISCOUNT_PERCENT DISCOUNT_PERCENT' +
                      ' FROM DUAL) T ON (C.CAMPAIGN_ID = T.CAMPAIGN_ID)' +
                      //UPDATE
                      ' WHEN MATCHED THEN UPDATE SET' +
                      ' C.CAMPAIGN_NAME = T.CAMPAIGN_NAME,C.CAMPAIGN_BOLD=T.CAMPAIGN_BOLD,C.DESCRIPTION=T.DESCRIPTION,' +
                      ' C.CAMPAIGN_TYPE = T.CAMPAIGN_TYPE,C.CAMPAIGN_SUBTYPE=T.CAMPAIGN_SUBTYPE,C.MIN_PURCHASE=T.MIN_PURCHASE,' +
                      ' C.MAX_PURCHASE = T.MAX_PURCHASE,C.ACCEPTED_FREQ=T.ACCEPTED_FREQ,C.MONO_MERCHANT=T.MONO_MERCHANT,' +
                      ' C.START_DATE = T.START_DATE,C.END_DATE=T.END_DATE,C.EXPIRY_TYPE=T.EXPIRY_TYPE,' +
                      ' C.EXPIRY_MONTHS = T.EXPIRY_MONTHS,C.LAST_UPDATE_BY=T.LAST_UPDATE_BY,C.LAST_UPDATE_DATE=T.LAST_UPDATE_DATE,' +
                      ' C.STATUS = T.STATUS,C.EXPIRY_DAYS=T.EXPIRY_DAYS,C.ENT_VERSION_CODE=T.ENT_VERSION_CODE,' +
                      ' C.OVERRIDE = T.OVERRIDE,C.MOBILE_MESSAGE=T.MOBILE_MESSAGE,C.OWNER_TYPE=T.OWNER_TYPE,C.OWNER_ID=T.OWNER_ID,' +
                      ' C.CPG_CAPPING_RULE=T.CPG_CAPPING_RULE,C.REFERENCELOGO = T.REFERENCELOGO,C.AVAILABLE_FOR_VT = T.AVAILABLE_FOR_VT,' +
                      ' C.PNT_PARTIAL_RESET=T.PNT_PARTIAL_RESET,C.PNT_CASCADE_CPNS=T.PNT_CASCADE_CPNS,C.DISCOUNT_AMOUNT=T.DISCOUNT_AMOUNT,' +
                      ' C.DISCOUNT_PERCENT=T.DISCOUNT_PERCENT' +
                      //INSERT
                      ' WHEN NOT MATCHED THEN INSERT (CAMPAIGN_ID,CAMPAIGN_NAME,CAMPAIGN_BOLD,DESCRIPTION,CAMPAIGN_TYPE,' +
                      ' CAMPAIGN_SUBTYPE,MIN_PURCHASE,MAX_PURCHASE,ACCEPTED_FREQ,MONO_MERCHANT,START_DATE,END_DATE,EXPIRY_TYPE,' +
                      ' EXPIRY_MONTHS,LAST_UPDATE_BY,LAST_UPDATE_DATE,STATUS,EXPIRY_DAYS,ENT_VERSION_CODE,OVERRIDE,MOBILE_MESSAGE,' +
                      ' OWNER_TYPE,OWNER_ID,CPG_CAPPING_RULE,REFERENCELOGO,AVAILABLE_FOR_VT,PNT_PARTIAL_RESET,PNT_CASCADE_CPNS,' +
                      ' DISCOUNT_AMOUNT,DISCOUNT_PERCENT)' +
                      ' VALUES (T.CAMPAIGN_ID,T.CAMPAIGN_NAME,T.CAMPAIGN_BOLD,T.DESCRIPTION,T.CAMPAIGN_TYPE,T.CAMPAIGN_SUBTYPE,' +
                      ' T.MIN_PURCHASE,T.MAX_PURCHASE,T.ACCEPTED_FREQ,T.MONO_MERCHANT,T.START_DATE,T.END_DATE,T.EXPIRY_TYPE,' +
                      ' T.EXPIRY_MONTHS,T.LAST_UPDATE_BY,T.LAST_UPDATE_DATE,T.STATUS,T.EXPIRY_DAYS,T.ENT_VERSION_CODE,T.OVERRIDE,' +
                      ' T.MOBILE_MESSAGE,T.OWNER_TYPE,T.OWNER_ID,T.CPG_CAPPING_RULE,T.REFERENCELOGO,T.AVAILABLE_FOR_VT,T.PNT_PARTIAL_RESET,' +
                      ' T.PNT_CASCADE_CPNS,T.DISCOUNT_AMOUNT,T.DISCOUNT_PERCENT)';

    //Construct data object
    var sqlCampaignData = [campaignTableObj.campaign_id,
                           campaignTableObj.campaign_name,
                           campaignTableObj.campaign_bold,
                           campaignTableObj.description,
                           campaignTableObj.campaign_type,
                           campaignTableObj.campaign_subtype,
                           campaignTableObj.min_purchase,
                           campaignTableObj.max_purchase,
                           campaignTableObj.accepted_freq,
                           campaignTableObj.mono_merchant,
                           campaignTableObj.start_date,
                           campaignTableObj.end_date,
                           campaignTableObj.expiry_type,
                           campaignTableObj.expiry_months,
                           campaignTableObj.last_update_by,
                           campaignTableObj.status,
                           campaignTableObj.expiry_days,
                           campaignTableObj.ent_version_code,
                           campaignTableObj.override,
                           campaignTableObj.mobile_message,
                           campaignTableObj.owner_type,
                           campaignTableObj.owner_id,
                           campaignTableObj.cpg_capping_rule,
                           campaignTableObj.referencelogo,
                           campaignTableObj.available_for_vt,
                           campaignTableObj.pnt_partial_reset,
                           campaignTableObj.pnt_cascade_cpns,
                           campaignTableObj.discount_amount,
                           campaignTableObj.discount_percent
    ];

    //NOTE: This DML should not be executed for Update Campaign
    var sqlCampaignEntityAwardCappingCounter = 'INSERT INTO ENTITY_AWD_CAPPING_COUNTER(ENTITY_TYPE,ENTITY_IID)' +
        ' VALUES (:ENTITY_TYPE,:ENTITY_IID)';

    //Construct data object
    var sqlCampaignEntityAwardCappingCounterData = ['CP', campaignTableObj.campaign_id];

    commonDBUtil.getDbConn().execute(sqlCampaign, sqlCampaignData, function (err) {
        if (err) {
            logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignEntry', 'Error during executing campaign SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignEntry', 'Campaign entry SQL execution is successful');
            commonDBUtil.getDbConn().execute(sqlCampaignEntityAwardCappingCounter, sqlCampaignEntityAwardCappingCounterData, function (err) {
                if (err) {
                    logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignEntry', 'Error during executing award capping counter SQL :: err - ' + err.stack);
                    d.reject(err);
                } else {
                    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignEntry', 'Award capping counter entry SQL execution is successful');
                    d.resolve('');
                }
            });
        }
    });
    return d.promise;
};

//MERGE an entry into SCENARIO table
campaignModel.storeCampaignScenario = function (scenarioTableObj) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignScenario', 'storeCampaignScenario - ' + JSON.stringify(scenarioTableObj));
    var d = Q.defer();

    var sqlScenario = 'MERGE INTO SCENARIO S USING (SELECT' +
                      ' :SCENARIO_ID SCENARIO_ID,' +
                      ' :CAMPAIGN_ID CAMPAIGN_ID,' +
                      ' :SCENARIO_INDEX SCENARIO_INDEX,' +
                      ' :S_LOWER S_LOWER,' +
                      ' :S_UPPER S_UPPER,' +
                      ' :REPEAT_RWD_TYPE REPEAT_RWD_TYPE,' +
                      ' :REPEAT_RWD_MULTIPLE REPEAT_RWD_MULTIPLE,' +
                      ' :S_RESET S_RESET,' +
                      ' :RFM_DISCOUNT_AMOUNT RFM_DISCOUNT_AMOUNT,' +
                      ' :RFM_DISCOUNT_PERCENT RFM_DISCOUNT_PERCENT,' +
                      ' :RFM_DISCOUNT_TYPE RFM_DISCOUNT_TYPE,' +
                      ' :LAST_UPDATE_BY LAST_UPDATE_BY,' +
                      ' SYSDATE LAST_UPDATE_DATE,' +
                      ' :STATUS STATUS' +
                      ' FROM DUAL) T ON (S.SCENARIO_ID = T.SCENARIO_ID)' +
                      //UPDATE
                      ' WHEN MATCHED THEN UPDATE SET' +
                      ' S.CAMPAIGN_ID = T.CAMPAIGN_ID,S.SCENARIO_INDEX=T.SCENARIO_INDEX,S.S_LOWER=T.S_LOWER,' +
                      ' S.S_UPPER=T.S_UPPER,S.REPEAT_RWD_TYPE=T.REPEAT_RWD_TYPE,S.REPEAT_RWD_MULTIPLE=T.REPEAT_RWD_MULTIPLE,' +
                      ' S.S_RESET=T.S_RESET,S.RFM_DISCOUNT_AMOUNT=T.RFM_DISCOUNT_AMOUNT,S.RFM_DISCOUNT_PERCENT=T.RFM_DISCOUNT_PERCENT,' +
                      ' S.RFM_DISCOUNT_TYPE=T.RFM_DISCOUNT_TYPE,S.LAST_UPDATE_BY=T.LAST_UPDATE_BY,S.LAST_UPDATE_DATE=T.LAST_UPDATE_DATE,' +
                      ' S.STATUS=T.STATUS' +
                      //INSERT
                      ' WHEN NOT MATCHED THEN INSERT (SCENARIO_ID,CAMPAIGN_ID,SCENARIO_INDEX,S_LOWER,S_UPPER,' +
                      ' REPEAT_RWD_TYPE,REPEAT_RWD_MULTIPLE,S_RESET,RFM_DISCOUNT_AMOUNT,RFM_DISCOUNT_PERCENT,' +
                      ' RFM_DISCOUNT_TYPE,LAST_UPDATE_BY,LAST_UPDATE_DATE,STATUS)' +
                      ' VALUES (T.SCENARIO_ID,T.CAMPAIGN_ID,T.SCENARIO_INDEX,T.S_LOWER,T.S_UPPER,T.REPEAT_RWD_TYPE,' +
                      ' T.REPEAT_RWD_MULTIPLE,T.S_RESET,T.RFM_DISCOUNT_AMOUNT,T.RFM_DISCOUNT_PERCENT,T.RFM_DISCOUNT_TYPE,' +
                      ' T.LAST_UPDATE_BY,T.LAST_UPDATE_DATE,T.STATUS)';

    //Construct data object
    var sqlScenarioData = [scenarioTableObj.scenario_id,
                           scenarioTableObj.campaign_id,
                           scenarioTableObj.scenario_index,
                           scenarioTableObj.s_lower,
                           scenarioTableObj.s_upper,
                           scenarioTableObj.repeat_rwd_type,
                           scenarioTableObj.repeat_rwd_multiple,
                           scenarioTableObj.s_reset,
                           scenarioTableObj.rfm_discount_amount,
                           scenarioTableObj.rfm_discount_percent,
                           scenarioTableObj.rfm_discount_type,
                           scenarioTableObj.last_update_by,
                           scenarioTableObj.status
    ];

    commonDBUtil.getDbConn().execute(sqlScenario, sqlScenarioData, function (err) {
        var resp;
        if (err) {
            logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignScenario', 'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignScenario', 'Scenario entry SQL execution is successful');
            d.resolve('');
        }
    });
    return d.promise;
};

//MERGE an entry into SCENARIO_MESSAGES table
campaignModel.storeCampaignScenarioMessage = function (scenarioMessagesTableObj) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignScenarioMessage', 'storeCampaignScenarioMessage - ' + JSON.stringify(scenarioMessagesTableObj));
    var d = Q.defer();

    if (scenarioMessagesTableObj) {
        var sqlScenarioMessages = 'MERGE INTO SCENARIO_MESSAGES SM USING (SELECT' +
            ' :SCENARIO_ID SCENARIO_ID,' +
            ' :MSG_LINE1 MSG_LINE1,' +
            ' :BOLD1 BOLD1,' +
            ' :MSG_LINE2 MSG_LINE2,' +
            ' :BOLD2 BOLD2,' +
            ' :MSG_LINE3 MSG_LINE3,' +
            ' :BOLD3 BOLD3,' +
            ' :MSG_LINE4 MSG_LINE4,' +
            ' :BOLD4 BOLD4,' +
            ' :MSG_LINE5 MSG_LINE5,' +
            ' :BOLD5 BOLD5,' +
            ' :MSG_LINE6 MSG_LINE6,' +
            ' :BOLD6 BOLD6,' +
            ' :MSG_LINE7 MSG_LINE7,' +
            ' :BOLD7 BOLD7,' +
            ' :MSG_LINE8 MSG_LINE8,' +
            ' :BOLD8 BOLD8,' +
            ' :LAST_UPDATE_BY LAST_UPDATE_BY,' +
            ' SYSDATE LAST_UPDATE_DATE,' +
            ' :STATUS STATUS,' +
            ' :DISPLAY_FLAG DISPLAY_FLAG' +
            ' FROM DUAL) T ON (SM.SCENARIO_ID = T.SCENARIO_ID)' +
                //UPDATE
            ' WHEN MATCHED THEN UPDATE SET' +
            ' SM.MSG_LINE1 = T.MSG_LINE1,SM.BOLD1=T.BOLD1,SM.MSG_LINE2=T.MSG_LINE2,SM.BOLD2=T.BOLD2,' +
            ' SM.MSG_LINE3=T.MSG_LINE3,SM.BOLD3=T.BOLD3,SM.MSG_LINE4=T.MSG_LINE4,SM.BOLD4=T.BOLD4,' +
            ' SM.MSG_LINE5=T.MSG_LINE5,SM.BOLD5=T.BOLD5,SM.MSG_LINE6=T.MSG_LINE6,SM.BOLD6=T.BOLD6,' +
            ' SM.MSG_LINE7=T.MSG_LINE7,SM.BOLD7=T.BOLD7,SM.MSG_LINE8=T.MSG_LINE8,SM.BOLD8=T.BOLD8,' +
            ' SM.LAST_UPDATE_BY=T.LAST_UPDATE_BY,SM.LAST_UPDATE_DATE=T.LAST_UPDATE_DATE,' +
            ' SM.STATUS=T.STATUS,SM.DISPLAY_FLAG=T.DISPLAY_FLAG' +
                //INSERT
            ' WHEN NOT MATCHED THEN INSERT (SCENARIO_ID,MSG_LINE1,BOLD1,MSG_LINE2,BOLD2,MSG_LINE3,' +
            ' BOLD3,MSG_LINE4,BOLD4,MSG_LINE5,BOLD5,MSG_LINE6,BOLD6,MSG_LINE7,BOLD7,MSG_LINE8,BOLD8,' +
            ' LAST_UPDATE_BY,LAST_UPDATE_DATE,STATUS,DISPLAY_FLAG)' +
            ' VALUES (T.SCENARIO_ID,T.MSG_LINE1,T.BOLD1,T.MSG_LINE2,T.BOLD2,T.MSG_LINE3,T.BOLD3,' +
            ' T.MSG_LINE4,T.BOLD4,T.MSG_LINE5,T.BOLD5,T.MSG_LINE6,T.BOLD6,T.MSG_LINE7,T.BOLD7,' +
            ' T.MSG_LINE8,T.BOLD8,T.LAST_UPDATE_BY,T.LAST_UPDATE_DATE,T.STATUS,T.DISPLAY_FLAG) ';

        //Construct data object
        var sqlScenarioMessagesData = [scenarioMessagesTableObj.scenario_id,
            scenarioMessagesTableObj.msg_line1,
            scenarioMessagesTableObj.bold1,
            scenarioMessagesTableObj.msg_line2,
            scenarioMessagesTableObj.bold2,
            scenarioMessagesTableObj.msg_line3,
            scenarioMessagesTableObj.bold3,
            scenarioMessagesTableObj.msg_line4,
            scenarioMessagesTableObj.bold4,
            scenarioMessagesTableObj.msg_line5,
            scenarioMessagesTableObj.bold5,
            scenarioMessagesTableObj.msg_line6,
            scenarioMessagesTableObj.bold6,
            scenarioMessagesTableObj.msg_line7,
            scenarioMessagesTableObj.bold7,
            scenarioMessagesTableObj.msg_line8,
            scenarioMessagesTableObj.bold8,
            scenarioMessagesTableObj.last_update_by,
            scenarioMessagesTableObj.status,
            scenarioMessagesTableObj.display_flag
        ];

        commonDBUtil.getDbConn().execute(sqlScenarioMessages, sqlScenarioMessagesData, function (err) {
            if (err) {
                logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignScenarioMessage', 'Error during executing SQL :: err - ' + err.stack);
                d.reject(err);
            } else {
                logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignScenarioMessage', 'Scenario messages entry SQL execution is successful');
                d.resolve('');
            }
        });
    } else {
        d.resolve('');
    }
    return d.promise;
};

//MERGE an entry into SMS_MESSAGE table
campaignModel.storeCampaignSMSMessage = function (smsMessageTableObj) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeSMSMessage', 'Store campaign SMS Message');
    var d = Q.defer();

    if (smsMessageTableObj) {

        var sqlSMSMessage = 'MERGE INTO SMS_MESSAGE S' +
            ' USING (SELECT :SMS_MESSAGE_IID SMS_MESSAGE_IID,' +
            '               :SMS_CONTENT     SMS_CONTENT,' +
            '               :STATUS          STATUS' +
            '          FROM DUAL) T' +
            ' ON (S.SMS_MESSAGE_IID = T.SMS_MESSAGE_IID)' +
            ' WHEN MATCHED THEN' +
            ' UPDATE' +
            ' SET S.SMS_CONTENT = T.SMS_CONTENT' +
            ' WHEN NOT MATCHED THEN' +
            ' INSERT' +
            ' (SMS_MESSAGE_IID, SMS_CONTENT, STATUS)' +
            ' VALUES' +
            ' (T.SMS_MESSAGE_IID, T.SMS_CONTENT, T.STATUS)';

        //Construct data object
        var sqlSMSMessageData = [smsMessageTableObj.sms_message_iid,
            smsMessageTableObj.sms_content,
            smsMessageTableObj.status
        ];

        var sqlUpdateScenario = 'UPDATE SCENARIO S SET S.SMS_MESSAGE_IID = :SMS_MESSAGE_IID WHERE S.SCENARIO_ID = :SCENARIO_ID';

        //Construct data object
        var sqlUpdateScenarioData = [smsMessageTableObj.sms_message_iid,
            smsMessageTableObj.scenario_id
        ];

        commonDBUtil.getDbConn().execute(sqlSMSMessage, sqlSMSMessageData, function (err) {
            if (err) {
                logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignSMSMessage', 'Error during executing SMS Message SQL :: err - ' + err.stack);
                d.reject(err);
            } else {
                commonDBUtil.getDbConn().execute(sqlUpdateScenario, sqlUpdateScenarioData, function (err) {
                    if (err) {
                        logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignSMSMessage', 'Error during executing update of SMS Message Id SQL :: err - ' + err.stack);
                        d.reject(err);
                    } else {
                        logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignSMSMessage', 'SMS message entry SQL execution is successful');
                        d.resolve('');
                    }
                });
            }
        });
    } else {
        d.resolve('');
    }
    return d.promise;
};

/**
 * Store campaign events
 * @param campaignEventsTableObj
 * @returns {promise|*}
 */
campaignModel.storeCampaignEvents = function (campaignEventsTableObj) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignEvents', 'Store campaign events');
    var d = Q.defer();
    console.log('campaignEventsTableObj-'+JSON.stringify(campaignEventsTableObj));

    if (campaignEventsTableObj) {

        var sqlCampaignEvents = 'MERGE INTO CAMPAIGN_EVENTS C' +
            ' USING (SELECT :CAMPAIGN_ID CAMPAIGN_ID,' +
            ' :CAMPAIGN_TYPE CAMPAIGN_TYPE,' +
            ' :EVENT_CPG_DAY1 EVENT_CPG_DAY1,' +
            ' :EVENT_CPG_DAY2 EVENT_CPG_DAY2,' +
            ' :EVENT_CPG_DAY3 EVENT_CPG_DAY3,' +
            ' :EVENT_CPG_DAY4 EVENT_CPG_DAY4,' +
            ' :EVENT_CPG_DAY5 EVENT_CPG_DAY5,' +
            ' :EVENT_CPG_DAY6 EVENT_CPG_DAY6,' +
            ' :EVENT_CPG_DAY7 EVENT_CPG_DAY7,' +
            ' :EVENT_CPG_DAY8 EVENT_CPG_DAY8,' +
            ' :REC_CPG_START_TIME REC_CPG_START_TIME,' +
            ' :REC_CPG_END_TIME REC_CPG_END_TIME,' +
            ' :REC_CPG_DOW REC_CPG_DOW,' +
            ' :REC_CPG_DAY1 REC_CPG_DAY1,' +
            ' :REC_CPG_DAY2 REC_CPG_DAY2,' +
            ' :WELCOME_CPG_PERIOD WELCOME_CPG_PERIOD,' +
            ' :BDAY_CPG_DAYS_BEF BDAY_CPG_DAYS_BEF,' +
            ' :BDAY_CPG_DAYS_AFT BDAY_CPG_DAYS_AFT,' +
            ' :LAST_UPDATE_BY LAST_UPDATE_BY,' +
            ' SYSDATE LAST_UPDATE_DATE,' +
            ' :BDAY_CPG_MONTH BDAY_CPG_MONTH' +
            ' FROM DUAL) T' +
            ' ON (C.CAMPAIGN_ID = T.CAMPAIGN_ID)' +
            ' WHEN MATCHED THEN' +
            //UPDATE
            ' UPDATE SET C.CAMPAIGN_TYPE = T.CAMPAIGN_TYPE,' +
            ' C.EVENT_CPG_DAY1 = T.EVENT_CPG_DAY1,' +
            ' C.EVENT_CPG_DAY2 = T.EVENT_CPG_DAY2,' +
            ' C.EVENT_CPG_DAY3 = T.EVENT_CPG_DAY3,' +
            ' C.EVENT_CPG_DAY4 = T.EVENT_CPG_DAY4,' +
            ' C.EVENT_CPG_DAY5 = T.EVENT_CPG_DAY5,' +
            ' C.EVENT_CPG_DAY6 = T.EVENT_CPG_DAY6,' +
            ' C.EVENT_CPG_DAY7 = T.EVENT_CPG_DAY7,' +
            ' C.EVENT_CPG_DAY8 = T.EVENT_CPG_DAY8,' +
            ' C.REC_CPG_START_TIME = T.REC_CPG_START_TIME,' +
            ' C.REC_CPG_END_TIME = T.REC_CPG_END_TIME,' +
            ' C.REC_CPG_DOW = T.REC_CPG_DOW,' +
            ' C.REC_CPG_DAY1 = T.REC_CPG_DAY1,' +
            ' C.REC_CPG_DAY2 = T.REC_CPG_DAY2,' +
            ' C.WELCOME_CPG_PERIOD = T.WELCOME_CPG_PERIOD,' +
            ' C.BDAY_CPG_DAYS_BEF = T.BDAY_CPG_DAYS_BEF,' +
            ' C.BDAY_CPG_DAYS_AFT = T.BDAY_CPG_DAYS_AFT,' +
            ' C.LAST_UPDATE_BY = T.LAST_UPDATE_BY,' +
            ' C.LAST_UPDATE_DATE = T.LAST_UPDATE_DATE,' +
            ' C.BDAY_CPG_MONTH = T.BDAY_CPG_MONTH' +
            ' WHEN NOT MATCHED THEN' +
            //INSERT
            ' INSERT' +
            ' (CAMPAIGN_ID, CAMPAIGN_TYPE, EVENT_CPG_DAY1, EVENT_CPG_DAY2, EVENT_CPG_DAY3,' +
            ' EVENT_CPG_DAY4, EVENT_CPG_DAY5, EVENT_CPG_DAY6, EVENT_CPG_DAY7, EVENT_CPG_DAY8,' +
            ' REC_CPG_START_TIME, REC_CPG_END_TIME, REC_CPG_DOW, REC_CPG_DAY1, REC_CPG_DAY2,' +
            ' WELCOME_CPG_PERIOD, BDAY_CPG_DAYS_BEF, BDAY_CPG_DAYS_AFT, LAST_UPDATE_BY,' +
            ' LAST_UPDATE_DATE, BDAY_CPG_MONTH)' +
            ' VALUES' +
            ' (T.CAMPAIGN_ID, T.CAMPAIGN_TYPE, T.EVENT_CPG_DAY1, T.EVENT_CPG_DAY2, T.EVENT_CPG_DAY3,' +
            ' T.EVENT_CPG_DAY4, T.EVENT_CPG_DAY5, T.EVENT_CPG_DAY6, T.EVENT_CPG_DAY7, T.EVENT_CPG_DAY8,' +
            ' T.REC_CPG_START_TIME, T.REC_CPG_END_TIME, T.REC_CPG_DOW, T.REC_CPG_DAY1, T.REC_CPG_DAY2,' +
            ' T.WELCOME_CPG_PERIOD, T.BDAY_CPG_DAYS_BEF, T.BDAY_CPG_DAYS_AFT, T.LAST_UPDATE_BY,' +
            ' T.LAST_UPDATE_DATE, T.BDAY_CPG_MONTH)';

        //Construct data object
        var sqlCampaignEventsData = [campaignEventsTableObj.campaign_id,
            campaignEventsTableObj.campaign_type,
            campaignEventsTableObj.event_cpg_day1,
            campaignEventsTableObj.event_cpg_day2,
            campaignEventsTableObj.event_cpg_day3,
            campaignEventsTableObj.event_cpg_day4,
            campaignEventsTableObj.event_cpg_day5,
            campaignEventsTableObj.event_cpg_day6,
            campaignEventsTableObj.event_cpg_day7,
            campaignEventsTableObj.event_cpg_day8,
            campaignEventsTableObj.rec_cpg_start_time,
            campaignEventsTableObj.rec_cpg_end_time,
            campaignEventsTableObj.rec_cpg_dow,
            campaignEventsTableObj.rec_cpg_day1,
            campaignEventsTableObj.rec_cpg_day2,
            campaignEventsTableObj.welcome_cpg_period,
            campaignEventsTableObj.bday_cpg_days_bef,
            campaignEventsTableObj.bday_cpg_days_aft,
            campaignEventsTableObj.last_update_by,
            campaignEventsTableObj.bday_cpg_month
        ];

        commonDBUtil.getDbConn().execute(sqlCampaignEvents, sqlCampaignEventsData, function (err) {
            if (err) {
                logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'storeCampaignEvents', 'Error during executing campaign events SQL :: err - ' + err.stack);
                d.reject(err);
                } else {
                    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'storeCampaignEvents', 'Campaign events entry SQL execution is successful');
                    d.resolve('');
                }
            });

    } else {
        d.resolve('');
    }
    return d.promise;
};

/**
 * Get Campaigns data from db and return as object
 * @param campaignRequestParameters - parameters for requesting campaign
 */
campaignModel.getCampaigns = function(campaignRequestParameters){

    logger.msg('INFO', 'campaignService', fileName, '', 'getCampaigns', 'get Campaigns data from DB');

    var d = Q.defer();
    var sqlData = [];

    var sql = 'SELECT  c.campaign_id, ' +
                        'c.campaign_name,' +
                        'c.description,' +
                        'c.campaign_type,' +
                        'c.campaign_subtype,' +
                        'c.mono_merchant,' +
                        'c.available_for_vt,' +
                        'to_date(to_char(c.start_date,\'DD-MM-YYYY\'),\'DD-MM-YYYY\'),' +
                        'to_date(to_char(c.end_date,\'DD-MM-YYYY\'),\'DD-MM-YYYY\'),' +
                        'c.min_purchase,' +
                        'c.max_purchase,' +
                        'c.expiry_type,' +
                        'c.expiry_days,' +
                        'c.expiry_months,' +
                        'u.user_name,' +
                        'to_date(to_char(c.last_update_date,\'DD-MM-YYYY HH24:MI:SS\'),\'DD-MM-YYYY HH24:MI:SS\'),' +
                        'c.status,' +
                        'c.override,' +
                        'c.expiry_type,' +
                        'c.expiry_days,' +
                        'c.expiry_months, ' +
                        'c.owner_type, ' +
                        'c.owner_id, ' +
                        'c.accepted_freq, ' +
                        'c.mobile_message, ' +
                        'c.referencelogo, ' +
                        'c.pnt_partial_reset, ' +
                        'c.pnt_cascade_cpns, ' +
                        'c.discount_amount, ' +
                        'c.discount_percent ' +
                        ' FROM campaign c ';

    sql += ' JOIN users u ON c.last_update_by = u.user_id ';

    if(campaignRequestParameters.action === 'getAllCampaigns') {
        sql += ' WHERE c.campaign_subtype = :SUBTYPE_DISC ';
        sqlData.push(constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT);

        //Merchant id
        if(campaignRequestParameters.merchantId){
            sql += ' AND EXISTS (SELECT 1 from loop_campaign lc where lc.campaign_id = c.campaign_id ';
            sql += '             AND lc.merchant_id = :MID and lc.status = :STATUS_ACTIVE) ';
            sqlData.push(campaignRequestParameters.merchantId);
            sqlData.push(constants.DB_STATUS_ACTIVE);
        }

        //Status
        if(campaignRequestParameters.status !== constants.STATUS_ALL) {
            sql += ' AND c.status in ('+campaignRequestParameters.status+') ';
        }

        //Driver type
        if(campaignRequestParameters.driverType !== constants.STR_ALL) {
            sql += ' AND c.campaign_type in ('+campaignRequestParameters.driverType+') ';
        } else {
            sql += '  AND c.campaign_type in (:DRIVER_TYPE_AMOUNT, :DRIVER_TYPE_FREQUENCY, :DRIVER_TYPE_EVENT) ';
            sqlData.push(constants.DB_CAMPAIGN_TYPE_AMOUNT);
            sqlData.push(constants.DB_CAMPAIGN_TYPE_FREQUENCY);
            sqlData.push(constants.DB_CAMPAIGN_TYPE_EVENT);
        }

        //Owner type
        if(campaignRequestParameters.ownerType !== constants.STR_ALL) {
            sql += ' AND c.owner_type in ('+campaignRequestParameters.ownerType+') ';
        }
    } else if(campaignRequestParameters.action === 'campaignById') {
        sql += ' WHERE c.campaign_subtype = :SUBTYPE_DISC ' +
                ' AND c.campaign_id = (:campaignid)' +
                '  AND c.campaign_type in (:DRIVER_TYPE_AMOUNT, :DRIVER_TYPE_FREQUENCY, :DRIVER_TYPE_EVENT) ';

        sqlData = [constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT, campaignRequestParameters.campaignId,
                    constants.DB_CAMPAIGN_TYPE_AMOUNT, constants.DB_CAMPAIGN_TYPE_FREQUENCY,
                    constants.DB_CAMPAIGN_TYPE_EVENT];
    } else if(campaignRequestParameters.action === 'deleteCampaign') {
        sql += ' WHERE c.campaign_subtype = :SUBTYPE_DISC ' +
            ' AND c.campaign_id = :campaignid AND c.status in (:STATUS_ACTIVE, :STATUS_INACTIVE)' +
            '  AND c.campaign_type in (:DRIVER_TYPE_AMOUNT, :DRIVER_TYPE_FREQUENCY) ';

        sqlData = [constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT, campaignRequestParameters.campaignId,
            constants.DB_STATUS_ACTIVE, constants.DB_STATUS_INACTIVE,
            constants.DB_CAMPAIGN_TYPE_AMOUNT, constants.DB_CAMPAIGN_TYPE_FREQUENCY];
    }

    logger.msg('INFO', 'campaignService', fileName, '', 'getCampaigns', 'sql='+sql);

    DBUtil.getConnection(function (err, dbConn) {
          if (err) {
              logger.msg('ERROR', 'campaignService', fileName, '', 'getCampaigns', 'Error during getConnection :: err - ' + err.stack);
              d.reject(err);
          } else {
              dbConn.execute(sql, sqlData, function (err, results) {
                  if (err) {
                      logger.msg('ERROR', 'campaignService', fileName, '', 'getCampaigns', 'Error during executing SQL :: err - ' + err.stack);
                      DBUtil.releaseConnection(dbConn);
                      d.reject(err);
                  } else {
                    DBUtil.releaseConnection(dbConn);
                    d.resolve(modelHelper.convertCampaignResultToObject(results.rows));
                  }
              });
          }
      });

    return d.promise;
};

/**
 * Get RFM scenarios from db and convert into object
 */
campaignModel.getRfmScenarios = function(){
  var funcName = 'getRfmScenarios';

  logger.msg('INFO', 'campaignService', fileName, '', funcName, 'Get Rfm scenarios');

  var d = Q.defer();

  var sql = 'SELECT s.scenario_id,' +
                    's.campaign_id,' +
                    's.scenario_index,' +
                    's.s_lower,' +
                    's.s_upper,' +
                    's.repeat_rwd_type,' +
                    's.repeat_rwd_multiple,' +
                    's.s_reset,' +
                    's.rfm_discount_amount,' +
                    's.rfm_discount_percent,' +
                    's.rfm_discount_type,' +
                    's.last_update_by,' +
                    's.last_update_date,' +
                    's.status,' +
                    'sm.msg_line1,' +
                    'sm.bold1,' +
                    'sm.msg_line2,' +
                    'sm.bold2,' +
                    'sm.msg_line3,' +
                    'sm.bold3,' +
                    'sm.msg_line4,' +
                    'sm.bold4,' +
                    'sm.msg_line5,' +
                    'sm.bold5,' +
                    'sm.msg_line6,' +
                    'sm.bold6,' +
                    'sm.msg_line7,' +
                    'sm.bold7,' +
                    'sm.msg_line8,' +
                    'sm.bold8,' +
                    's.sms_message_iid,' +
                    'sm.display_flag,' +
                    'sms.sms_content,' +
                    'sm.scenario_message_iid ' +
              ' FROM scenario s' +
              ' LEFT JOIN scenario_messages sm ON sm.scenario_id = s.scenario_id' +
              ' LEFT JOIN sms_message sms ON sms.sms_message_iid = s.sms_message_iid' +
              ' WHERE EXISTS (SELECT 1' +
              '     FROM campaign c' +
              '     WHERE c.campaign_type in (:DRIVER_TYPE_AMOUNT, :DRIVER_TYPE_FREQUENCY, :DRIVER_TYPE_EVENT_DAY) ' +
              '     AND c.campaign_subtype = :SUBTYPE_DISCOUNT ' +
              '     AND c.campaign_id = s.campaign_id)';

    var sqlParams = [constants.DB_CAMPAIGN_TYPE_AMOUNT, constants.DB_CAMPAIGN_TYPE_FREQUENCY, constants.DB_CAMPAIGN_TYPE_EVENT, constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT];

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'campaignService', fileName, '', funcName, 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            dbConn.execute(sql, sqlParams, function (err, results) {
                if (err) {
                    logger.msg('ERROR', 'campaignService', fileName, '', funcName, 'Error during executing SQL :: err - ' + err.stack);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                } else {
                  DBUtil.releaseConnection(dbConn);
                  d.resolve(modelHelper.convertScenariosResultToObject(results.rows));
                }
            });
        }
    });

    return d.promise;
};

/**
 * Get campaign events
 * @returns {promise|*}
 */
campaignModel.getCampaignEvents = function(){
    var funcName = 'getCampaignEvents';

    logger.msg('INFO', 'campaignService', fileName, '', funcName, 'Get campaign events');

    var d = Q.defer();

    var sql = 'SELECT c.campaign_id,' +
        ' c.event_cpg_day1,' +
        ' c.event_cpg_day2,' +
        ' c.event_cpg_day3,' +
        ' c.event_cpg_day4,' +
        ' c.event_cpg_day5,' +
        ' c.event_cpg_day6,' +
        ' c.event_cpg_day7,' +
        ' c.event_cpg_day8' +
        ' FROM CAMPAIGN_EVENTS c' +
        ' WHERE EXISTS (SELECT 1' +
        ' FROM campaign c' +
        ' WHERE c.campaign_type = :DRIVER_TYPE_EVENT_DAY' +
        ' AND c.campaign_subtype = :SUBTYPE_DISCOUNT' +
        ' AND c.campaign_id = c.campaign_id)';

    var sqlParams = [constants.DB_CAMPAIGN_TYPE_EVENT, constants.DB_CAMPAIGN_SUBTYPE_DISCOUNT];

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'campaignService', fileName, '', funcName, 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            dbConn.execute(sql, sqlParams, function (err, results) {
                if (err) {
                    logger.msg('ERROR', 'campaignService', fileName, '', funcName, 'Error during executing SQL :: err - ' + err.stack);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                } else {
                    DBUtil.releaseConnection(dbConn);
                    d.resolve(modelHelper.convertEventsResultToObject(results.rows));
                }
            });
        }
    });

    return d.promise;
};

/**
 * Set status to E3 = Deleted in campaign table
 *
 * @param campaignId
 * @returns {d.promise}
 */
campaignModel.setStatusDeletedInCampaign = function (campaignId) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'setStatusDeletedInCampaign',
        'Set status to E3 = Deleted in campaign table - campaignId = '+campaignId);
    var d = Q.defer();

    var sql = ' update campaign ' +
        ' set status = :STATUS_DELETED, '+
        ' last_update_date = sysdate ' +
        ' where campaign_id = :CAMPAIGN_ID' +
        ' and status = :STATUS_ACTIVE ';


    //Construct params object
    var params = [constants.DB_STATUS_DELETED, parseInt(campaignId), constants.DB_STATUS_ACTIVE];

    commonDBUtil.getDbConn().execute(sql, params, function (err) {
        if (err) {
            logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'setStatusDeletedInCampaign',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'campaignService', 'campaignModel', '', 'setStatusDeletedInCampaign',
                'Set status to Deleted in campaign table');
            d.resolve('');
        }
    });
    return d.promise;
};

/**
 * Check if merchant Id exists in the DB
 * @param merchantId
 * @returns {d.promise}
 */
campaignModel.checkMerchantIdExists = function (merchantId) {
    logger.msg('INFO', 'campaignService', 'campaignModel', '', 'checkMerchantIdExists', 'Check if merchant Id exists in the DB');
    var d = Q.defer();

    var sql = 'SELECT COUNT(1) FROM merchant m WHERE m.merchant_id = :MERCHANT_ID AND m.status = :STATUS';

    //Construct params object
    var params = [parseInt(merchantId), constants.DB_STATUS_ACTIVE];

    DBUtil.getConnection(function (err, dbConn) {
        if (err) {
            logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'checkMerchantIdExists', 'Error during getConnection :: err - ' + err.stack);
            d.reject(err);
        } else {
            dbConn.execute(sql, params, function (err, results) {
                if (err) {
                    logger.msg('ERROR', 'campaignService', 'campaignModel', '', 'checkMerchantIdExists', 'Error during executing SQL :: err - ' + err.stack);
                    DBUtil.releaseConnection(dbConn);
                    d.reject(err);
                } else {
                    DBUtil.releaseConnection(dbConn);
                    d.resolve(results.rows[0]);
                }
            });
        }
    });
    return d.promise;
};
