const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {connect} = require("http2");
// const recordProvider = require("./recordProvider");
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
exports.createRecords = async function(createRecordsParams, userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        // 트랜젝션 처리
        await connection.beginTransaction();
        // bookIdx DB에 있는지 check? -> db에 있는것만 검색 api에서 주니까 pass
        // flowerPotIdx만 check -> 0725 최근 화분으로 고정.
        const flowerPotCheckResult = await recordDao.checkRecentFlowerPot(connection, userIdx);
        // 유저가 키우는 화분 없을때
        if(flowerPotCheckResult.length < 1){
            return errResponse(baseResponse.USER_NO_AVAILABLE_FLOWERPOTS);
        }
        
        // 화분 인덱스 저장 -> 가장 최근의 exp값 제일 높은 화분으로
        const flowerPotIdx = flowerPotCheckResult[0].FlowerPotIdx;
        createRecordsParams.push(flowerPotIdx);
        const createRecordsList = await recordDao.insertRecords(connection, createRecordsParams);
        
        // 추가된 recordIdx에 exp 재산정해주는 코드
        const recordIdx = createRecordsList.insertId;
        rewriteExp(connection, recordIdx, flowerPotIdx, 0);

        //경험치에 따라 화분data 변경 해주는 코드



        // 화분에 updatedAt refresh 해주는 코드
        const updateFPDateResult = await recordDao.updateFlowerpotDate(connection, flowerPotIdx);
        // transaction 커밋
        await connection.commit();
        return response(baseResponse.SUCCESS, {'createdRecordId':createRecordsList.insertId});
    }catch(err){
        logger.error(`App - createRecords Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

/**
 * API No. 2.31
 * API Name: 책 추가 API
 */
exports.createBook = async function(createBookParams){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        await connection.beginTransaction();
        const createBookList = await recordDao.insertBookIdx(connection, createBookParams);
        await connection.commit();
        return response(baseResponse.SUCCESS, createBookList);
    }catch(err){
        logger.error(`App - createBook Service error\n: ${err.message}`);
        await connection.rollback();
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
    const recordIdx = patchRecordsParams[3];
    try{
        await connection.beginTransaction();
        // validation - records 삭제되고 없을때
        const checkRecordsList = await recordDao.checkRecords(connection, patchRecordsParams[3]);
        if(checkRecordsList.length < 1 || checkRecordsList[0].status === 'DELETED'){
            connection.release();
            return errResponse(baseResponse.RECORDS_NO_RECORDS);
        }
        const editRecordsList = await recordDao.updateRecords(connection, patchRecordsParams);
        
        // 수정된 recordIdx에 exp 재산정해주는 코드
        const [checkRecordsRows] = await recordDao.checkRecords(connection, recordIdx);
        const flowerPotIdx = checkRecordsRows.flowerPotIdx;
        rewriteExp(connection, recordIdx, flowerPotIdx, 0);
        
        // 결과 return
        await connection.commit();
        return response(baseResponse.SUCCESS, editRecordsList);
    }catch(err){
        logger.error(`App - editRecords Service error\n: ${err.message}`);
        await connection.rollback();
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
        await connection.beginTransaction();
        // validation - records 삭제되고 없을때
        const checkRecordsList = await recordDao.checkRecords(connection, recordsIdx);
        if(checkRecordsList.length < 1 || checkRecordsList[0].status === 'DELETED'){
            connection.release();
            return errResponse(baseResponse.RECORDS_NO_RECORDS);
        }
        // 삭제될 recordIdx에 exp 재산정해주는 코드
        const flowerPotIdx = checkRecordsList[0].flowerPotIdx;
        rewriteExp(connection, recordsIdx, flowerPotIdx, 1);
        // readingRecord 삭제
        const removeRecordsList = await recordDao.deleteRecords(connection, recordsIdx);
        await connection.commit();
        return response(baseResponse.SUCCESS, removeRecordsList);
    }catch(err){
        logger.error(`App - removeRecords Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}

// exp 재산정해서 화분이랑 독서기록에 반영해주는 함수
async function rewriteExp(connection, recordIdx, flowerPotIdx, ifDel) {
    // const recordIdx = 87;
    const [readingRecordStatus] = await recordDao.selectReadingRecord(connection, recordIdx);
    const {starRating, quote, content, exp} = readingRecordStatus;
    
    let postExp = 0;
    if(!ifDel){ // 지우지 않을때만. 지울때는 postExp == 0으로 산정 -> ReadingRecord, FlowerPot table에 반영.
        if(starRating !== null){
            postExp += 500;
        }
        if(quote !== null){
            postExp += 1500;
        }
        if(content !== null){
            postExp += 3000;
        }
    }

    // 화분 및 독서기록 exp 재산정해주는 코드
    const rewtireRRExpResult = await recordDao.updateReadingRecordExp(connection, postExp, recordIdx);
    const rewriteExpResult = await recordDao.updateFlowerpotExp(connection, postExp - exp, flowerPotIdx);
    return;
}