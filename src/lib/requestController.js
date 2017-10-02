'use strict';

var logger = require('./logUtil');
var commonUtil = require('./commonUtil');
var constants = require('./constants');
var httpStatus = require('http-status');


module.exports = function (req, res, next) {

    var accept = req.get('Accept');
    var contentType = req.get('content-type');
    var authorization = req.get('Authorization');
    var authorizationConfig = require('nconf').file({file: 'config/authorizationConfig.json'});
    var apiKeyArray = authorizationConfig.get('keys');
    var method = req.method;
	logger.msg('INFO', 'requestController', '', '', '', 'req.path = ' + req.path);
    if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'GET') {
        logger.msg('INFO', 'requestController', '', '', '', 'accept = ' + accept);
        logger.msg('INFO', 'requestController', '', '', '', 'contentType = ' + contentType);
        var acceptFlag = false, authorizationFlag = false;
        if ((accept === undefined || accept === null || accept === '' || accept === '*/*')) {
            acceptFlag = false;
        } else {
            acceptFlag = true;
        }

        if ((authorization === undefined || authorization === null || authorization === '')) {
            authorizationFlag = false;
        } else {
            authorizationFlag = true;
        }

        logger.msg('INFO', 'requestController', '', '', '', 'acceptFlag = ' + acceptFlag);

        if (acceptFlag && accept !== constants.CON_TYPE) {
            logger.msg('INFO', 'requestController', '', '', '', 'accept header is invalid');
            commonUtil.sendResponseWoBody(res, httpStatus.NOT_ACCEPTABLE);
        /* OC-224 - ContentType will be optional. Validate if provided in header
		} else if (contentType === undefined || contentType === null || contentType === '') {
            logger.msg('INFO', 'requestController', '', '', '', 'content type is mandatory');
            commonUtil.sendResponseWoBody(res, httpStatus.UNSUPPORTED_MEDIA_TYPE);
		*/
        } else if (contentType && contentType !== constants.CON_TYPE) {
            logger.msg('INFO', 'requestController', '', '', '', 'content type is invalid');
            commonUtil.sendResponseWoBody(res, httpStatus.UNSUPPORTED_MEDIA_TYPE);
        } else if (!authorizationFlag || (authorizationFlag && !apiKeyArray.find(obj => obj.key.value === authorization))) {
            logger.msg('INFO', 'requestController', '', '', '', 'authorization Header is invalid');
            commonUtil.sendResponseWoBody(res, httpStatus.UNAUTHORIZED);
        } else {
            logger.msg('INFO', 'requestController', '', '', '', 'authorization Header is valid');
            commonUtil.setTenantInfoToGlobal(req);
            next();
        }
    } else {
        next();
    }
};


