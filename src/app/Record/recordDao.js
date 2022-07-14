async function checkUserIdx(connection, userIdx){
    const checkUserIdxQuery = `
        SELECT u.idx, u.email
        FROM User u
        WHERE idx = ?;
    `
    const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
    return checkUserRows;
}

async function checkFlowerPot(connection, flowerPotIdx){
    const checkFlowerPotQuery = `
        SELECT f.idx, f.flowerDataIdx
        FROM FlowerPot f
        WHERE idx = ?;
    `
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, flowerPotIdx);
    return checkFlowerPotRows;
}

/**
 * API No. 2.1
 * API Name: 유저 독서기록 조회 API
 * [GET] /records/:userIdx
 */
async function selectUserRecords(connection, userIdx){
    const selectUserFlowerPotQuery = `
    SELECT r.idx, r.bookIdx, r.flowerPotIdx, r.userIdx, r.date, r.starRating, r.content, r.quote
        FROM ReadingRecord r
        WHERE userIdx = ?
        LIMIT 1000;
    `
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
        SELECT r.idx, r.bookIdx, r.flowerPotIdx, r.userIdx, r.date, r.starRating, r.content, r.quote
        FROM ReadingRecord r
        WHERE flowerPotIdx = ?
        LIMIT 1000;
    `
    const [selectFlowerPotRecordsRows] = await connection.query(selectFlowerPotRecordsQuery, flowerPotIdx);
    return selectFlowerPotRecordsRows;
}

module.exports = {
    checkUserIdx,
    checkFlowerPot,
    selectUserRecords,
    selectFlowerPotRecords,
}