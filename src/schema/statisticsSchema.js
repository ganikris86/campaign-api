'use strict';
/**
 * Scheme definition for request of compute statistics API
 *
 */

function statisticsSchema() {
}

module.exports = statisticsSchema;

statisticsSchema.campaignStatisticsReqSchemaDef = {
    id: '/campaignStatistics',
    type: 'object',
    properties: {
        'rollUpPeriodType': {
            required: true,
            type: 'string',
            'enum': ['Per Hour', 'Per Day', 'Per Week', 'Per Month', 'Per Quarter', 'Per Semester', 'Per Year', 'Cumulative']
        },
        'period': {
            '$ref':'/period'
        },
        'merchantId': {
            required: true,
            type: 'integer',
            minimum: 1,
            maximum: 4294967295
        },
        'campaignId': {
            type: 'integer',
            minimum: 1,
            maxLength: 8
        },
        'isMerchantCampaign': {
            type: 'boolean'
        }
    },
    'additionalProperties': false
};

statisticsSchema.merchantStatisticsReqSchemaDef = {
    id: '/merchantStatistics',
    type: 'object',
    properties: {
        'rollUpPeriodType': {
            required: true,
            type: 'string',
            'enum': ['Per Hour', 'Per Day', 'Per Week', 'Per Month', 'Per Quarter', 'Per Semester', 'Per Year']
        },
        'period': {
            '$ref':'/period'
        },
        'merchantId': {
            required: true,
            type: 'integer',
            minimum: 1,
            maximum: 4294967295
        }
    },
    'additionalProperties': false
};

statisticsSchema.periodSchemaDef = {
    id: '/period',
    type: 'object',
    required: true,
    properties: {
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
        }
    },
    'additionalProperties': false
};

statisticsSchema.statisticsResourceMapping = {
    'rollUpPeriodType': 'roll up period type',
    'period.startDate': 'start date',
    'period.endDate': 'end date',
    'campaignId': 'campaign identifier',
    'merchantId': 'merchant identifier',
    'isMerchantCampaign': 'is merchant campaign'
};
