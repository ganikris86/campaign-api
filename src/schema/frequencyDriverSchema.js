'use strict';
/**
 * Scheme definition for request of frequency campaign create API
 *
 */

function frequencyDriverSchema() {
}

module.exports = frequencyDriverSchema;

frequencyDriverSchema.driverAndBenefitsDetailsSchemaDef = {
    id: '/driverAndBenefitsDetails',
    type: 'object',
    required: true,
    properties: {
        'frequencyDriverAndBenefitsDetails': {
            '$ref': '/frequencyDriverAndBenefitsDetails'
        }
    },
    'additionalProperties': false
};

frequencyDriverSchema.frequencyDriverAndBenefitsDetailsSchemaDef = {
    id: '/frequencyDriverAndBenefitsDetails',
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
        'frequencyDriverScenariosAndBenefitsDetails' : {
            type: 'array',
            minItems: 1,
            maxItems: 1,
            'items': {'$ref': '/frequencyDriverScenariosAndBenefitsDetails'}
        }

    },
    'additionalProperties': false
};

frequencyDriverSchema.frequencyDriverScenariosAndBenefitsDetailsSchemaDef = {
    id: '/frequencyDriverScenariosAndBenefitsDetails',
    type: 'object',
    properties: {
        'scenarioNumber': {
            required: true,
            type: 'number',
            'enum': [1,2,3,4]
        },
        'visitSlab': {
            '$ref': '/visitSlab'
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

frequencyDriverSchema.visitSlabSchemaDef = {
    id: '/visitSlab',
    type: 'object',
    required: true,
    properties: {
        'lower': {
            required: true,
            type: 'integer',
            minimum: 1,
            maximum: 999
        },
        'upper': {
            required: true,
            type: 'integer',
            minimum: 1,
            maximum: 999
        }
    },
    'additionalProperties': false
};

