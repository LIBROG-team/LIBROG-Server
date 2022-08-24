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

      //경험치에 따라 이미지 변경
      for(var i =0 ; i<userFlowerpotResult.length ; i++){
      if(userFlowerpotResult[i].exp<= userFlowerpotResult[i].maxExp*0.4){
        userFlowerpotResult[i].flowerPotImgUrl = 'https://librog.shop/source/flowerImg/001sprout.png'
        userFlowerpotResult[i].flowerImgUrl = 'https://librog.shop/source/flowerImg/001sprout.png'
      }
      else if(userFlowerpotResult[i].exp <= userFlowerpotResult[i].maxExp*0.7){
        userFlowerpotResult[i].flowerPotImgUrl = 'https://librog.shop/source/flowerImg/002stem.png'
        userFlowerpotResult[i].flowerImgUrl = 'https://librog.shop/source/flowerImg/002stem.png'
      }
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

  exports.getFlowerpotMain = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getFlowerpot = await flowerpotDao.selectFlowerpotMain(connection, userIdx);

      try{
        //경험치에 따라 이미지 변경
        if(getFlowerpot[0].exp <= getFlowerpot[0].maxExp*0.4){
          getFlowerpot[0].flowerImgUrl = 'https://librog.shop/source/flowerImg/001sprout.png'
        }
        else if(getFlowerpot[0].exp <= getFlowerpot[0].maxExp*0.7){
          getFlowerpot[0].flowerImgUrl = 'https://librog.shop/source/flowerImg/002stem.png'
        }
      }catch(err){
        console.log(`App - flowerPotCondition Service Error\n: ${err.message}`);
        return errResponse(baseResponse.USER_NO_FLOWERPOTS);   
      }
        
  
    connection.release();

  
    return getFlowerpot[0];
  };