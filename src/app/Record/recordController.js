const baseResponse = require("../../../config/baseResponseStatus")
const recordProvider = require('./recordProvider');
const recordService = require('./recordService');
const {response, errResponse} = require("../../../config/response");
const { logger } = require("../../../config/winston");
/**
 * API No. 0.1
 * API Name: Test API
 * [GET] /app/test
 */
exports.getTest = async function(req, res){
    return res.send(baseResponse.SUCCESS);
}
exports.getConsolelog = async function(req, res){
    logger.info(`${process.env.NODE_ENV} console.log test`);
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
    const {
        bookName, authorArr, publisher, publishedDate, bookInstruction, 
        bookImgUrl, userIdx, starRating, quote, content} = req.body;
    // 작가 배열은 따로 저장, ','로 구분해서 문자열로 저장!
    const authorString = authorArr.toString();
    
    // validation
    if(!bookName){
        return res.send(errResponse(baseResponse.RECORDS_BOOKNAME_EMPTY));
    }else if(bookName.length > 100){
        return res.send(errResponse(baseResponse.RECORDS_BOOKNAME_LENGTH));
    }
    // 저자 arr 요소 하나씩 validation
    authorArr.forEach((author) => {
        if(author.length > 45){
            return res.send(errResponse(baseResponse.RECORDS_AUTHOR_LENGTH));
        }
    });
    
    if(publisher && publisher.length > 45){
        return res.send(errResponse(baseResponse.RECORDS_PUBLISHER_LENGTH));
    }else if(publishedDate.length > 45){
        return res.send(errResponse(baseResponse.RECORDS_PUBLISHED_DATE_LENGTH));
    }else if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }else if(quote && quote.length > 1000){
        return res.send(errResponse(baseResponse.RECORDS_QUOTE_LENGTH));
    }else if(content && content.length > 10000){
        return res.send(errResponse(baseResponse.RECORDS_CONTENT_LENGTH));
    }
    // starRating - 0~5 사이의 값인지만 validation
    if(starRating < 0 || starRating > 5){
        return res.send(errResponse(baseResponse.RECORDS_RATING_LENGTH));
    }

    // 일단 bookName으로 bookIdx 존재하는지 검색
    let bookIdxResult = await recordProvider.readBookIdx(bookName);
    
    let bookIdx;
    
    // Book table에 책 존재하는 경우 -> idx 받아옴
    if(bookIdxResult.result.length > 0){
        bookIdx = bookIdxResult.result[0].idx;
        // console.log('exist', bookIdxResult);
    }else{
        // Book table에 책 존재하지 않는 경우 -> 책 새로 추가하기
        const createBookParams = [bookName, authorString, publisher, publishedDate, bookInstruction, bookImgUrl];
        bookIdxResult = await recordService.createBook(createBookParams);
        bookIdx = bookIdxResult.result.insertId;
    }
    const createRecordsParams = [bookIdx, starRating, quote, content];
    const postRecordsResult = await recordService.createRecords(createRecordsParams, userIdx);
    return res.send(postRecordsResult);
}
/** 더미 데이터
{
    "bookName":"책4",
    "authorArr":["자저자", "차저자"],
    "publisher":"한국출판사", 
    "publishedDate":"2022-07-27",
    "bookInstruction":"책설명",
    "bookImgUrl":"bookimg.url", 
    "userIdx":2,
    "starRating":4,
    "quote":"한줄평", 
    "content":"독서 기록 내용"
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
    }else if(!idx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(idx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_RECORDSIDX_LENGTH));
    }else if(quote && quote.length > 1000){
        return res.send(errResponse(baseResponse.RECORDS_QUOTE_LENGTH));
    }else if(content && content.length > 10000){
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
    if(!recordsIdx){
        return res.send(errResponse(baseResponse.RECORDS_RECORDSIDX_EMPTY));
    }else if(recordsIdx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_RECORDSIDX_LENGTH));
    }
    const deleteRecordsResult = await recordService.removeRecords(recordsIdx);
    return res.send(deleteRecordsResult);
}
/** 더미데이터
{
    "recordsIdx":2
}
 */

/**
 * API No. 2.6
 * API Name: 유저 독서 기록 통계 조회 API
 * [GET] /records/statistics/:userIdx
 */
exports.getStatistics = async function(req, res){
    const userIdx = req.params.userIdx;
    // validation
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    const getStatisticsResult = await recordProvider.readStatistics(userIdx);
    return res.send(getStatisticsResult);
}
/**
 * API No. 2.7
 * API Name: 유저별 최근 읽은 책 조회 API
 * [GET] /records/bookRecords/:userIdx
 */
exports.getRecentBookRecords = async function(req, res){
    const userIdx = req.params.userIdx;
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    const getRecentBookRecordsResult = await recordProvider.readRecentBookRecords(userIdx);
    return res.send(getRecentBookRecordsResult);
}

/**
 * API No. 2.8
 * API Name: 독서기록 상세조회 API
 * [GET] /records/:readingRecordIdx
 */
exports.getReadingRecord = async function(req, res){
    const readingRecordIdx = req.params.readingRecordIdx;
    if(!readingRecordIdx){
        return res.send(errResponse(baseResponse.RECORDS_READING_RECORD_EMPTY));
    }else if(readingRecordIdx <= 0){
        return res.send(errResponse(baseResponse.RECORDS_READING_RECORD_LENGTH));
    }
    const getReadingRecordResult = await recordProvider.retriveReadingRecord(readingRecordIdx);
    return res.send(getReadingRecordResult);
}

// DB 조회 쿼리
exports.getBookDB = async function(req, res){
    const getBookDBResult = await recordProvider.readBookDB();
    return res.send(getBookDBResult);
}
exports.getBookImgUrlDB = async function(req, res){
    const getBookImgUrlDBResult = await recordProvider.readBookImgUrlDB();
    return res.send(getBookImgUrlDBResult);
}
exports.getFlowerDataDB = async function(req, res){
    const getFlowerDataDBResult = await recordProvider.readFlowerDataDB();
    return res.send(getFlowerDataDBResult);
}
exports.getFlowerPotDB = async function(req, res){
    const getFlowerPotDBResult = await recordProvider.readFlowerPotDB();
    return res.send(getFlowerPotDBResult);
}
exports.getFollowDB = async function(req, res){
    const getFollowDBResult = await recordProvider.readFollowDB();
    return res.send(getFollowDBResult);
}
exports.getReadingRecordDB = async function(req, res){
    const getReadingRecordDBResult = await recordProvider.readReadingRecordDB();
    return res.send(getReadingRecordDBResult);
}
exports.getUserDB = async function(req, res){
    const getUserDBResult = await recordProvider.readUserDB();
    return res.send(getUserDBResult);
}
exports.getUserFlowerListDB = async function(req, res){
    const getUserFlowerListDBResult = await recordProvider.readUserFlowerListDB();
    return res.send(getUserFlowerListDBResult);
}