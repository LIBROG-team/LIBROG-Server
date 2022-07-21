// 화분 조회
async function selectUserFlowerpot(connection, userIdx) {
    const selectUserFlowerpotQuery = `
    SELECT d.idx as flowerDataIdx,
          p.idx as flowerPotIdx,
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
  
  //획득 화분 조회
async function selectUserAcquiredFlowerpot(connection, userIdx) {
      const selectUserAcquiredFlowerpotQuery = `
      SELECT fl.flowerDataIdx,
            fd.name,
            fd.type,
            fd.bloomingPeriod,
            fd.flowerImgUrl
      FROM UserFlowerList as fl
      left join FlowerData as fd on fd.idx =fl.flowerDataIdx
      WHERE fl.userIdx =?
      `;
      const [userAcquiredFlowerpotRow] = await connection.query(selectUserAcquiredFlowerpotQuery, userIdx);
      return userAcquiredFlowerpotRow;
    }

     //미획득 화분 조회
async function selectUserunAcquiredFlowerpot(connection, userIdx) {
      const selectUserunAcquiredFlowerpotQuery = `
      SELECT  fd.idx as flowerDataIdx,
            fd.name,
            fd.type,
            fd.flowerImgUrl,
            fd.condition
      FROM FlowerData as fd
      WHERE  fd.idx NOT IN (SELECT  fd.idx FROM UserFlowerList as fl left join FlowerData as fd on fd.idx =fl.flowerDataIdx
      WHERE fl.userIdx =?)
    
      `;
      const [userunAcquiredFlowerpotRow] = await connection.query(selectUserunAcquiredFlowerpotQuery, userIdx);
      return userunAcquiredFlowerpotRow;
    }

         //   획득/미획득 화분 상세정보 조회
async function selectFlowerpotInfo(connection, flowerDataIdx) {
      const selectFlowerpotInfoQuery = `
      SELECT  fd.idx as flowerDataIdx,
            fd.name,
            fd.engName,
            fd.content,
            fd.flowerImgUrl
      FROM FlowerData as fd
      WHERE fd.idx =?
      `;
      const [userflowerpotInfoRow] = await connection.query(selectFlowerpotInfoQuery, flowerDataIdx);
      return userflowerpotInfoRow;
    }

  module.exports ={
    selectUserFlowerpot,
    selectUserAcquiredFlowerpot,
    selectUserunAcquiredFlowerpot,
    selectFlowerpotInfo
  };