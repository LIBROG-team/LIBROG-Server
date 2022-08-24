const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { response, errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const recordDao = require("./recordDao");
/**
 * API No.2.1
 * API Name: �쑀���蹂� �룆�꽌 湲곕줉 議고쉶 API
 * [GET] /records/user/:userIdx
 */
exports.readUserRecords = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserIdxRows = await recordDao.checkUserIdx(connection, userIdx);
    // �쑀��� �뾾�뒗吏�
    if(checkUserIdxRows.length < 1){
        connection.release();
        return errResponse(baseResponse.USER_NOT_EXIST);
    }
    // �룆�꽌湲곕줉 諛쏆븘�삤�뒗 遺�遺�, �쑀��� �룆�꽌湲곕줉 �뾾�쓣�븣 泥섎━
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
 * API Name: �솕遺꾨퀎 �룆�꽌 湲곕줉 議고쉶 API
 * [GET] /records/flowerpot/:flowerPotIdx
 */
exports.readFlowerPotRecords = async function(flowerPotIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    // flowerpot �뾾�쓣�븣
    const checkFlowerPotRows = await recordDao.checkFlowerPot(connection, flowerPotIdx);
    if(checkFlowerPotRows.length < 1){
        connection.release();
        return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
    }
    const flowerPotRecordsList = await recordDao.selectFlowerPotRecords(connection, flowerPotIdx);
    connection.release();
    // Records �뾾�쓣 �븣
    if(flowerPotRecordsList.length < 1){
        return errResponse(baseResponse.FLOWERPOT_NO_RECORDS);
    }
    return response(baseResponse.SUCCESS, flowerPotRecordsList);
}

/**
 * API No. 2.35
 * API Name: 梨� �씤�뜳�뒪 議고쉶 API
 */
exports.readBookIdx = async function(bookName){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookList = await recordDao.selectBookIdx(connection, bookName);
    connection.release();
    return response(baseResponse.SUCCESS, readBookList);
}

/**
 * API No. 2.6
 * API Name: 독서기록 통계 조회 API
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
    let [statisticsRows] = await recordDao.selectStatistics(connection, userIdx);
    const [flowerCntRows] = await recordDao.selectFlowerCnt(connection, userIdx);
    statisticsRows.flowerCnt = flowerCntRows.flowerCnt;
    // console.log('statisticsRows', statisticsRows, flowerCntRows);
    connection.release();
    return response(baseResponse.SUCCESS, statisticsRows);
}
/**
 * API No. 2.7
 * API Name: 최근 읽은 책 조회 API
 * [GET] /records/bookRecords/:userIdx
 */
exports.readRecentBookRecords = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const checkUserResult = await recordDao.checkUserIdx(connection, userIdx);
    // console.log(checkUserResult);
    if(checkUserResult.length < 1){
        return errResponse(baseResponse.USER_NOT_EXIST);
    }else if(checkUserResult[0].status === "INACTIVE"){
        return errResponse(baseResponse.USER_INACTIVE_USER);
    }else if(checkUserResult[0].status === "DELETED"){
        return errResponse(baseResponse.USER_DELETED_USER);
    }
    const readRecentBookRecordsResults = await recordDao.selectRecentBookRecords(connection, userIdx);
    // �옉媛� null媛믪씠 �븘�땲硫� split �빐以�. null�씠硫� []�쑝濡� 蹂대궡�뒗 遺�遺� 異붽��.
    readRecentBookRecordsResults.forEach((ele) => {
        if(ele.author){
            ele.author = ele.author.split(',');
        }else{
            ele.author = [];
        }
    });
    connection.release();
    return response(baseResponse.SUCCESS, readRecentBookRecordsResults);
}
/**
 * API No. 2.8
 * API Name: 독서기록 상세조회 API
 * [GET] /records/:readingRecordIdx
 */
exports.retriveReadingRecord = async function(readingRecordIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    const retriveReadingRecordList = await recordDao.selectReadingRecord(connection, readingRecordIdx);
    if(retriveReadingRecordList.length < 1){
        return errResponse(baseResponse.RECORDS_NO_RECORDS);
    }
    // let authorArr = retriveReadingRecordList[0].author;
    // ����옄 諛곗뿴 ,濡� 遺꾨━
    try{
        if(retriveReadingRecordList[0].author){
            retriveReadingRecordList[0].author = retriveReadingRecordList[0].author.split(',');
        }else{
            retriveReadingRecordList[0].author = [];
        }
    }catch(err){
        logger.error(`App - retriveReadingRecord Provider error\n: ${err.message}`);
        return errResponse(baseResponse.RECORDS_NO_AUTHOR);
    }finally{
        connection.release();
    }
    return response(baseResponse.SUCCESS, retriveReadingRecordList[0]);
}


