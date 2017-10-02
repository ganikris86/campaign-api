'use strict';
/**
 * Scheme definition for request of campaign create API
 *
 */

function baseSchema() {
}

module.exports = baseSchema;

baseSchema.createCampaignReqSchemaDef = {
    id: '/campaign',
    type: 'object',
    properties: {
        'name': {
            required: true,
            type: 'string',
            maxLength: 24
        },
        'startDate': {
            required: true,
            type: 'string',
            minLength: 8,
            maxLength: 8
        },
        'endDate': {
            required: true,
            type: 'string',
            minLength: 8,
            maxLength: 8
        },
        'minimumPurchaseAmount': {
            required: true,
            type: 'number',
            minimum: 0.01,
            maximum: 9999999.99
        },
        'maximumPurchaseAmount': {
            required: true,
            type: 'number',
            minimum: 0.01,
            maximum: 9999999.99
        },
        'ownerType': {
            required: true,
            type: 'string',
            'enum': ['Corporate', 'Merchant', 'Program manager']
        },
        'ownerId': {
            type: 'integer',
            minimum: 1,
            maximum: 4294967295
        },
        'triggerFrequencyType':{
            type: 'string',
            'enum': ['Once per day', 'Every transaction']
        },
        'shortDescription':{
            type: 'string',
            maxLength: 800
        },
        'driverType': {
            required: true,
            type: 'string',
            'enum': ['Amount', 'Frequency', 'Event day']
            /**
             * TODO - Other types will be implemented later
             * 'enum': ['Amount', 'Birthday', 'Event day', 'Generic', 'Frequency', 'Item', 'Lucky', 'Recency', 'Recurring day', 'Welcome]
             */
        },
        'benefitType': {
            required: true,
            type: 'string',
            'enum': ['Discount']
            /**
             * TODO - Other subtypes will be implemented later
             * 'enum': ['Award', 'Discount', 'Multiplier']
             */
        },
        'isSubscribableToServeralMerchants':{
            type: 'boolean'
        },
        'isSubscribableToHostAndVirtualTerminals':{
            type: 'boolean'
        },
        'imageUrl': {
            type: 'string',
            maxLength: 2083
        },
        'mobileMessage': {
            type: 'string',
            maxLength: 100
        },
        'status': {
            type: 'string',
            'enum': ['Active']
            /**
             * TODO - Inactive status will be implemented later
             * 'enum': ['Active', 'Inactive']
             */
        },
        'driverAndBenefitsDetails':{
            '$ref':'/driverAndBenefitsDetails'
        }

        /**
         * TODO - Structures for capping, liability, subscription, etc are to be included later
         */

    },
    'additionalProperties': false
};

//This definition is used when request body is empty or driverType is missing or benefitType is missing
baseSchema.dummyDriverAndBenefitsDetailsSchemaDef = {
    type: 'object',
    required: true,
    'additionalProperties': false
};

baseSchema.counterResetDetailsSchemaDef = {
    id: '/counterResetDetails',
    type: 'object',
    properties: {
        'counterResetType': {
            required: true,
            type: 'string',
            'enum': ['Reset x day(s) after 1st transaction date', 'Reset x day(s) after each transaction date', 'Reset x month(s) after 1st transaction date', 'Reset x month(s) after each transaction date', 'Reset end of calendar month of 1st transaction', 'Reset at end of campaign validity']
        },
        'noOfDaysFromTransactionDateToResetCounter': {
            type: 'integer'
        },
        'noOfMonthsFromTransactionDateToResetCounter': {
            type: 'integer'
        }
    },
    'additionalProperties': false
};

baseSchema.benefitDetailsSchemaDef = {
    id: '/benefitDetails',
    type: 'object',
    required: true,
    properties: {
        'benefitTriggerFrequencyType': {
            required: true,
            type: 'string',
            'enum': ['Every transaction']
            /**
             * TODO: ['Multiple of', 'Once only', 'Every transaction']
             */
        },
        'discountBenefitDetails': {
            '$ref': '/discountBenefitDetails'
        }
        /**
         * TODO: awardBenefitsDetails
         */
    },
    'additionalProperties': false
};

