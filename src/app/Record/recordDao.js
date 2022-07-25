async function checkUserIdx(connection, userIdx){
    const checkUserIdxQuery = `
        SELECT u.idx, u.email, u.status
        FROM User u
        WHERE idx = ?;
    `;
    const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
    return checkUserRows;
}

async function checkFlowerPot(connection, flowerPotIdx){
    const checkFlowerPotQuery = `
        SELECT f.idx, f.flowerDataIdx, f.status
        FROM FlowerPot f
        WHERE idx = ?;
    `;
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, flowerPotIdx);
    return checkFlowerPotRows;
}

async function checkRecords(connection, recordsIdx){
    const checkRecordsQuery = `
        SELECT idx, status
        FROM ReadingRecord
        WHERE idx = ?;
    `;
    const [checkRecordsRows] = await connection.query(checkRecordsQuery, recordsIdx);
    return checkRecordsRows;
}
/**
 * API No. 2.1
 * API Name: 유저 독서기록 조회 API
 * [GET] /records/:userIdx
 */
async function selectUserRecords(connection, userIdx){
    const selectUserFlowerPotQuery = `
        SELECT r.idx, r.bookIdx, r.flowerPotIdx, r.userIdx, r.date, r.starRating, r.content, r.quote, r.status, B.imgUrl
        FROM ReadingRecord r
            LEFT JOIN BookImgUrl B
            on r.bookIdx = B.bookIdx
        WHERE r.userIdx = ? AND r.status = 'ACTIVE'
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
        SELECT r.idx, r.bookIdx, r.flowerPotIdx, r.userIdx, r.date, r.starRating, r.content, r.quote, r.status, B.imgUrl
        FROM ReadingRecord r
            LEFT JOIN BookImgUrl B
            on B.bookIdx = r.bookIdx
        WHERE flowerPotIdx = ? AND status='ACTIVE'
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
        (bookIdx, userIdx, flowerPotIdx, starRating, quote, content, date)
        VALUES (?, ?, ?, ?, ?, ?, now());
    `;
    const [insertRecordsRows] = await connection.query(insertRecordsQuery, createRecordsParams);
    return insertRecordsRows;
}

/**
 * API No. 2.35
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

// 책 추가 API
async function insertBookIdx(connection, createBookParams){
    const insertBookIdxQuery = `
        INSERT INTO Book
        (name, author, publisher, publishedDate)
        VALUES (?, ?, ?, ?);
    `;
    const [insertBookIdx] = await connection.query(insertBookIdxQuery, createBookParams);
    return insertBookIdx;
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
    UPDATE ReadingRecord
    SET status = 'DELETED'
    WHERE idx = ?;
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
        SELECT User.idx as userIdx,
        IF(flowerCnt is null, 0, flowerCnt) as flowerCnt,
        IF(readingCnt is null, 0, readingCnt) as readingCnt,
        IF(starRatingCnt is null, 0, starRatingcnt) as starRatingCnt,
        IF(quoteCnt is null, 0, quoteCnt) as quoteCnt,
        IF(contentCnt is null, 0, contentCnt) as contentCnt
        FROM User
        LEFT JOIN (
            SELECT FlowerPot.idx, userIdx, COUNT(FlowerPot.idx) as flowerCnt
            FROM FlowerPot
            WHERE FlowerPot.status = 'ACTIVE'
            GROUP BY userIdx
        ) fp on fp.userIdx = User.idx
        LEFT JOIN(
            SELECT ReadingRecord.idx, userIdx, starRating, quote, content,
                    COUNT(ReadingRecord.idx) as readingCnt,
                    COUNT(starRating) as starRatingCnt,
                    COUNT(quote) as quoteCnt,
                    COUNT(content) as contentCnt
            FROM ReadingRecord
            WHERE ReadingRecord.status = 'ACTIVE'
            GROUP BY userIdx
        ) rr on rr.userIdx = User.idx
        HAVING User.idx = ?;
    `;
    const [selectStatisticsRows] = await connection.query(selectStatisticsQuery, userIdx);
    return selectStatisticsRows;
}
// DB 전체 return 하는 API
// Book table
async function selectBookDB(connection){
    const selectBookDBQuery = `
        SELECT *
        FROM Book;
    `;
    const [selectBookDBRows] = await connection.query(selectBookDBQuery);
    return selectBookDBRows;
}
// BookImgUrl table
async function selectBookImgUrlDB(connection){
    const selectBookImgUrlDBQuery = `
        SELECT *
        FROM BookImgUrl;
    `;
    const [selectBookImgUrlRows] = await connection.query(selectBookImgUrlDBQuery);
    return selectBookImgUrlRows;
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
    checkRecords,
    selectUserRecords,
    selectFlowerPotRecords,
    insertRecords,
    selectBookIdx,
    insertBookIdx,

    updateRecords,
    deleteRecords,
    selectStatistics,
    
    selectBookDB,
    selectBookImgUrlDB,
    selectFlowerDataDB,
    selectFlowerPotDB,
    selectFollowDB,
    selectReadingRecordDB,
    selectUserDB,
    selectUserFlowerListDB
}