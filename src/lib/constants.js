'use strict';

module.exports = {
    // error codes
    'MISSING_FIELD_VALUE': 'MISSING_FIELD_VALUE',
    'INVALID_FIELD_LENGTH': 'INVALID_FIELD_LENGTH',
    'BAD_FORMAT': 'BAD_FORMAT',
    'UNKNOWN_FIELD_VALUE': 'UNKNOWN_FIELD_VALUE',
    'DUPLICATE_FIELD_VALUE': 'DUPLICATE_FIELD_VALUE',
    'MISSING_REQUEST_BODY': 'MISSING_REQUEST_BODY',
    'INVALID_FIELD_VALUE': 'INVALID_FIELD_VALUE',
    'INVALID_OPERATION': 'INVALID_OPERATION',
    'INVALID_QUERY_VALUE':'INVALID_QUERY_VALUE',

    // Generic error messages
    'MSG_MISSING_VALUE': '%s is required',
    'MSG_INVALID_LENGTH': '%s maximum length is %d characters',
    'MSG_DUPLICATE_VALUE': 'Duplicate %s %s',
    'MSG_UNKNOWN_VALUE': 'No %s of %s found',
    'MSG_UNKNOWN_VALUE_IDENTIFIER': 'No %s found with identifier %d',
    'MSG_MISSING_REQUEST_BODY': 'Request body cannot be blank',
    'MSG_BAD_FORMAT_DATATYPE': '%s is not of expected datatype',
    'MSG_INVALID_DATA_TYPE': '%s values must be all digits',
    'MSG_INVALID_MIN_VALUE': 'Incorrect format - %s cannot be less than %d',
    'MSG_INVALID_MAX_VALUE': 'Incorrect format - %s cannot be more than %d',
    'MSG_INVALID_MIN_LENGTH': '%s minimum length is %d characters',
    'MSG_INVALID_VALUE_START_DATE': 'Invalid start date',
    'MSG_INVALID_VALUE_END_DATE': 'Invalid end date',
    'MSG_START_DATE_LESS_THAN_TODAY': 'Start date should be equal to or greater than today',
    'MSG_END_DATE_LESS_THAN_START_DATE': 'End date should be equal to or greater than start date',
    'MSG_CAMPAIGN_CAN_NOT_BE_DELETED': 'The campaign %s cannot be deleted',
    'MSG_INVALID_OWNER_TYPE':'Invalid query ownerType',
    'MSG_INVALID_STATUS':'Invalid query status',
    'MSG_INVALID_OWNER_ID':'Invalid owner identifier',
    'MSG_INVALID_NO_OF_DAYS':'Number of days should be between %s and %s',
    'MSG_INVALID_NO_OF_MONTHS':'Number of months should be between %s and %s',
    'MSG_INVALID_DISCOUNT_FIXED_AMOUNT':'Discount fixed amount should be between %s and %s',
    'MSG_INVALID_DISCOUNT_PERCENTAGE':'Discount percentage should be between %s and %s',
    'MSG_SCENARIO_NUM_ONE_MISSING':'Scenario number 1 is required',
    'MSG_SCENARIO_MSG_LINE_EXCEED12_BOLD':'Scenario %s message line %s must not exceed 12 characters when message printed in bold is true',
    'MSG_INVALID_MERCHANT_ID':'Invalid merchant identifier',
    'MSG_DUPLICATE_MSG_LINE_NUMBER': 'Duplicate line number found',
    'MSG_AMOUNT_DRIVER_BENEFIT_DTLS_MISSING':'Amount driver and benefit details is required',
    'MSG_FREQUENCY_DRIVER_BENEFIT_DTLS_MISSING':'Frequency driver and benefit details is required',
    'MSG_EVENT_DAY_DRIVER_BENEFIT_DTLS_MISSING':'Event day driver and benefit details is required',
    'MSG_EVENT_DAY_DRIVER_SCENARIOS_BENEFIT_DTLS_MISSING':'Event day driver scenarios and benefit details is required',
    'MSG_EVENT_DAY_DRIVER_BASIC_SCENARIO_DTLS_MISSING':'Basic scenario details is required',
    'MSG_EVENT_DAY_DRIVER_BASIC_SCENARIO_DTLS_EVTDAYS_MISSING':'Event days is required',
    'MSG_INVALID_EVENT_DAY':'Invalid event day',

    // Campaign routes
    'URI_CREATE_CAMPAIGN': '/campaign',
    'URI_GET_CAMPAIGNS': '/campaigns',
    'URI_GET_CAMPAIGN_WITH_CAMPAIGNID': '/campaign/:campaignId',
    'URI_DELETE_CAMPAIGN': '/campaign/:campaignId',
    'URI_CAMPAIGN_STATISTICS': '/campaign-statistics',
    'URI_MERCHANT_STATISTICS': '/merchant-statistics',

    // Filtering based on error type from schema validation errors
    'MIN_LENGTH_PARSING': 'does not meet minimum length of',
    'MAX_LENGTH_PARSING': 'does not meet maximum length of',
    'REQUIRED_PARSING': 'is required',
    'FORMAT_PARSING': 'does not conform to the',
    'ENUM_PARSING': 'is not one of enum values',
    'PATTERN_PARSING': 'does not match pattern',
    'DATATYPE_PARSING': 'is not of a type',
    'MIN_VALUE_PARSING': 'must have a minimum value of',
    'MAX_VALUE_PARSING': 'must have a maximum value of',
    'MIN_LENGTH_PARSING_FOR_LENGTH_1': 'does not meet minimum length of 1',

    // Sequence names
    'SEQ_CAMPAIGN_ID': 'SEQ_CAMPAIGN',
    'SEQ_SCENARIO_ID': 'SEQ_SCENARIO',
    'SEQ_SMS_MESSAGE_ID': 'SEQ_SMS_MESSAGE',

    //misc
    'HELP_URL': 'https://knowledgehub.collinsongroup.com/display/WRT/04+-+Business+Error+Responses+on+APIs/v1/errors/',
    'CON_TYPE_UTF': 'application/json; charset=utf-8',
    'CON_TYPE': 'application/json',
    'INCLUDE_ALL': 'ALL',
    'DATE_FORMAT': 'YYYYMMDD',
    'OWNER_ID': 'Owner identifier',
    'NUMBER_OF_DAYS': 'Number of days from transaction date to reset counter',
    'NUMBER_OF_MONTHS': 'Number of months from transaction date to reset counter',
    'DISCOUNT_FIXED_AMOUNT': 'Discount fixed amount',
    'DISCOUNT_PERCENTAGE': 'Discount percentage',

    /////////////////////////////////////////////////////////////////////////////////////////////


    // default
    'DEFAULT_APP_VERSION':'1',

    //
    'DEFAULT_PAGE':1,
    'DEFAULT_LIMIT':20,

    // status
    'STATUS_ACTIVE':'Active',
    'STATUS_INACTIVE':'Inactive',
    'STATUS_EXPIRED':'Expired',
    'STATUS_DELETED':'Deleted',
    'STATUS_ALL':'All',

    //driverType
    'DRIVER_TYPE_AMOUNT':'Amount',
    'DRIVER_TYPE_BIRTHDAY':'Birthday',
    'DRIVER_TYPE_EVENT_DAY':'Event day',
    'DRIVER_TYPE_GENERIC':'Generic',
    'DRIVER_TYPE_FREQUENCY':'Frequency',
    'DRIVER_TYPE_ITEM':'Item',
    'DRIVER_TYPE_LUCKY':'Lucky',
    'DRIVER_TYPE_RECENCY':'Recency',
    'DRIVER_TYPE_RECURRING_DAY':'Recurring day',
    'DRIVER_TYPE_WELCOME':'Welcome',

    // benefitType'
    'BENEFIT_TYPE_AWARD':'Award',
    'BENEFIT_TYPE_DISCOUNT':'Discount',
    'BENEFIT_TYPE_MULTIPLIER':'Multiplier',

    // common
    'STR_ALL':'All',

    // ownerType
    'OWNER_TYPE_CORPORATE':'Corporate',
    'OWNER_TYPE_MERCHANT':'Merchant',
    'OWNER_TYPE_PROGRAM_MANAGER':'Program manager',

    // merchantCampaignType
    'STR_MONO_MERCHANT':'Mono Merchant',
    'STR_MULTI_MERCHANT':'Multi Merchant',

    'STR_ONCE_PER_DAY':'Once Per Day',
    'STR_EVERY_VISIT':'Every Visit',

    // counterOverrideType
    'COUNTER_OVERRIDE_TYPE_NO_OVERRIDE':'No override',
    'COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_HIGHER':'Override if counter is higher',
    'COUNTER_OVERRIDE_TYPE_OVERRIDE_IF_COUNTER_IS_LOWER':'Override if counter is lower',

    // counterResetType
    'COUNTER_RESET_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY':'Reset at end of campaign validity',
    'COUNTER_RESET_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION':'Reset end of calendar month of 1st transaction',
    'COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE':'Reset x month(s) after 1st transaction date',
    'COUNTER_RESET_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE':'Reset x month(s) after each transaction date',
    'COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE':'Reset x day(s) after 1st transaction date',
    'COUNTER_RESET_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE':'Reset x day(s) after each transaction date',

    // counterResetType
    'COUNTER_RESET_TYPE_NONE':'None',
    'COUNTER_RESET_TYPE_PARTIAL':'Partial',
    'COUNTER_RESET_TYPE_TOTAL':'Total',

    // trigger frequency
    'TRIGGER_FREQUENCY_ONCE_PER_DAY':'Once per day',
    'TRIGGER_FREQUENCY_EVERY_TRANSACTION':'Every transaction',

    // benefitTriggerFrequencyType
    'BENEFIT_TRIGGER_FREQUENCY_TYPE_ONLY_ONCE':'Only once',
    'BENEFIT_TRIGGER_FREQUENCY_TYPE_EVERY_TRANSACTION':'Every transaction',

    // discountType
    'DISCOUNT_TYPE_FIXED_AMOUNT':'Fixed amount',
    'DISCOUNT_TYPE_PERCENTAGE':'Percentage of purchase amount',

    'DATEFORMAT_YYYYMMDD':'YYYYMMDD',

    'ERR_NOT_FOUND_INT':-999,

    // deleted allowed to non mono merchant
    'DELETED_ALLOWED_TRUE':'true',
    'DELETED_ALLOWED_FALSE':'false',

    'DRIVER_TYPE_AMOUNTDRIVERANDBENEFITSDETAILS':'amountDriverAndBenefitsDetails',
    'DRIVER_TYPE_FREQUENCYDRIVERANDBENEFITDETAILS':'frequencyDriverAndBenefitsDetails',
    'DRIVER_TYPE_RECENCYDRIVERANDBENETIFDETAILS':'recencyDriverAndBenefitsDetails',

    // Message Channel Type
    'MESSAGE_CHANNEL_TYPE_RECEIPT':'Receipt',
    'MESSAGE_CHANNEL_TYPE_SMS':'SMS',

    // Receipt Printing Type
    'RECEIPT_PRINTING_TYPE_SAME_RECEIPT_AS_PAYMENT':'Same receipt as payment',
    'RECEIPT_PRINTING_TYPE_NEW_RECEIPT_SEPARATE_FROM_PAYMENT':'New receipt separate from payment',
    ///////////// Database related constants

    // Campaign Type
    'DB_CAMPAIGN_TYPE_AMOUNT': 'A',
    'DB_CAMPAIGN_TYPE_FREQUENCY': 'F',
    'DB_CAMPAIGN_TYPE_EVENT': 'E',
    //Campaign subtype
    'DB_CAMPAIGN_SUBTYPE_DISCOUNT':'D',

    //Campaign subscription type used in table TERM_CAMPAIGN_COUNT
    'DB_CAMPAIGN_SUBSCRIBE_MANUAL':'M',
    'DB_CAMPAIGN_SUBSCRIBE_INTERFACE':'I',

    //Terminal type
    'DB_TERMINAL_TYPE':'A',

    // database status
    'DB_STATUS_ACTIVE':'E0',
    'DB_STATUS_INACTIVE':'E1',
    'DB_STATUS_EXPIRED':'E2',
    'DB_STATUS_DELETED':'E3',

    // owner type
    'DB_OWNERTYPE_CORPORTATE':2,
    'DB_OWNERTYPE_MERCHANT':1,
    'DB_OWNERTYPE_PROGRAM_MANAGER':0,

    // Accepted Frequency
    'DB_ACCEPTED_FREQUENCY_EVERY_TRANSACTION':0,
    'DB_ACCEPTED_FREQUENCY_ONCE_PER_DAY':1,

    // Mono Merchant
    'DB_MERCHANT_MULTI_MERCHANT':0,
    'DB_MERCHANT_MONO_MERCHANT':1,

    // expiry type
    'DB_EXPIRY_TYPE_RESET_AT_END_OF_CAMPAIGN_VALIDITY':0,
    'DB_EXPIRY_TYPE_RESET_END_OF_CALENDER_MONTH_OF_1ST_TRANSACTION':1,
    'DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_1ST_TRANSACTION_DATE':2,
    'DB_EXPIRY_TYPE_RESET_X_MONTHS_AFTER_EACH_TRANSACTION_DATE':3,
    'DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_1ST_TRANSACTION_DATE':4,
    'DB_EXPIRY_TYPE_RESET_X_DAYS_AFTER_EACH_TRANSACTION_DATE':5,

    // override
    'DB_OVERRIDE_NO_OVERRIDE':0,
    'DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_HIGHER':1,
    'DB_OVERRIDE_OVERRIDE_IF_COUNTER_IS_LOWER':2,

    // repeat_rwd_type
    'DB_REPEAT_REWARD_TYPE_EVERY_TRANSACTION':0,
    'DB_REPEAT_REWARD_TYPE_ONCE_ONLY':1,

    // repeat_rwd_multiple
    'DB_REPEAT_REWARD_MULTIPLE_TRUE':1,
    'DB_REPEAT_REWARD_MULTIPLE_FALSE':0,

    // scenarioReset
    'DB_SCENARIO_RESET_NONE':0,
    'DB_SCENARIO_RESET_PARTIAL':1,
    'DB_SCENARIO_RESET_TOTAL':2,

    // discount type
    'DB_DISCOUNT_TYPE_FIXED_AMOUNT':'F',
    'DB_DISCOUNT_TYPE_PERCENTAGE':'P',

    // message attribute
    'DB_MESSAGE_ATTRIBUTE_NORMAL':0,
    'DB_MESSAGE_ATTRIBUTE_BOLD':1,

    // available_for_vt
    'DB_AVAILABLE_FOR_VT_FALSE':0,
    'DB_AVAILABLE_FOR_VT_TRUE':1,

    // pnt_partial_reset: awardTriggeredAgainAfterReset
    'DB_PNT_PARTIAL_RESET_ENABLE':1,
    'DB_PNT_PARTIAL_RESET_DISABLE':0,

    // pnt_cascade_cpns: cascade
    'DB_PNT_CASCADE_CPNS_ENABLE':1,
    'DB_PNT_CASCADE_CPNS_DISABLE':0,

    // display_flag: receiptPrintingType
    'DB_DISPLAY_FLAG_SAME_RECEIPT':0,
    'DB_DISPLAY_FLAG_NEW_RECEIPT':1,

    //Counter reset no. of days
    'NUMBER_OF_DAYS_MINIMUM': 1,
    'NUMBER_OF_DAYS_MAXIMUM': 365,

    //Counter reset no. of months
    'NUMBER_OF_MONTHS_MINIMUM': 1,
    'NUMBER_OF_MONTHS_MAXIMUM': 12,

    //Discount fixed amount limit
    'DISCOUNT_FIXED_AMOUNT_MINIMUM': 0.01,
    'DISCOUNT_FIXED_AMOUNT_MAXIMUM': 9999999999.99,

    //Discount percentage limit
    'DISCOUNT_PERCENTAGE_MINIMUM': 0.01,
    'DISCOUNT_PERCENTAGE_MAXIMUM': 100.00,

    //Scenario receipt message maximum length 12 when bold true
    'SCENARIO_RECEIPT_MSG_MAX_LENGTH12': 12,
    //Subscriber Profile
    'SUBSCRIBER_PROFILE_CORPORATE':'Corporate',
    'SUBSCRIBER_PROFILE_MERCHANT':'Merchant',
    'SUBSCRIBER_PROFILE_DEVICE':'Device',

    //Roll Up Period Type
    'ROLL_UP_PERIOD_TYPE_PER_HOUR':'Per Hour',
    'ROLL_UP_PERIOD_TYPE_PER_DAY':'Per Day',
    'ROLL_UP_PERIOD_TYPE_PER_WEEK':'Per Week',
    'ROLL_UP_PERIOD_TYPE_PER_MONTH':'Per Month',
    'ROLL_UP_PERIOD_TYPE_PER_QUARTER':'Per Quarter',
    'ROLL_UP_PERIOD_TYPE_PER_SEMESTER':'Per Semester',
    'ROLL_UP_PERIOD_TYPE_PER_YEAR':'Per Year',
    'ROLL_UP_PERIOD_TYPE_CUMULATIVE':'Cumulative',

    //Rounding of numbers
    'ROUND_UP_DECIMAL_VALUE': 2,

    //sms message status
    'DB_SMS_MESSAGE_STATUS_ACTIVE': 0,

    //XLS Transaction Types
    'XLS_TXN_TYPE_SALE': 17,
    'XLS_TXN_TYPE_UPDATE': 18,
    'XLS_TXN_TYPE_CANCEL': 5,
    'XLS_TXN_TYPE_REFUND': 8,

    //Default values for maxLimitForRollUpPeriods
    'MAX_LIMIT_FOR_ROLLUP_PERIODS':{
        'MAX_LIMIT_IN_DAYS_FOR_PER_HOUR': '1',
        'MAX_LIMIT_IN_DAYS_FOR_PER_DAY': '31',
        'MAX_LIMIT_IN_MONTHS_FOR_PER_WEEK': '3',
        'MAX_LIMIT_IN_MONTHS_FOR_PER_MONTH': '12',
        'MAX_LIMIT_IN_YEARS_FOR_PER_QUARTER': '1',
        'MAX_LIMIT_IN_YEARS_FOR_PER_SEMESTER': '3',
        'MAX_LIMIT_IN_YEARS_FOR_PER_YEAR': '3',
        'MAX_LIMIT_IN_YEARS_FOR_CUMULATIVE': '3'
    }

};
