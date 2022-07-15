// 화분 조회
async function selectUserFlowerpot(connection, userIdx) {
    const selectUserFlowerpotQuery = `
    SELECT d.idx as flowerDataIdx,
          p.idx as flowerPotIdx,
          d.name,
          d.engName,
          d.flowerImgUrl,
          d.maxExp,
          d.bloomingPeriod,
          d.content,
          d.type,
          p.startDate,
          p.lastDate,
          p.exp,
          p.recordCount
    FROM FlowerPot as p
          left join FlowerData as d on d.idx = p.flowerDataIdx and p.status='ACTIVE'
    WHERE p.userIdx = ?
    `;
    const [userFlowerpotRow] = await connection.query(selectUserFlowerpotQuery, userIdx);
    return userFlowerpotRow;
  }
  
  //획득 화분 조회
async function selectUserAcquiredFlowerpot(connection, userIdx) {
      const selectUserAcquiredFlowerpotQuery = `
      SELECT fl.idx,
            fd.name,
            fd.engName,
            fd.type,
            fd.bloomingPeriod,
            fd.content,
            fd.flowerImgUrl
      FROM UserFlowerList as fl
      left join FlowerData as fd on fd.idx =fl.flowerDataIdx
      WHERE fl.userIdx =?
      `;
      const [userAcquiredFlowerpotRow] = await connection.query(selectUserAcquiredFlowerpotQuery, userIdx);
      return userAcquiredFlowerpotRow;
    }

  module.exports ={
    selectUserFlowerpot,
    selectUserAcquiredFlowerpot
  };