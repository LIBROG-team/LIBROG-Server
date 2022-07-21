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

/**
 * API No. 2.35
 * API Name: 책 인덱스 조회 API
 */
exports.readBookIdx = async function(bookName){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookList = await recordDao.selectBookIdx(connection, bookName);
    connection.release();
    return response(baseResponse.SUCCESS, readBookList);
}

/**
 * API No. 2.6
 * API Name: 유저 독서 기록 통계 조회 API
 * [GET] /records/statistics/:userIdx
 */
exports.readStatistics = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserRows = await recordDao.checkUserIdx(connection, userIdx);
    // console.log('checkUserRows', checkUserRows);
    // user validation
    if(checkUserRows.length < 1){
        connection.release();
        return errResponse(baseResponse.USER_NOT_EXIST);
    }else if(checkUserRows[0].status == 'INACTIVE'){
        connection.release();
        return errResponse(baseResponse.USER_INACTIVE_USER);
    }else if(checkUserRows[0].status == 'DELETED'){
        connection.release();
        return errResponse(baseResponse.USER_DELETED_USER);
    }
    const statisticsRows = await recordDao.selectStatistics(connection, userIdx);
    // console.log('statisticsRows', statisticsRows);
    connection.release();
    return response(baseResponse.SUCCESS, statisticsRows[0]);
}

// DB 조회 API

exports.readBookDB = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookDBList = await recordDao.selectBookDB(connection);
    return response(baseResponse.SUCCESS, readBookDBList);
}
exports.readBookImgUrlDB = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookImgUrlDBList = await recordDao.selectBookImgUrlDB(connection);
    return response(baseResponse.SUCCESS, readBookImgUrlDBList);
}
exports.readFlowerData = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFlowerDataList = await recordDao.selectFlowerData(connection);
    return response(baseResponse.SUCCESS, readFlowerDataList);
}
exports.readFlowerPot = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFlowerPotList = await recordDao.selectFlowerPot(connection);
    return response(baseResponse.SUCCESS, readFlowerPotList);
}
exports.readFollow = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFollowList = await recordDao.selectFollow(connection);
    return response(baseResponse.SUCCESS, readFollowList);
}
exports.readReadingRecord = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readReadingRecordList = await recordDao.selectReadingRecord(connection);
    return response(baseResponse.SUCCESS, readReadingRecordList);
}
exports.readUser = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readUserList = await recordDao.selectUser(connection);
    return response(baseResponse.SUCCESS, readUserList);
}
exports.UserFlowerList = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const UserFlowerListList = await recordDao.selectBookDB(connection);
    return response(baseResponse.SUCCESS, UserFlowerListList);
}