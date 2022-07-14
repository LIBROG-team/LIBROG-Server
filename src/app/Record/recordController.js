const baseResponse = require("../../../config/baseResponseStatus")
const recordProvider = require('./recordProvider');
const recordService = require('./recordService');
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 0.1
 * API Name: Test API
 * [GET] /app/test
 */
exports.getTest = async function(req, res){
    return res.send(baseResponse.SUCCESS);
}
/**
 * API No.2.1
 * API Name: 유저별 독서 기록 조회 API
 * [GET] /records/user/:userIdx
 */
exports.getUserRecords = async function(req, res){
    const userIdx = req.params.userIdx;
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
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
        return res.send(errResponse(baseResponse.RECORDS_FLOWERPOTIDX_EMPTY));
    }else if(flowerPotIdx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_FLOWERPOTIDX_LENGTH));
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
    const {bookIdx, userIdx, flowerPotIdx, starRating, quote, content} = req.body;
    const createRecordsParams = [bookIdx, userIdx, flowerPotIdx, starRating, quote, content];
    // validation
    if(!bookIdx){
        return res.send(errResponse(baseResponse.RECORDS_BOOKIDX_EMPTY));
    }else if(bookIdx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_BOOKIDX_LENGTH));
    }else if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }else if(!flowerPotIdx){
        return res.send(errResponse(baseResponse.RECORDS_FLOWERPOTIDX_EMPTY));
    }else if(flowerPotIdx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_FLOWERPOTIDX_LENGTH));
    }else if(quote.length > 1000){
        return res.send(errResponse(baseResponse.RECORDS_QUOTE_LENGTH));
    }else if(content.length > 10000){
        return res.send(errResponse(baseResponse.RECORDS_CONTENT_LENGTH));
    }
    // starRating - 0~5 사이의 값인지만 validation
    if(starRating < 0 || starRating > 5){
        return res.send(errResponse(baseResponse.RECORDS_RATING_LENGTH));
    }
    // quote, content도 마찬가지.
    const postRecordsResult = await recordService.createRecords(createRecordsParams);
    return res.send(postRecordsResult);
}
/** 더미 데이터
{
    "bookIdx":1,
    "userIdx":1,
    "flowerPotIdx":1,
    "starRating":5,
    "quote":"quote_test",
    "content":"content_test"
}
 */

/**
 * API No. 2.4
 * API Name: 독서 기록 수정 API
 * [PATCH] /records/fix
 */
exports.patchRecords = async function(req, res){
    const {starRating, quote, content, idx} = req.body;
    // 여기서도 starRating Validation만 해줌.
    if(starRating < 0 || starRating > 5){
        return res.send(errResponse(baseResponse.RECORDS_RATING_LENGTH));
    }else if(idx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_RECORDSIDX_LENGTH));
    }else if(quote.length > 1000){
        return res.send(errResponse(baseResponse.RECORDS_QUOTE_LENGTH));
    }else if(content.length > 10000){
        return res.send(errResponse(baseResponse.RECORDS_CONTENT_LENGTH));
    }
    // 정규식 검사로 특수문자 등 못넣게(SQL injection 방지) 해야함.
    const patchRecordsParams = [starRating, quote, content, idx];
    const patchRecordsResult = await recordService.editRecords(patchRecordsParams);
    return res.send(patchRecordsResult);
}
/** 더미데이터
{
    "starRating":5,
    "quote":"quote_test",
    "content":"content_test",
    "idx":2
}
 */

/**
 * API No. 2.5
 * API Name: 독서 기록 삭제 API
 * [PATCH] /records/removal
 */
exports.deleteRecords = async function(req, res){
    const recordsIdx = req.body.recordsIdx;
    if(recordsIdx <= 0){
        res.send(errResponse(baseResponse.RECORDS_RECORDSIDX_LENGTH));
    }
    const deleteRecordsResult = await recordService.removeRecords(recordsIdx);
    return res.send(deleteRecordsResult);
}
/** 더미데이터
{
    "recordsIdx":2
}
 */