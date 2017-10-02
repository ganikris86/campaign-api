'use strict';
/**
 * Scheme definition for request of event day campaign create API
 *
 */

function eventDayDriverSchema() {
}

module.exports = eventDayDriverSchema;

eventDayDriverSchema.driverAndBenefitsDetailsSchemaDef = {
    id: '/driverAndBenefitsDetails',
    type: 'object',
    required: true,
    properties: {
        'eventDayDriverAndBenefitsDetails': {
            '$ref': '/eventDayDriverAndBenefitsDetails'
        }
    },
    'additionalProperties': false
};

eventDayDriverSchema.eventDayDriverAndBenefitsDetailsSchemaDef = {
    id: '/eventDayDriverAndBenefitsDetails',
    type: 'object',
    required: true,
    properties: {
        'eventDayDriverScenariosAndBenefitsDetails' : {
            '$ref': '/eventDayDriverScenariosAndBenefitsDetails'
        }
    },
    'additionalProperties': false
};

eventDayDriverSchema.eventDayDriverScenariosAndBenefitsDetailsSchemaDef = {
    id: '/eventDayDriverScenariosAndBenefitsDetails',
    type: 'object',
    required: true,
    properties: {
        'basicScenarioDetails': {
            '$ref': '/basicScenarioDetails'
        }
    },
    'additionalProperties': false
};

eventDayDriverSchema.basicScenarioDetailsSchemaDef = {
    id: '/basicScenarioDetails',
    type: 'object',
    required: true,
    properties: {
        'eventDays': {
            required: true,
            type: 'array',
            minItems: 1,
            maxItems: 8
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
