const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const flowerpotDao = require("./flowerpotDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotProvider = require("./flowerpotProvider");



exports.deleteFlowerPotInfo = async function (flowerpotIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    
    try {
        const deleteFlowerPotInfoResult = await flowerpotDao.deleteFlowerPot(connection, flowerpotIdx);

        
      //유저의 화분이 없을때
         
      const checkFlowerpotIdxRows = await flowerpotDao.checkFlowerpotIdx(connection, flowerpotIdx);
      
      if(checkFlowerpotIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
      }

      if(deleteFlowerPotInfoResult.length < 1){
        connection.release();
        return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
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