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
/**
 * API No.2.1
 * API Name: 유저별 독서 기록 조회 API
 * [GET] /records/user/:userIdx
 */
exports.getUserRecords = async function(req, res){
    const userIdx = req.params.userIdx;
    if(!userIdx){
        return res.send(errResponse(baseResponseStatus.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponseStatus.USER_USERIDX_LENGTH));
    }
    const userRecordsResult = await recordProvider.readUserRecords(userIdx);
    return res.send(userRecordsResult);
}
/**
 * API No. 2.2
 * API Name: 화분별 독서 기록 조회 API
 * [GET] /records/flowerpot/:flowerPotIdx
 */
exports.getFlowerPotRecords = async function(req, res){
    const flowerPotIdx = req.params.flowerPotIdx;
    if(!flowerPotIdx){
        return res.send(errResponse(baseResponseStatus.RECORDS_FLOWERPOTIDX_EMPTY));
    }else if(flowerPotIdx <= 0){
        return res.send(errResponse(baseResponseStatus.RECORDS_FLOWERPOTIDX_LENGTH));
    }
    const getFlowerPotRecordsResult = await recordProvider.readFlowerPotRecords(flowerPotIdx);
    return res.send(getFlowerPotRecordsResult);
}

/**
 * API No.2.3
 * API Name: 독서 기록 추가 API
 * [POST] /records/addition
 */
exports.postRecords = async function(req, res){
    const {} = req.body;
}