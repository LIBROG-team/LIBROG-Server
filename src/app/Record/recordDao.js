// 유저 조회 api
async function checkUserIdx(connection, userIdx){
    const checkUserIdxQuery = `
        SELECT u.idx, u.email, u.status
        FROM User u
        WHERE idx = ?;
    `;
    const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
    return checkUserRows;
}
// 2.2 -> 유저 가지고 있는 화분 조회 API
async function checkFlowerPot(connection, flowerPotIdx){
    const checkFlowerPotQuery = `
        SELECT idx, f.status
        FROM FlowerPot f
        WHERE idx = ? AND f.status = 'ACTIVE';
    `;
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, flowerPotIdx);
    return checkFlowerPotRows;
}
// message 마지막 idx 조회 query
async function checkMessageEndNum(connection){
    const messageLNumCheckQuery = `
        SELECT count(idx) as cnt
        FROM Message;
    `;
    const [endNumRows] = await connection.query(messageLNumCheckQuery);
    return endNumRows;
}

/**
 * API Name: 책 인덱스 조회 API
 */
 async function selectBookIdx(connection, bookName){
    const selectBookIdxQuery = `
        SELECT idx, name
        FROM Book
        WHERE name = ?;
    `;
    const [selectBookIdxRows] = await connection.query(selectBookIdxQuery, bookName);
    return selectBookIdxRows;
}

async function checkRecentFlowerPot(connection, userIdx){
    // 0725 유저 최근 화분 조회 쿼리
    /**
     * 1. status == 'ACTIVE'이고
     * 2. 아직 화분 채우고 있는 상태(maxExp > exp)이고
     * 3. 그중 가장 exp percentage를 많이 채운 순으로(내림차순 정렬) 화분 선택
     */
    const checkFlowerPotQuery = `
        SELECT FlowerPot.idx FlowerPotIdx, flowerDataIdx, maxExp, exp, IF(exp > 0, (exp / maxExp * 100), 0) as percentage
        FROM FlowerPot
            LEFT JOIN (
                SELECT maxExp, idx
                FROM FlowerData) data
            on data.idx = FlowerPot.flowerDataIdx
        WHERE status = 'ACTIVE' AND maxExp > exp AND userIdx = ?
        ORDER BY percentage DESC;
    `;
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, userIdx);
    return checkFlowerPotRows;
}
// 독서기록 조회 api
async function checkRecords(connection, recordsIdx){
    const checkRecordsQuery = `
        SELECT idx, status, flowerPotIdx
        FROM ReadingRecord
        WHERE idx = ?;
    `;
    const [checkRecordsRows] = await connection.query(checkRecordsQuery, recordsIdx);
    return checkRecordsRows;
}
/**
 * API No. 2.1
 * API Name: 유저 독서기록 조회 API
 * [GET] /records/user/:userIdx
 */
async function selectUserRecords(connection, userIdx){
    const selectUserFlowerPotQuery = `
        SELECT r.idx readingRecordIdx, r.bookIdx, r.flowerPotIdx, r.date, IF(r.starRating is null, 0, r.starRating) starRating, r.status, b.name, b.bookImgUrl
        FROM ReadingRecord r
            LEFT JOIN (
                SELECT idx, bookImgUrl, name
                FROM Book
            ) b on b.idx = r.bookIdx
            LEFT JOIN(
                SELECT idx, userIdx
                FROM FlowerPot
            ) f on f.idx = r.flowerPotIdx
        WHERE f.userIdx = ? AND r.status = 'ACTIVE'
        LIMIT 1000;
        `;
    const [userRecordRows] = await connection.query(selectUserFlowerPotQuery, userIdx);
    return userRecordRows;
}

/**
 * API No. 2.2
 * API Name: 화분별 독서 기록 조회 API
 * [GET] /records/:flowerPotIdx
 */
async function selectFlowerPotRecords(connection, flowerPotIdx){
    const selectFlowerPotRecordsQuery = `
        SELECT r.idx readingRecordIdx, r.bookIdx, r.flowerPotIdx, r.date, r.starRating, r.status, B.bookImgUrl
        FROM ReadingRecord r
            LEFT JOIN Book B
            on B.idx = r.bookIdx
        WHERE flowerPotIdx = ? AND r.status='ACTIVE'
        LIMIT 1000;
        `;
    const [selectFlowerPotRecordsRows] = await connection.query(selectFlowerPotRecordsQuery, flowerPotIdx);
    return selectFlowerPotRecordsRows;
}

/**
 * API No.2.3
 * API Name: 독서 기록 추가 API
 * [POST] /records/addition
 */
