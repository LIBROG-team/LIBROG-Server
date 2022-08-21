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

async function certificateEmail(connection, email) {
  const certificateEmailQuery = `
  SELECT idx, name, email
  FROM User
  WHERE email = ?`
  const [certificateEmailRow] = await connection.query(certificateEmailQuery,email);
  return certificateEmailRow;
}

async function promotionCertification(connection, code) {
  const promotionCertificationQuery = `
  SELECT idx, couponName, rewards, code
  FROM PromotionCode
  WHERE code = ?`
  const [promotionCertificationRow] = await connection.query(promotionCertificationQuery, code);
  return promotionCertificationRow;
}


  module.exports = {
    selectUserCount,
    selectFlowerpotCount,
    selectBookCount,
    selectGetAllFlower,
    patchFlowerData,
    certificateEmail,
    promotionCertification,
  }