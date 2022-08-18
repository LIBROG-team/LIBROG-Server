// ���� ��ȸ api
async function checkUserIdx(connection, userIdx){
    const checkUserIdxQuery = `
        SELECT u.idx, u.email, u.status
        FROM User u
        WHERE idx = ?;
    `;
    const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
    return checkUserRows;
}
// 2.2 -> ���� ������ �ִ� ȭ�� ��ȸ API
async function checkFlowerPot(connection, flowerPotIdx){
    const checkFlowerPotQuery = `
        SELECT idx, f.status
        FROM FlowerPot f
        WHERE idx = ? AND f.status = 'ACTIVE';
    `;
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, flowerPotIdx);
    return checkFlowerPotRows;
}

/**
 * API Name: å �ε��� ��ȸ API
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
    // 0725 ���� �ֱ� ȭ�� ��ȸ ����
    /**
     * 1. status == 'ACTIVE'�̰�
     * 2. ���� ȭ�� ä��� �ִ� ����(maxExp > exp)�̰�
     * 3. ���� ���� exp percentage�� ���� ä�� ������(�������� ����) ȭ�� ����
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
// ������� ��ȸ api
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
 * API Name: ���� ������� ��ȸ API
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
 * API Name: ȭ�к� ���� ��� ��ȸ API
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
 * API Name: ���� ��� �߰� API
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


// 2.31 å �߰� API
async function insertBookIdx(connection, createBookParams){
    const insertBookIdxQuery = `
    INSERT INTO Book
    (name, author, publisher, publishedDate, bookInstruction, bookImgUrl)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [insertBookIdx] = await connection.query(insertBookIdxQuery, createBookParams);
    return insertBookIdx;
}
// 2.32 ȭ�� �ֱٱ�� ������Ʈ API
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
 * API Name: ���� ��� ���� API
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
 * API Name: ���� ��� ���� API
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
 * API Name: ���� ���� ��� ��� ��ȸ API
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
            SELECT ReadingRecord.idx, starRating, quote, content, flowerPotIdx,
                    COUNT(ReadingRecord.idx) as readingCnt,
                    COUNT(starRating) as starRatingCnt,
                    COUNT(quote) as quoteCnt,
                    COUNT(content) as contentCnt
            FROM ReadingRecord
            WHERE ReadingRecord.status = 'ACTIVE'
            GROUP BY flowerPotIdx
        ) rr on rr.flowerPotIdx = fp.idx
        HAVING User.idx = ?;
    `;
    const [selectStatisticsRows] = await connection.query(selectStatisticsQuery, userIdx);
    return selectStatisticsRows;
}

/**
 * API No. 2.7
 * API Name: ������ �ֱ� ���� å ��ȸ API
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
 * API Name: ������� ����ȸ API
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
 * API Name: ���� ��ü ������� ���� (�ֱ� ��) api
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
 * API Name: ���� ��ü ������� ���� (���� ��) api
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
 * API Name: ��ü ������� ���� (���� ��) api
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

// ������� exp �缳�� �Լ�
// async function updateAllFlowerPotsExp(connection){
//     const selectAllFPExpQuery = `
//         SELECT idx
//         FROM FlowerPot
//         ORDER BY idx ASC;
//     `;
//     // # ���� 1���� ���ְ� �������� WHERE status = 'ACTIVE' ���� �ʿ�
//     const [flowerpotsRows] = await connection.query(selectAllFPExpQuery);
//     console.log(flowerpotsRows);
//     let flowerpotInfo;  // �� ȭ�� ���� ����

//     flowerpotsRows.forEach(async ele => {
        
//         flowerpotInfo = await selectFlowerPotRecords(connection, ele.idx);  // ��� ȭ�� ����Ʈ �ְ� ����
//         // console.log(flowerpotInfo);
//         // console.log('ele', ele);
//         if(flowerpotInfo.length > 0){   // ȭ�� 1���� ������� ����
//             flowerpotInfo = flowerpotInfo[0];
//             // console.log(ele.idx);
//             // console.log('flowerpotInfo', flowerpotInfo);
//             let recordIdx = flowerpotInfo.readingRecordIdx;
//             let [recordInfo] = await selectReadingRecord(connection, recordIdx);

//             // exp ����
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

// postExp���� �����ϴ� exp���� �Է�
async function updateReadingRecordExp(connection, postExp, recordIdx){
    const updateQuery = `
        UPDATE ReadingRecord SET exp = ? WHERE idx = ?;
    `;
    const [updateRRExpRows] = await connection.query(updateQuery, [postExp, recordIdx]);
    return updateRRExpRows;
}

// ȭ�� exp �缳�� �Լ�
// expChangeValue���� �ٲ� ���� �Է�
async function updateFlowerpotExp(connection, expChangeValue, flowerPotIdx){
    const updateExpQuery = `
        UPDATE FlowerPot SET exp = exp + ? WHERE idx = ?;
    `;
    const [updateFlowerpotExpRows] = await connection.query(updateExpQuery, [expChangeValue, flowerPotIdx]);
    return updateFlowerpotExpRows;
}

// DB ��ȸ api
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
    selectRecentBookRecords,
    selectReadingRecord,

    selectFilterRecent,
    selectFilterRating,
    selectFilterTitle,

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