baseSchema.discountBenefitDetailsSchemaDef = {
    id: '/discountBenefitDetails',
    type: 'object',
    properties: {
        'discountType': {
            required: true,
            type: 'string',
            'enum': ['Fixed amount', 'Percentage of purchase amount']
        },
        'discountFixedAmount': {
            type: 'number'
        },
        'discountPercentage': {
            type: 'number'
        }
    },
    'additionalProperties': false
};

//This definition is used when benefitType is other than enum values
baseSchema.dummyBenefitDetailsSchemaDef = {
    type: 'object',
    'additionalProperties': false
};

baseSchema.scenarioMessageDetailsSchemaDef = {
    id: '/scenarioMessageDetails',
    type: 'object',
    properties: {
        'messageChannelType': {
            required: true,
            type: 'array',
            'enum': [['Receipt'], ['SMS'], ['Receipt', 'SMS'], ['SMS', 'Receipt']]
        },
        'receiptMessageDetails': {
            '$ref': '/receiptMessageDetails'
        },
        'smsMessage':{
            type: 'string',
            maxLength: 500
        }
    },
    'additionalProperties': false
};

baseSchema.receiptMessageDetailsSchemaDef = {
    id: '/receiptMessageDetails',
    type: 'object',
    properties: {
        'receiptPrintingType': {
            type: 'string',
            'enum': ['Same receipt as payment', 'New receipt separate from payment']
        },
        'receiptMessages': {
            type: 'array',
            maxItems: 8,
            'items': { '$ref': '/receiptMessages' }
        }
    },
    'additionalProperties': false
};

baseSchema.receiptMessagesSchemaDef = {
    id: '/receiptMessages',
    type: 'object',
    properties: {
        'lineNumber': {
            required: true,
            type: 'number',
            'enum': [1,2,3,4,5,6,7,8]
        },
        'message': {
            required: true,
            type: 'string',
            maxLength: 24
        },
        'isMessagePrintedInBold': {
            type: 'boolean'
        }
    },
    'additionalProperties': false
};


