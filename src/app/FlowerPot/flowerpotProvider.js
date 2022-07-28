const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const flowerpotDao = require("./flowerpotDao");

exports.retrieveFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userFlowerpotResult = await flowerpotDao.selectUserFlowerpot(connection, userIdx);

    if(userFlowerpotResult.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_NOT_EXIST);
  }
  
    connection.release();
  
    return userFlowerpotResult;
  };

  exports.retrieveAcquiredFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAcquiredFlowerpotResult = await flowerpotDao.selectUserAcquiredFlowerpot(connection, userIdx);

    if(userAcquiredFlowerpotResult.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_NOT_EXIST);
  }
  
    connection.release();
  
    return userAcquiredFlowerpotResult;
  };

  exports.retrieveunAcquiredFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userunAcquiredFlowerpotResult = await flowerpotDao.selectUserunAcquiredFlowerpot(connection, userIdx);

    if(userunAcquiredFlowerpotResult.length < 1){
      connection.release();
      return errResponse(baseResponse.USER_NOT_EXIST);
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
    

    if(serchAcqFlowerpot.length < 1){
      connection.release();
      return errResponse(baseResponse.FLOWERPOT_NO_FLOWERPOTS);
  }
  
    connection.release();
  
    return serchAcqFlowerpot;
   
  };
