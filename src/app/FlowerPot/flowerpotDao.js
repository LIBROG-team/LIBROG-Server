// 화분 조회
async function selectUserFlowerpot(connection, userIdx) {
    const selectUserFlowerpotQuery = `
    SELECT d.idx as idx,
          p.idx as idx,
          d.name,
          d.engName,
          d.flowerImgUrl,
          d.flowerPotImgUrl,
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
  

  module.exports ={
    selectUserFlowerpot
  };