/**
 * API No. 2.9
 * API Name: 유저 전체 독서기록 필터 (최근 순) api
 * [GET] /records/readingRecord/filter/recent/:userIdx
 */

exports.retriveFilterRecent = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const retriveFilterRecent = await recordDao.selectFilterRecent(connection, userIdx);
    
    try{
        if(retriveFilterRecent.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NO_RECORDS);
        }
    }catch(err){
        logger.error(`App - retriveReadingRecord Provider error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
    
    return response(baseResponse.SUCCESS, retriveFilterRecent);
}

/**
 * API No. 2.10
 * API Name: 유저 전체 독서기록 필터 (별점 순) api
 * [GET] /records/readingRecord/filter/rating/:userIdx
 */
 exports.retriveFilterRating = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const retriveFilterRating = await recordDao.selectFilterRating(connection, userIdx);
    
    try{
        if(retriveFilterRating.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NO_RECORDS);
        }
    }catch(err){
        logger.error(`App - retriveReadingRecord Provider error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

    connection.release();
    return response(baseResponse.SUCCESS, retriveFilterRating);
}

/**
 * API No. 2.11
 * API Name: 유저 전체 독서기록 필터 (제목 순) api
 * [GET] /records/readingRecord/filter/title/:userIdx
 */
 exports.retriveFilterTitle = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const retriveFilterTitle = await recordDao.selectFilterTitle(connection, userIdx);
    
    try{
        if(retriveFilterTitle.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NO_RECORDS);
        }
    }catch(err){
        logger.error(`App - retriveReadingRecord Provider error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

    connection.release();
    return response(baseResponse.SUCCESS, retriveFilterTitle);
}

/**
 * API No. 2.12
 * API Name: 메인화면 문구, 독서일자 조회 api
 * [GET] /records/mainpage/:userIdx
 */
exports.retrieveMainPageInfo = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    
    try{
        const userStatus = await recordDao.checkUserIdx(connection, userIdx);
        // user Validation
        if(userStatus.length < 1){
            return errResponse(baseResponse.USER_NOT_EXIST);
        }else if(userStatus[0].status === 'INACTIVE'){
            return errResponse(baseResponse.USER_INACTIVE_USER);
        }else if(userStatus[0].status === 'DELETED'){
            return errResponse(baseResponse.USER_DELETED_USER);
        }
        // Message 가져오는 query
        const [msgLastIdx] = await recordDao.checkMessageEndNum(connection);    // messages 개수 가져오는 쿼리
        const msgIdx = Math.round(Math.random() * 10) % msgLastIdx.cnt + 1;     // messages 개수로 가져올 msgIdx를 랜덤으로 결정함.
        const [mpResult] = await recordDao.selectMPInfo(connection, msgIdx, userIdx);
        // 유저 화분 없을 시 결과가 나오지 않음 -> validation
        if(!mpResult){
            return errResponse(baseResponse.USER_NO_FLOWERPOTS);
        }
        return response(baseResponse.SUCCESS, mpResult);
    }catch(err){
        logger.error(`App - retrieveMainPageInfo Provider error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

// DB 조회 API

exports.readBookDB = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookDBList = await recordDao.selectBookDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readBookDBList);
}
exports.readBookImgUrlDB = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readBookImgUrlDBList = await recordDao.selectBookImgUrlDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readBookImgUrlDBList);
}
exports.readFlowerData = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFlowerDataList = await recordDao.selectFlowerDataDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readFlowerDataList);
}
exports.readFlowerPot = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFlowerPotList = await recordDao.selectFlowerPotDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readFlowerPotList);
}
exports.readFollow = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readFollowList = await recordDao.selectFollowDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readFollowList);
}
exports.readReadingRecord = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readReadingRecordList = await recordDao.selectReadingRecordDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readReadingRecordList);
}
exports.readUser = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const readUserList = await recordDao.selectUserDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, readUserList);
}
exports.UserFlowerList = async function(){
    const connection = await pool.getConnection(async (conn) => conn);
    const UserFlowerListList = await recordDao.selectBookDB(connection);
    connection.release();
    return response(baseResponse.SUCCESS, UserFlowerListList);
}

// exports.rewriteAllFlowerPotsExp = async function(){
//     const connection = await pool.getConnection(async (conn) => conn);
//     const updateResult = await recordDao.updateAllFlowerPotsExp(connection);
//     return response(baseResponse.SUCCESS, updateResult);
// }