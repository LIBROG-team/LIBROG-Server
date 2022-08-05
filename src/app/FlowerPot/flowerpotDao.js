// 화분 조회
async function selectUserFlowerpot(connection, userIdx) {
    const selectUserFlowerpotQuery = `
    SELECT  d.idx as flowerDataIdx,
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
            COUNT(r.idx)as recordCount
      FROM FlowerPot as p
            left join FlowerData as d on d.idx = p.flowerDataIdx and p.status='ACTIVE'
            left join ReadingRecord as r on r.flowerPotIdx = p.idx and r.status = 'ACTIVE'
      WHERE p.userIdx = ? ;
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
      WHERE fl.userIdx =?;
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
      WHERE fl.userIdx =?);
    
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
      WHERE fd.idx =?;
      `;
      const [userflowerpotInfoRow] = await connection.query(selectFlowerpotInfoQuery, flowerDataIdx);
      return userflowerpotInfoRow;
    }

    
//유저의 화분 삭제
    async function deleteFlowerPot(connection, flowerpotIdx) {
      const deleteFlowerpotInfoQuery = `
      DELETE  a, b
      FROM ReadingRecord a
      LEFT JOIN FlowerPot b
      ON a.flowerPotIdx = b.idx
      WHERE b.idx=?;
      `;
      const [deleteuserflowerpotInfoRow] = await connection.query(deleteFlowerpotInfoQuery, flowerpotIdx);
      return deleteuserflowerpotInfoRow;
    }
  //획득 화분내에서 검색
  async function selectSerchAcqFlowerpot(connection, userIdx, flowerName) {
      const selectSearchAcqFlowerpotQuery = `
      SELECT fl.flowerDataIdx,
            fd.name,
            fd.type,
            fd.bloomingPeriod,
            fd.flowerImgUrl
      FROM UserFlowerList as fl
      left join FlowerData as fd on fd.idx =fl.flowerDataIdx
      WHERE  (fl.userIdx =? and name Like concat('%', ?,'%'));
      `;
      const [searchAcqFlowerpotRow] = await connection.query(selectSearchAcqFlowerpotQuery, [userIdx,flowerName]);
      console.log(searchAcqFlowerpotRow);
      return searchAcqFlowerpotRow;
    }

//미획득 화분 내에서 검색

async function selectSerchUnacqFlowerpot(connection, userIdx, flowerName) {
      const selectSearchUnacqFlowerpotQuery = `
      SELECT  fd.idx as flowerDataIdx,
            fd.name,
            fd.type,
            fd.flowerImgUrl,
            fd.condition
      FROM FlowerData as fd
      WHERE ( fd.idx NOT IN (SELECT  fd.idx FROM UserFlowerList as fl left join FlowerData as fd on fd.idx =fl.flowerDataIdx
      WHERE fl.userIdx =?)and name Like concat('%',?,'%'));
      `;
      const [searchUnacqFlowerpotRow] = await connection.query(selectSearchUnacqFlowerpotQuery, [userIdx,flowerName]);
      console.log(searchUnacqFlowerpotRow);
      return searchUnacqFlowerpotRow;
    }

    //획득화분에서 유저의 화분으로 추가
    
    async function insertFlowerpot(connection, userFlowerListIdx) {
      const insertFlowerpotQuery = `
      INSERT INTO  FlowerPot(userIdx,flowerDataIdx)
      SELECT userIdx,flowerDataIdx
      FROM UserFlowerList
      where UserFlowerList.idx= ?
      `;
      const [insertFlowerpotRow] = await connection.query(insertFlowerpotQuery,userFlowerListIdx);
      return insertFlowerpotRow;
    }


  module.exports ={
    selectUserFlowerpot,
    selectUserAcquiredFlowerpot,
    selectUserunAcquiredFlowerpot,
    selectFlowerpotInfo,
    deleteFlowerPot,
    selectSerchAcqFlowerpot,
    selectSerchUnacqFlowerpot,
    insertFlowerpot
  };