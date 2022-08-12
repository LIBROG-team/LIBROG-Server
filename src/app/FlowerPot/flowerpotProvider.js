const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const flowerpotDao = require("./flowerpotDao");

exports.retrieveFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
      const userFlowerpotResult = await flowerpotDao.selectUserFlowerpot(connection, userIdx);
      const checkUserIdxRows = await flowerpotDao.checkUserIdx(connection, userIdx);
      // 유저 없는지
      if(checkUserIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.USER_NOT_EXIST);
      }
      //유저의 화분이 없을때
      if(userFlowerpotResult.length < 1){
        connection.release();
        return errResponse(baseResponse.USER_NO_FLOWERPOTS);
      }
    
      connection.release();
    
      return userFlowerpotResult;

    }catch(err){
      console.log(`App - retrieveFlowerpot Provider error\n: ${err.message}`);
      connection.release();
      return errResponse(baseResponse.DB_ERROR);
    }
    
  };

  exports.retrieveAcquiredFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAcquiredFlowerpotResult = await flowerpotDao.selectUserAcquiredFlowerpot(connection, userIdx);

    const checkUserIdxRows = await flowerpotDao.checkUserIdx(connection, userIdx);
      // 유저 없는지
      if(checkUserIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.USER_NOT_EXIST);
      }
      //유저의 획득화분이 없을때
    if(userAcquiredFlowerpotResult.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_NO_ACQFLOWERPOTS);
  }
  
    connection.release();
  
    return userAcquiredFlowerpotResult;
  };

  exports.retrieveunAcquiredFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userunAcquiredFlowerpotResult = await flowerpotDao.selectUserunAcquiredFlowerpot(connection, userIdx);

    const checkUserIdxRows = await flowerpotDao.checkUserIdx(connection, userIdx);
      // 유저 없는지
      if(checkUserIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.USER_NOT_EXIST);
      }
      //유저가 미획득한 화분이 없을 때
    if(userunAcquiredFlowerpotResult.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_NO_UNACQFLOWERPOTS);
  }
  
    connection.release();
  
    return userunAcquiredFlowerpotResult;
  };

  
  exports.retrieveFlowerPotInfo = async function (flowerDataIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userFlowerpotInfo = await flowerpotDao.selectFlowerpotInfo(connection, flowerDataIdx);
    

    if(userFlowerpotInfo.length < 1){
      connection.release();
      return errResponse(baseResponse.FLOWERPOT_NO_FLOWERDATA);
  }
  
    connection.release();
  
    return userFlowerpotInfo;
  };
  
  exports.retrieveSearchAcqFlowerpot = async function (userIdx,flowerName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const serchAcqFlowerpot = await flowerpotDao.selectSerchAcqFlowerpot(connection, userIdx,flowerName);
    
    const checkUserIdxRows = await flowerpotDao.checkUserIdx(connection, userIdx);
      // 유저 없는지
      if(checkUserIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.USER_NOT_EXIST);
      }

      //유저의 획득화분이 없을 때
    if(serchAcqFlowerpot.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_SEARCH_NO_FLOWERPOTS);
  }
  
    connection.release();
  
    return serchAcqFlowerpot;
   
  };
  
  exports.retrieveSearchUnacqFlowerpot = async function (userIdx,flowerName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const serchUnacqFlowerpot = await flowerpotDao.selectSerchUnacqFlowerpot(connection, userIdx,flowerName);
    
    const checkUserIdxRows = await flowerpotDao.checkUserIdx(connection, userIdx);
      // 유저 없는지
      if(checkUserIdxRows.length < 1){
          connection.release();
          return errResponse(baseResponse.USER_NOT_EXIST);
      }
    
      //유저의 미획득한 화분이 없을때
    if(serchUnacqFlowerpot.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_SEARCH_NO_FLOWERPOTS);
  }
  
    connection.release();
  
    return serchUnacqFlowerpot;
   
  };