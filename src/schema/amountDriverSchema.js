'use strict';
/**
 * Scheme definition for request of amount campaign create API
 *
 */

function amountDriverSchema() {
}

module.exports = amountDriverSchema;

amountDriverSchema.driverAndBenefitsDetailsSchemaDef = {
    id: '/driverAndBenefitsDetails',
    type: 'object',
    required: true,
    properties: {
        'amountDriverAndBenefitsDetails': {
            '$ref': '/amountDriverAndBenefitsDetails'
        }
    },
    'additionalProperties': false
};

amountDriverSchema.amountDriverAndBenefitsDetailsSchemaDef = {
    id: '/amountDriverAndBenefitsDetails',
    type: 'object',
    properties: {
        'counterOverrideType': {
            required: true,
            type: 'string',
            'enum': ['No override']
            /**
             * TODO: 'enum': ['No Override', 'Override if counter is higher', 'Override if counter is lower']
             */
        },
        'counterResetDetails': {
            '$ref': '/counterResetDetails'
        },
        'isMultipleScenarioTriggerAllowed': {
            type: 'boolean'
        },
        'isAwardTriggeredAgainAfterCounterReset': {
            type: 'boolean'
        },
        'isCascadedAwardTriggered':{
            type: 'boolean'
        },
        'amountDriverScenariosAndBenefitsDetails' : {
            type: 'array',
            minItems: 1,
            maxItems: 1,
            'items': {'$ref': '/amountDriverScenariosAndBenefitsDetails'}
        }

    },
    'additionalProperties': false
};

amountDriverSchema.amountDriverScenariosAndBenefitsDetailsSchemaDef = {
    id: '/amountDriverScenariosAndBenefitsDetails',
    type: 'object',
    properties: {
        'scenarioNumber': {
            required: true,
            type: 'number',
            'enum': [1,2,3,4]
        },
        'purchaseAmountSlab': {
            '$ref': '/purchaseAmountSlab'
        },
        'counterResetType': {
            required: true,
            type: 'string',
            'enum': ['None']
            /**
             * TODO: ['None', 'Partial (Amount Only)', 'Total']
             */
        },
        'benefitDetails': {
            '$ref': '/benefitDetails'
        },
        'scenarioMessageDetails': {
            '$ref': '/scenarioMessageDetails'
        }
    },
    'additionalProperties': false
};

amountDriverSchema.purchaseAmountSlabSchemaDef = {
    id: '/purchaseAmountSlab',
    type: 'object',
    required: true,
    properties: {
        'lower': {
            required: true,
            type: 'number',
            minimum: 0.01,
            maximum: 167772.15
        },
        'upper': {
            required: true,
            type: 'number',
            minimum: 0.01,
            maximum: 167772.15
        }
    },
    'additionalProperties': false
};