baseSchema.campaignResourceMapping = {
    'name': 'name',
    'type': 'type',
    'benefitType': 'benefit type',
    'imageUrl': 'image url',
    'driverType': 'driver type',
    'ownerType': 'owner type',
    'startDate': 'start date',
    'endDate': 'end date',
    'minimumPurchaseAmount': 'minimum purchase amount',
    'maximumPurchaseAmount': 'maximum purchase amount',
    'ownerId': 'owner identifier',
    'driverAndBenefitsDetails': 'Driver and benefit details',
    'triggerFrequencyType': 'trigger frequency type',
    'isSubscribableToServeralMerchants': 'is subscribable to serveral merchants',
    'isSubscribableToHostAndVirtualTerminals': 'is subscribable to host and virtual terminals',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isAwardTriggeredAgainAfterCounterReset': 'is award triggered again after counter reset',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isCascadedAwardTriggered': 'is cascaded award triggered',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.counterResetDetails.noOfDaysFromTransactionDateToResetCounter': 'No. of days from transaction date to reset counter',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.counterResetDetails.noOfMonthsFromTransactionDateToResetCounter': 'No. of months from transaction date to reset counter',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.counterOverrideType':'Counter override type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.counterResetDetails.counterResetType':'Counter reset type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.isMultipleScenarioTriggerAllowed': 'is multiple scenario trigger allowed',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioNumber':'Scenario number',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].purchaseAmountSlab':'Purchase amount slab',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].counterResetType':'Counter reset type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails':'Benefit details',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails.benefitTriggerFrequencyType':'Benefit trigger frequency type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails':'Discount benefit details',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountType':'Discount type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountFixedAmount':'Discount fixed amount',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountPercentage':'Discount percentage',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].purchaseAmountSlab.lower':'Purchase amount slab lower',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].purchaseAmountSlab.upper':'Purchase amount slab upper',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.messageChannelType':'Message channel type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType':'Receipt printing type',
    'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages':'Receipt messages',

    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.isAwardTriggeredAgainAfterCounterReset': 'is award triggered again after counter reset',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.isCascadedAwardTriggered': 'is cascaded award triggered',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.counterResetDetails.noOfDaysFromTransactionDateToResetCounter': 'No. of days from transaction date to reset counter',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.counterResetDetails.noOfMonthsFromTransactionDateToResetCounter': 'No. of months from transaction date to reset counter',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.counterOverrideType':'Counter override type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.counterResetDetails.counterResetType':'Counter reset type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.isMultipleScenarioTriggerAllowed': 'is multiple scenario trigger allowed',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioNumber':'Scenario number',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].visitSlab':'Visit slab',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].counterResetType':'Counter reset type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails':'Benefit details',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails.benefitTriggerFrequencyType':'Benefit trigger frequency type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountBenefitDetails': 'Discount benefit details',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountType':'Discount type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountFixedAmount':'Discount fixed amount',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].benefitDetails.discountBenefitDetails.discountPercentage':'Discount percentage',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].visitSlab.lower':'Visit slab lower',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].visitSlab.upper':'Visit slab upper',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.messageChannelType':'Message channel type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptPrintingType':'Receipt printing type',
    'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages':'Receipt messages',

    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails': 'Event day driver and benefit details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails': 'Event day driver scenarios and benefit details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails': 'Basic scenario details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.eventDays': 'Event days',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails': 'Benefit details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails.benefitTriggerFrequencyType': 'Benefit trigger frequency type',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails.discountBenefitDetails': 'Discount benefit details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails.discountBenefitDetails.discountType':'Discount type',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails.discountBenefitDetails.discountFixedAmount':'Discount fixed amount',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.benefitDetails.discountBenefitDetails.discountPercentage':'Discount percentage',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails':'Scenario message details',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.messageChannelType':'Message channel type',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.receiptMessageDetails.receiptPrintingType':'Receipt printing type',
    'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.receiptMessageDetails.receiptMessages':'Receipt messages',

    'lineNumber':'Line number',
    'message':'Message',
    'isMessagePrintedInBold':'Message printed in bold'
};

for (var i = 0; i < 8; i++) {
    var lineNum = 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].lineNumber';
    var message = 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].message';
    var printBold = 'driverAndBenefitsDetails.amountDriverAndBenefitsDetails.amountDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].isMessagePrintedInBold';
    baseSchema.campaignResourceMapping[lineNum] = 'Line number';
    baseSchema.campaignResourceMapping[message] = 'Message';
    baseSchema.campaignResourceMapping[printBold] = 'Message printed in bold';

    lineNum = 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].lineNumber';
    message = 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].message';
    printBold = 'driverAndBenefitsDetails.frequencyDriverAndBenefitsDetails.frequencyDriverScenariosAndBenefitsDetails[0].scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].isMessagePrintedInBold';
    baseSchema.campaignResourceMapping[lineNum] = 'Line number';
    baseSchema.campaignResourceMapping[message] = 'Message';
    baseSchema.campaignResourceMapping[printBold] = 'Message printed in bold';

    lineNum = 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].lineNumber';
    message = 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].message';
    printBold = 'driverAndBenefitsDetails.eventDayDriverAndBenefitsDetails.eventDayDriverScenariosAndBenefitsDetails.basicScenarioDetails.scenarioMessageDetails.receiptMessageDetails.receiptMessages['+i+'].isMessagePrintedInBold';
    baseSchema.campaignResourceMapping[lineNum] = 'Line number';
    baseSchema.campaignResourceMapping[message] = 'Message';
    baseSchema.campaignResourceMapping[printBold] = 'Message printed in bold';
}
