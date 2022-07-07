const baseResponseStatus = require("../../../config/baseResponseStatus")
const recordProvider = require('./recordProvider');
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 0.1
 * API Name: Test API
 * [GET] /app/test
 */
exports.getTest = async function(req, res){
    return res.send(baseResponseStatus.SUCCESS);
}