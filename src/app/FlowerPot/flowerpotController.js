const flowerpotProvider = require("./flowerpotProvider");
const flowerpotService = require("./flowerpotService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No.1
 * API Name : 화분 조회 API
 * [GET] /app/flowerpots/:userIdx
 * 
 */
exports.getflowerpots = async function(req, res){
/*
    Path Variable : userIdx
*/
    const userIdx = req.params.userIdx;

    // validation
    if(!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } 
    if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    const userIdxResult = await flowerpotProvider.retrieveFlowerpot(userIdx);
    
    return res.send(response(baseResponse.SUCCESS, userIdxResult))

}