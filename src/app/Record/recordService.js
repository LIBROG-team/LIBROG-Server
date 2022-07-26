const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {connect} = require("http2");
const recordProvider = require("./recordProvider");
const recordDao = require("./recordDao");

/**
 * API No. 0.2
 * API Name: FlowerPot에는 있지만 UserFlowerList에는 없는 화분 UserFlowerList에 추가해주는 코드
 */


/**
 * API No.2.3
 * API Name: 독서 기록 추가 API
 * [POST] /records/addition
 */
exports.createRecords = async function(createRecordsParams){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        // bookIdx DB에 있는지 check? -> db에 있는것만 검색 api에서 주니까 pass
        // flowerPotIdx만 check -> 0725 최근 화분으로 고정.
        const userIdx = createRecordsParams[1];
        const flowerPotCheckResult = await recordDao.checkFlowerPot(connection, userIdx);
        
        if(flowerPotCheckResult.length < 1){
            return errResponse(baseResponse.USER_NO_AVAILABLE_FLOWERPOTS);
        }
        // console.log(flowerPotCheckResult);
        
        const flowerPotIdx = flowerPotCheckResult[0].FlowerPotIdx;
        // console.log(flowerPotCheckResult, flowerPotIdx);
        // return;
        
        createRecordsParams.push(flowerPotIdx);
        // console.log(createRecordsParams);
        // return;
        const createRecordsList = await recordDao.insertRecords(connection, createRecordsParams);
        // console.log(createRecordsList);
        return response(baseResponse.SUCCESS, {'createdRecordId':createRecordsList.insertId});
    }catch(err){
        logger.error(`App - createRecords Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

/**
 * API No. 2.36
 * API Name: 책 table에 추가 API
 */
exports.createBook = async function(createBookParams){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        const createBookList = await recordDao.insertBookIdx(connection, createBookParams);
        return response(baseResponse.SUCCESS, createBookList);
    }catch(err){
        logger.error(`App - createBook Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

/**
 * API No. 2.4
 * API Name: 독서 기록 수정 API
 * [PATCH] /records/fix
 */
exports.editRecords = async function(patchRecordsParams){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        // validation - records 삭제되고 없을때
        const checkRecordsList = await recordDao.checkRecords(connection, patchRecordsParams[3]);
        if(checkRecordsList.length < 1 || checkRecordsList[0].status == 'DELETED'){
            connection.release();
            return errResponse(baseResponse.RECORDS_NO_RECORDS);
        }
        const editRecordsList = await recordDao.updateRecords(connection, patchRecordsParams);
        return response(baseResponse.SUCCESS, editRecordsList);
    }catch(err){
        logger.error(`App - editRecords Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}
/**
 * API No. 2.5
 * API Name: 독서 기록 삭제 API
 * [PATCH] /records/removal
 */
exports.removeRecords = async function(recordsIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        // validation - records 삭제되고 없을때
        const checkRecordsList = await recordDao.checkRecords(connection, recordsIdx);
        if(checkRecordsList.length < 1 || checkRecordsList[0].status == 'DELETED'){
            connection.release();
            return errResponse(baseResponse.RECORDS_NO_RECORDS);
        }
        const removeRecordsList = await recordDao.deleteRecords(connection, recordsIdx);
        return response(baseResponse.SUCCESS, removeRecordsList);
    }catch(err){
        logger.error(`App - removeRecords Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}