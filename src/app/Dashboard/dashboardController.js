const dashboardProvider = require("../../app/Dashboard/dashboardProvider");
const dashboardService = require("../../app/Dashboard/dashboardService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No.10.1
 * API Name : 유저 수 조회 API
 * [GET] /dashboard/countUser
 * 
 */
exports.countUser = async function(req, res){
    const countUserResult = await dashboardProvider.retrieveUserCount();
    return res.send(response(baseResponse.SUCCESS, countUserResult));
}