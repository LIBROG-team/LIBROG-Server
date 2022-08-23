const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const flowerpotDao = require("./flowerpotDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotProvider = require("./flowerpotProvider");
const recordProvider = require("../Record/recordProvider");


exports.deleteFlowerPotInfo = async function (flowerpotIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    
    try {
       //유저의 화분이 없을때
         
       const checkFlowerpotIdxRows = await flowerpotDao.checkFlowerpotIdx(connection, flowerpotIdx);
      
       if(checkFlowerpotIdxRows.length < 1){
           connection.release();
           return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
       }

       const checkRecordRows = await flowerpotDao.checkRecordCount(connection, flowerpotIdx);
       console.log(checkRecordRows);
       if(checkRecordRows.length<1){//독서기록 없는 화분일때
        const deleteNoRecordFlowerPotResult = await flowerpotDao.deleteNoRecordFlowerPot(connection, flowerpotIdx);
       }else{//독서기록 있는 화분일 때
        const deleteFlowerPotInfoResult = await flowerpotDao.deleteFlowerPot(connection, flowerpotIdx);
       }       
      

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deleteFlowerPotInfo Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
   
  };

  

  exports.addUserFlowerpot = async function (userFlowerListIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        await connection.beginTransaction();
        const addFlowerpotResult = await flowerpotDao.insertFlowerpot(connection, userFlowerListIdx);
        if(addFlowerpotResult.length < 1){
            connection.release();
            return errResponse(baseResponse.FLOWERLIST_NO_FLOWERPOTS);
          }

       
        await connection.commit();

        return response(baseResponse.SUCCESS, addFlowerpotResult);
    } catch (err) {
        console.log(`App - addFlowerpot Service Error\n: ${err.message}`);

        await connection.rollback();

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
  };

  // 3.10 조건에 맞는 화분 획득 API
  exports.flowerPotCondition = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        const userStatistics = await recordProvider.readStatistics(userIdx);
        if(!userStatistics.isSuccess){
            connection.rollback();
            return errResponse(baseResponse.STATISTICS_ERROR);
        }
        const [recentFlowerPot] = await flowerpotDao.selectRecentFlowerPot(connection, userIdx);
        
        if(!recentFlowerPot){
            connection.rollback();
            return errResponse(baseResponse.USER_NO_FLOWERPOTS);
        }
        const recentFlowerPotIdx = recentFlowerPot.idx;
        const flowerCnt = userStatistics.result.flowerCnt;
        const readingCnt = userStatistics.result.readingCnt;


        connection.commit();
        return ;
    }catch(err){
        console.log(`App - flowerPotCondition Service Error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);   
    }finally{
        connection.release();
    }
  }