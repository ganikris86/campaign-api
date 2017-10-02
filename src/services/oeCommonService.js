'use strict';

var oeCommonModel = require('../models/oeCommonModel');
var logger = require('../lib/logUtil');
var constants = require('../lib/constants');
var Q = require('q');

function oeCommonService() {
}

module.exports = oeCommonService;

/**
 * Get the OE active flag
 *
 * @returns {d.promise}
 */
oeCommonService.getOeActiveFlag = function () {
    var d = Q.defer();
    logger.msg('INFO', 'oeCommonService', '', '', 'getOeActiveFlag', 'start');

    oeCommonModel.getOeActiveFlag()
        .then(function (value) {
            d.resolve(value);
        }, function(err){
            logger.msg('ERROR', 'oeCommonService', '', '', 'getOeActiveFlag',
                'Error in getOeActiveFlag '+err.stack);
            d.reject(err);
        });

    return d.promise;
};
