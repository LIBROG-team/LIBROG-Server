async function selectUserCount(connection) {
    const selectUserCountQuery = `
    SELECT count(*) AS userCount
    FROM User
    `;
    const [userCountRow] = await connection.query(selectUserCountQuery, "count(*)");
    return userCountRow;
  }

async function selectFlowerpotCount(connection) {
    const selectflowerpotCountQuery = `
    SELECT count(*) AS flowerpotCount
    FROM FlowerPot;
    `;
    const [flowerpotCountRow] = await connection.query(selectflowerpotCountQuery, "count(*)");
    return flowerpotCountRow;
  }

async function selectBookCount(connection) {
    const selectBookCountQuery = `
    SELECT count(*) AS bookCount
    FROM Book;
    `;
    const [bookCountRow] = await connection.query(selectBookCountQuery, "count(*)");
    return bookCountRow;
  }

async function selectGetAllFlower(connection) {
  const selectAllFlowerQuery = `
  SELECT *
  FROM FlowerData;
  `;
  const [getAllFlowerRow] = await connection.query(selectAllFlowerQuery)
  return getAllFlowerRow;
}

async function patchFlowerData(connection, patchFlowerDataparams) {
  const patchFlowerDataQuery = `
  UPDATE FlowerData
  SET name = ?, engName = ?, flowerImgUrl = ?, flowerPotImgUrl = ?, maxExp = ?, bloomingPeriod = ?, content = ?, type = ?
  WHERE idx = ?;
  `;
  const [patchFlowerDataRow] = await connection.query(patchFlowerDataQuery, patchFlowerDataparams);
  return patchFlowerDataRow;
}

  module.exports = {
    selectUserCount,
    selectFlowerpotCount,
    selectBookCount,
    selectGetAllFlower,
    patchFlowerData,
  }