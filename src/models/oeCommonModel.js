'use strict';

function oeCommonModel() {
    return {};
}

module.exports = oeCommonModel;

var Q = require('q');
var logger = require('../lib/logUtil');
var commonDBUtil = require('../lib/commonDBUtil');

/**
 * Get OE active flag
 *
 * @returns {d.promise}
 */
oeCommonModel.getOeActiveFlag = function () {
    logger.msg('INFO', 'oeCommonService', 'oeCommonModel', '', 'getOeActiveFlag', 'start');
    var d = Q.defer();

    var sql = ' select  NVL(OE_ROW_FLAG, 0) oeActiveFlag ' +
            ' from OE_ACTIVE_ROW_FLAG ';

    commonDBUtil.getDbConn().execute(sql, function (err, result) {
        if (err) {
            logger.msg('ERROR', 'oeCommonService', 'oeCommonModel', '', 'getOeActiveFlag',
                'Error during executing SQL :: err - ' + err.stack);
            d.reject(err);
        } else {
            logger.msg('INFO', 'oeCommonService', 'oeCommonModel', '', 'getOeActiveFlag',
                'get oe active flag = '+result.rows[0]);
            var row = result.rows[0];
            d.resolve(parseInt(row[0]));
        }
    });
    return d.promise;
};
