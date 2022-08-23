const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const flowerpotDao = require("./flowerpotDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotProvider = require("./flowerpotProvider");



exports.deleteFlowerPotInfo = async function (flowerpotIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    
    try {
   
         
       const checkFlowerpotIdxRows = await flowerpotDao.checkFlowerpotIdx(connection, flowerpotIdx);      
        //해당화분이 없을 때
        if(checkFlowerpotIdxRows.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_SEARCH_NO_FLOWERPOTS);
        }

        //유저의 화분이 한개일 때
        const userIdx = checkFlowerpotIdxRows[0].userIdx;
        const userFlowerpotResult = await flowerpotDao.selectUserFlowerpot(connection, userIdx);
       
        if(userFlowerpotResult.length<2){
            connection.release();
            return errResponse(baseResponse.USER_ONE_FLOWERPOT);
        }

       const checkRecordRows = await flowerpotDao.checkRecordCount(connection, flowerpotIdx);
  
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