const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { response, errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const recordDao = require("./recordDao");
/**
 * API No.2.1
 * API Name: 유저별 독서 기록 조회 API
 * [GET] /records/user/:userIdx
 */
exports.readUserRecords = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIdxRows = await recordDao.checkUserIdx(connection, userIdx);
    // 유저 없는지
    if(checkUserIdxRows.length < 1){
        connection.release();
        return errResponse(baseResponse.USER_NOT_EXIST);
    }
    // 독서기록 받아오는 부분, 유저 독서기록 없을때 처리
    const userRecordsList = await recordDao.selectUserRecords(connection, userIdx);
    if(userRecordsList.length < 1){
        connection.release();
        return errResponse(baseResponse.USER_NO_RECORDS);
    }
    connection.release();
    return response(baseResponse.SUCCESS, userRecordsList);
}
/**
 * API No. 2.2
 * API Name: 화분별 독서 기록 조회 API
 * [GET] /records/flowerpot/:flowerPotIdx
 */
exports.readFlowerPotRecords = async function(flowerPotIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    // flowerpot 없을때
    const checkFlowerPotRows = await recordDao.checkFlowerPot(connection, flowerPotIdx);
    if(checkFlowerPotRows.length < 1){
        connection.release();
        return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
    }
    const flowerPotRecordsList = await recordDao.selectFlowerPotRecords(connection, flowerPotIdx);
    connection.release();
    // Records 없을 때
    if(flowerPotRecordsList.length < 1){
        return errResponse(baseResponse.FLOWERPOT_NO_RECORDS);
    }
    return response(baseResponse.SUCCESS, flowerPotRecordsList);
}