async function insertRecords(connection, createRecordsParams){
    const insertRecordsQuery = `
        INSERT INTO ReadingRecord
        (bookIdx, starRating, quote, content, flowerPotIdx, date)
        VALUES (?, ?, ?, ?, ?, now());
    `;
    const [insertRecordsRows] = await connection.query(insertRecordsQuery, createRecordsParams);
    return insertRecordsRows;
}


// 2.31 책 추가 API
async function insertBookIdx(connection, createBookParams){
    const insertBookIdxQuery = `
    INSERT INTO Book
    (name, author, publisher, publishedDate, bookInstruction, bookImgUrl)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [insertBookIdx] = await connection.query(insertBookIdxQuery, createBookParams);
    return insertBookIdx;
}
// 2.32 화분 최근기록 업데이트 API
async function updateFlowerpotDate(connection, flowerpotIdx){
    const updateFPDateQuery = `
        UPDATE FlowerPot
        SET updatedAt = now()
        WHERE idx = ?;
    `;
    const [updateFPDateRows] = await connection.query(updateFPDateQuery, flowerpotIdx);
    return updateFPDateQuery;
}

/**
 * API No. 2.4
 * API Name: 독서 기록 수정 API
 * [PATCH] /records/fix
 */
async function updateRecords(connection, patchRecordsParams){
    const updateRecordsQuery = `
        UPDATE ReadingRecord
        SET starRating = ?, quote = ?, content = ?
        WHERE idx = ?;
    `;
    const [updateRecordsRows] = await connection.query(updateRecordsQuery, patchRecordsParams);
    return updateRecordsRows;
}
/**
 * API No. 2.5
 * API Name: 독서 기록 삭제 API
 * [PATCH] /records/removal
 */
async function deleteRecords(connection, recordIdx){
    const deleteRecordsQuery = `
        DELETE FROM ReadingRecord WHERE idx = ?;
    `;
    const [deleteRecordsRows] = await connection.query(deleteRecordsQuery, recordIdx);
    return deleteRecordsRows;
}

/**
 * API No. 2.6
 * API Name: 유저 독서 기록 통계 조회 API
 * [GET] /records/statistics/:userIdx
 */
async function selectStatistics(connection, userIdx){
    const selectStatisticsQuery = `
        SELECT f.userIdx, COUNT(f.idx) flowerCnt, COUNT(r.idx) readingCnt,
        COUNT(starRating) starRatingCnt, COUNT(quote) quoteCnt, COUNT(content) contentCnt
        FROM FlowerPot f
        LEFT JOIN ReadingRecord r ON r.flowerPotIdx = f.idx
        WHERE f.userIdx = ?;
    `;
    const [selectStatisticsRows] = await connection.query(selectStatisticsQuery, userIdx);
    return selectStatisticsRows;
}

async function selectFlowerCnt(connection, userIdx){
    const flowerCntQuery = `
        SELECT COUNT(idx) flowerCnt
        FROM FlowerPot
        WHERE userIdx = ?;
    `;
    const [flowerCntRows] = await connection.query(flowerCntQuery, userIdx);
    return flowerCntRows;
}

/**
 * API No. 2.7
 * API Name: 유저별 최근 읽은 책 조회 API
 * [GET] /records/bookRecords/:userIdx
 */
async function selectRecentBookRecords(connection, userIdx){
    const selectRecentBookRecordsQuery = `
        SELECT u.idx as userIdx, rr.idx as readingRecordIdx, B.name as bookName, B.author, B.publishedDate, B.bookImgUrl, rr.createdAt as recordedDate
        FROM ReadingRecord rr
        LEFT JOIN Book B on B.idx = rr.bookIdx
        LEFT JOIN FlowerPot FP on rr.flowerPotIdx = FP.idx
        LEFT JOIN User u on FP.userIdx = u.idx
        WHERE u.idx = ? AND rr.status = 'ACTIVE'
        ORDER BY rr.idx DESC
        LIMIT 50;
    `;
    const [selectRecentBookRecordsRows] = await connection.query(selectRecentBookRecordsQuery, userIdx);
    return selectRecentBookRecordsRows;
}

/**
 * API No. 2.8
 * API Name: 독서기록 상세조회 API
 * [GET] /records/:readingRecordIdx
 */
async function selectReadingRecord(connection, readingRecordIdx){
    const selectReadingRecordQuery = `
        SELECT rr.idx as readingRecordIdx, B.bookImgUrl, B.name, B.author, B.bookInstruction, starRating, quote, content, exp
        FROM ReadingRecord rr
        LEFT JOIN Book B on B.idx = rr.bookIdx
        WHERE rr.idx = ? AND rr.status = 'ACTIVE';
    `;
    const [selectReadingRecordRows] = await connection.query(selectReadingRecordQuery, readingRecordIdx);
    return selectReadingRecordRows;
}

/**
 * API No. 2.9
 * API Name: 유저 전체 독서기록 필터 (최근 순) api
 * [GET] /records/readingRecord/filter/recent/:userIdx
 */
async function selectFilterRecent(connection, userIdx){
    const selectFilterRecentQuery = `
    SELECT r.idx readingRecordIdx, r.bookIdx, r.flowerPotIdx, r.date, r.starRating, r.status, b.name, b.bookImgUrl, r.createdAt
    FROM ReadingRecord r
        LEFT JOIN (
            SELECT idx, bookImgUrl, name
            FROM Book
        ) b on b.idx = r.bookIdx
        LEFT JOIN(
            SELECT idx, userIdx
            FROM FlowerPot
        ) f on f.idx = r.flowerPotIdx
    WHERE f.userIdx = ? AND r.status = 'ACTIVE'

    ORDER BY createdAt DESC
    LIMIT 1000;
    `;
    const [selectFilterRecentRows] = await connection.query(selectFilterRecentQuery, userIdx);
    return selectFilterRecentRows;
}

/**
 * API No. 2.10
 * API Name: 유저 전체 독서기록 필터 (별점 순) api
 * [GET] /records/readingRecord/filter/rating/:userIdx
 */
 async function selectFilterRating(connection, userIdx){
    const selectFilterRatingQuery = `
    SELECT r.idx readingRecordIdx, r.bookIdx, r.flowerPotIdx, r.date, r.starRating, r.status, b.name, b.bookImgUrl
    FROM ReadingRecord r
        LEFT JOIN (
            SELECT idx, bookImgUrl, name
            FROM Book
        ) b on b.idx = r.bookIdx
        LEFT JOIN(
            SELECT idx, userIdx
            FROM FlowerPot
        ) f on f.idx = r.flowerPotIdx
    WHERE f.userIdx = ? AND r.status = 'ACTIVE'
    ORDER BY starRating DESC
    LIMIT 1000;
    `;
    const [selectFilterRatingRows] = await connection.query(selectFilterRatingQuery, userIdx);
    return selectFilterRatingRows;
}


/**
 * API No. 2.11
 * API Name: 전체 독서기록 필터 (제목 순) api
 * [GET] /records/readingRecord/filter/title/:userIdx
 */
 async function selectFilterTitle(connection, userIdx){
    const selectFilterTitleQuery = `
        SELECT r.idx readingRecordIdx, r.bookIdx, r.flowerPotIdx, r.date, r.starRating, r.status, b.name, b.bookImgUrl
        FROM ReadingRecord r
            LEFT JOIN (
                SELECT idx, bookImgUrl, name
                FROM Book
            ) b on b.idx = r.bookIdx
            LEFT JOIN(
                SELECT idx, userIdx
                FROM FlowerPot
            ) f on f.idx = r.flowerPotIdx
        WHERE f.userIdx = ? AND r.status = 'ACTIVE'
        ORDER BY name
        LIMIT 1000;
    `;
    const [selectFilterTitleRows] = await connection.query(selectFilterTitleQuery, userIdx);
    return selectFilterTitleRows;
}

/**
 * API No. 2.12
 * API Name: 메인화면 문구, 독서일자 조회 api
 * [GET] /records/mainpage/:userIdx
 */
async function selectMPInfo(connection, msgIdx, userIdx){
    const mpInfoQuery = `
        SELECT TIMESTAMPDIFF(DAY, 
            DATE_FORMAT(createdAt, '%Y-%m-%d'), 
            DATE_FORMAT(updatedAt, '%Y-%m-%d')) + 1 as daycnt, cmt.content
        FROM FlowerPot
        LEFT JOIN(
            SELECT *
            FROM Message
        ) cmt on cmt.idx = ?
        WHERE userIdx = ?
        ORDER BY createdAt DESC
        LIMIT 1;
    `;
    const [selectMPInfoRows] = await connection.query(mpInfoQuery, [msgIdx, userIdx]);
    return selectMPInfoRows;
}

// 독서기록 exp 재설정 함수
// async function updateAllFlowerPotsExp(connection){
//     const selectAllFPExpQuery = `
//         SELECT idx
//         FROM FlowerPot
//         ORDER BY idx ASC;
//     `;
//     // # 최초 1번만 해주고 나머지는 WHERE status = 'ACTIVE' 쿼리 필요
//     const [flowerpotsRows] = await connection.query(selectAllFPExpQuery);
//     console.log(flowerpotsRows);
//     let flowerpotInfo;  // 각 화분 정보 저장

//     flowerpotsRows.forEach(async ele => {
        
//         flowerpotInfo = await selectFlowerPotRecords(connection, ele.idx);  // 모든 화분 리스트 넣고 돌림
//         // console.log(flowerpotInfo);
//         // console.log('ele', ele);
//         if(flowerpotInfo.length > 0){   // 화분 1개당 독서기록 구함
//             flowerpotInfo = flowerpotInfo[0];
//             // console.log(ele.idx);
//             // console.log('flowerpotInfo', flowerpotInfo);
//             let recordIdx = flowerpotInfo.readingRecordIdx;
//             let [recordInfo] = await selectReadingRecord(connection, recordIdx);

//             // exp 설정
//             let {starRating, quote, content} = recordInfo;
//             let exp = 0;
//             if(starRating !== null)
//                 exp += 500;
//             if(quote !== null)
//                 exp += 1500;
//             if(content !== null)
//                 exp += 3000;
            
//             // console.log('recordInfo', recordInfo);

//         } 
//     });
//     return flowerpotsRows;
// }

// postExp에는 수정하는 exp값을 입력
async function updateReadingRecordExp(connection, postExp, recordIdx){
    const updateQuery = `
        UPDATE ReadingRecord SET exp = ? WHERE idx = ?;
    `;
    const [updateRRExpRows] = await connection.query(updateQuery, [postExp, recordIdx]);
    return updateRRExpRows;
}

// 화분 exp 재설정 함수
// expChangeValue에는 바꿀 값을 입력
async function updateFlowerpotExp(connection, expChangeValue, flowerPotIdx){
    const updateExpQuery = `
        UPDATE FlowerPot SET exp = exp + ? WHERE idx = ?;
    `;
    const [updateFlowerpotExpRows] = await connection.query(updateExpQuery, [expChangeValue, flowerPotIdx]);
    return updateFlowerpotExpRows;
}

// DB 조회 api
// Book table
async function selectBookDB(connection){
    const selectBookDBQuery = `
        SELECT *
        FROM Book;
    `;
    const [selectBookDBRows] = await connection.query(selectBookDBQuery);
    return selectBookDBRows;
}

// FlowerData table
async function selectFlowerDataDB(connection){
    const selectFlowerDataDBQuery = `
        SELECT *
        FROM FlowerData;
    `;
    const [selectFlowerDataRows] = await connection.query(selectFlowerDataDBQuery);
    return selectFlowerDataRows;
}
// FlowerPot table
async function selectFlowerPotDB(connection){
    const selectFlowerPotDBQuery = `
        SELECT *
        FROM FlowerPot;
    `;
    const [selectFlowerPotRows] = await connection.query(selectFlowerPotDBQuery);
    return selectFlowerPotRows;
}
// Follow table
async function selectFollowDB(connection){
    const selectFollowDBQuery = `
        SELECT *
        FROM Follow;
    `;
    const [selectFollowRows] = await connection.query(selectFollowDBQuery);
    return selectFollowRows;
}
// ReadingRecord table
async function selectReadingRecordDB(connection){
    const selectReadingRecordDBQuery = `
        SELECT *
        FROM ReadingRecord;
    `;
    const [selectReadingRecordRows] = await connection.query(selectReadingRecordDBQuery);
    return selectReadingRecordRows;
}
// User table
async function selectUserDB(connection){
    const selectUserDBQuery = `
        SELECT *
        FROM User;
    `;
    const [selectUserRows] = await connection.query(selectUserDBQuery);
    return selectUserRows;
}
// UserFlowerList table
async function selectUserFlowerListDB(connection){
    const selectUserFlowerListDBQuery = `
        SELECT *
        FROM UserFlowerList;
    `;
    const [selectUserFlowerListRows] = await connection.query(selectUserFlowerListDBQuery);
    return selectUserFlowerListRows;
}


module.exports = {
    checkUserIdx,
    checkFlowerPot,
    checkRecentFlowerPot,
    checkMessageEndNum,
    checkRecords,
    selectUserRecords,
    selectFlowerPotRecords,
    insertRecords,
    selectBookIdx,
    insertBookIdx,
    updateFlowerpotDate,    // 2.32
    // insertBookAuthor,

    updateRecords,
    deleteRecords,
    selectStatistics,
    selectFlowerCnt,
    selectRecentBookRecords,
    selectReadingRecord,

    selectFilterRecent,
    selectFilterRating,
    selectFilterTitle,

    selectMPInfo,

    updateFlowerpotExp,
    updateReadingRecordExp,
    // updateAllFlowerPotsExp,
    
    selectBookDB,
    // selectBookAuthorDB,
    // selectBookImgUrlDB,
    selectFlowerDataDB,
    selectFlowerPotDB,
    selectFollowDB,
    selectReadingRecordDB,
    selectUserDB,
    selectUserFlowerListDB
}