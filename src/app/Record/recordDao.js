async function checkUserIdx(connection, userIdx){
    const checkUserIdxQuery = `
        SELECT u.idx, u.email, u.status
        FROM User u
        WHERE idx = ?;
    `
    const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
    return checkUserRows;
}

async function checkFlowerPot(connection, flowerPotIdx){
    const checkFlowerPotQuery = `
        SELECT f.idx, f.flowerDataIdx, f.status
        FROM FlowerPot f
        WHERE idx = ?;
    `
    const [checkFlowerPotRows] = await connection.query(checkFlowerPotQuery, flowerPotIdx);
    return checkFlowerPotRows;
}

async function checkRecords(connection, recordsIdx){
    const checkRecordsQuery = `
        SELECT idx, status
        FROM ReadingRecord
        WHERE idx = ?;
    `
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
    `
    const [insertRecordsRows] = await connection.query(insertRecordsQuery, createRecordsParams);
    return insertRecordsRows;
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
    `
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
    `
    const [deleteRecordsRows] = await connection.query(deleteRecordsQuery, recordIdx);
    return deleteRecordsRows;
}
module.exports = {
    checkUserIdx,
    checkFlowerPot,
    checkRecords,
    selectUserRecords,
    selectFlowerPotRecords,
    insertRecords,
    updateRecords,
    deleteRecords
}