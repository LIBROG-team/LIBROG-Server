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
      COUNT(r.idx) as recordCount
      FROM FlowerPot as p
            left join FlowerData as d on d.idx = p.flowerDataIdx and p.status='ACTIVE'
            left join ReadingRecord r on p.idx = r.flowerPotIdx and r.status = 'ACTIVE'
      WHERE  p.userIdx = ? group by p.idx;
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
            fd.flowerImgUrl,
            fl.idx as userFlowerListIdx
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


    
//유저의 화분 삭제(독서기록 있을때)
    async function deleteFlowerPot(connection, flowerpotIdx) {
      const deleteFlowerpotInfoQuery = `
      DELETE  a, b
      FROM ReadingRecord b
            LEFT JOIN FlowerPot a
            ON b.flowerPotIdx = a.idx
      WHERE b.flowerPotIdx=?;
      `;
      const [deleteuserflowerpotInfoRow] = await connection.query(deleteFlowerpotInfoQuery, flowerpotIdx);
      return deleteuserflowerpotInfoRow;
    }
//유저의 화분 삭제(독서기록 없을때)
      async function deleteNoRecordFlowerPot(connection, flowerpotIdx) {
             const deleteNoRecordFlowerpotInfoQuery = `
             DELETE a
              FROM FlowerPot a
            WHERE a.idx=?;
                  `;
      const [deleteNoRecordflowerpotInfoRow] = await connection.query(deleteNoRecordFlowerpotInfoQuery, flowerpotIdx);
      return deleteNoRecordflowerpotInfoRow;
      }
//독서기록 여부 확인
async function checkRecordCount(connection, flowerpotIdx){
      const checkRecordCountQuery = `
      SELECT *
      FROM FlowerPot as p
            left join ReadingRecord r on p.idx = r.flowerPotIdx and r.status = 'ACTIVE'
      WHERE  r.flowerPotIdx=? group by p.idx;
      `;
      const [checkRecordCountRows] = await connection.query(checkRecordCountQuery, flowerpotIdx);
      return checkRecordCountRows;
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
      // console.log(searchAcqFlowerpotRow);
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
      // console.log(searchUnacqFlowerpotRow);
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


    // 유저 조회 api
async function checkUserIdx(connection, userIdx){
      const checkUserIdxQuery = `
          SELECT u.idx, u.email, u.status
          FROM User u
          WHERE idx = ?;
      `;
      const [checkUserRows] = await connection.query(checkUserIdxQuery, userIdx);
      return checkUserRows;
  }
  

    // 화분존재여부 조회 api
async function checkFlowerpotIdx(connection, flowerpotIdx){
      const checkFlowerpotIdxQuery = `
      SELECT *
      FROM FlowerPot f
      WHERE f.idx = ?;
      `;
      const [checkFlowerpotRows] = await connection.query(checkFlowerpotIdxQuery, flowerpotIdx);
      return checkFlowerpotRows;
  }

  // 메인화면 화분 정보 API
  async function selectFlowerpotMain(connection, userIdx) {
      const selectFlowerMainQuery = `
      SELECT      d.name,
                  d.engName,
                  d.flowerImgUrl,
                  d.type,
                  p.startDate,
                  p.lastDate
      FROM FlowerPot as p
                  left join FlowerData as d on d.idx = p.flowerDataIdx and p.status='ACTIVE'
                  left join ReadingRecord r on p.idx = r.flowerPotIdx and r.status = 'ACTIVE'

      WHERe userIdx = ?
      ORDER BY lastDate DESC;
      `
      const [selectFlowerMainQueryRows] = await connection.query(selectFlowerMainQuery, userIdx);
      return selectFlowerMainQueryRows;
  }
    
   


  module.exports = {
    selectUserFlowerpot,
    selectUserAcquiredFlowerpot,
    selectUserunAcquiredFlowerpot,
    selectFlowerpotInfo,
    deleteFlowerPot,
    selectSerchAcqFlowerpot,
    selectSerchUnacqFlowerpot,
    insertFlowerpot,
    checkUserIdx,
    checkFlowerpotIdx,
    deleteNoRecordFlowerPot,
    checkRecordCount,
    selectFlowerpotMain,
  };