const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const flowerpotDao = require("./flowerpotDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotProvider = require("./flowerpotProvider");
const recordProvider = require("../Record/recordProvider");
const recordDao = require("../Record/recordDao");


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

  // 3.10 조건에 맞는 화분 획득 API
  exports.flowerPotCondition = async function(userIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        // 독서통계 -> 화분/책 개수 가져옴
        const userStatistics = await recordProvider.readStatistics(userIdx);
        if(!userStatistics.isSuccess){
            // connection.rollback();
            connection.release();
            return errResponse(baseResponse.STATISTICS_ERROR);
        }
        // 유저 최근화분, 화분개수, 책 개수 저장
        const flowerCnt = userStatistics.result.flowerCnt;
        const readingCnt = userStatistics.result.readingCnt;
        let newFlowers = [];    // 추가된 FD Idx 저장하는 배열

        // 유저 완료 화분 가져오기
        const completeFlowerList = await flowerpotDao.selectCompleteFlowerPot(connection, userIdx);

        // 유저 미획득 화분 가져오기
        const unacqFlowerList = await flowerpotDao.selectFlowerConditions(connection, userIdx);
        
        // 미획득 화분 돌면서 각각 조건에 따라 if로 나누어 조건 처리
        // for..of 문 사용해야 비동기 처리 안함.
        for(ele of unacqFlowerList){
            if(ele.conditionCode == 0){
                // 그냥 리턴
            }else if(ele.conditionCode == 1){ // ele는 미획득 화분의 각 요소
                // 이전에 특정 화분을 끝내는 조건
                for(comp of completeFlowerList){    // comp는 경험치를 다 채운 화분 요소
                    if(ele.conditionReqVal == comp.idx){
                        // 조건 -> 화분 추가
                        const insertRows = await flowerpotDao.insertUserFlowerList(connection, userIdx, ele.flowerDataIdx);
                        newFlowers.push(ele.flowerDataIdx); // 추가된 FlowerData Idx
                    }
                }
            }else if(ele.conditionCode == 2){
                // 화분개수 조건
                if(flowerCnt >= ele.conditionReqVal){
                    const insertRows = await flowerpotDao.insertUserFlowerList(connection, userIdx, ele.flowerDataIdx);
                    newFlowers.push(ele.flowerDataIdx);
                }
            }else if(ele.conditionCode == 3){
                // 독서기록 조건
                if(readingCnt >= ele.conditionReqVal){
                    const insertRows = await flowerpotDao.insertUserFlowerList(connection, userIdx, ele.flowerDataIdx);
                    newFlowers.push(ele.flowerDataIdx);

                }
            }
        }
        connection.commit();
        return response(baseResponse.SUCCESS, {'added':newFlowers});
    }catch(err){
        console.log(`App - flowerPotCondition Service Error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
  }

// 화분 획득 api (UserFlowerList에 추가)
exports.addUFLList = async function(userIdx, flowerDataIdx){
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        connection.beginTransaction();
        // user Status Check
        const userStatus = await recordDao.checkUserIdx(connection, userIdx);
        if(!userStatus){
            return errResponse(baseResponse.USER_NOT_EXIST);
        }else if(userStatus[0].status === 'INACTIVE'){
            return errResponse(baseResponse.USER_INACTIVE_USER);
        }else if(userStatus[0].status === 'DELETED'){
            return errResponse(baseResponse.USER_DELETED_USER);
        }

        // UserFlowerList에 추가
        const addResult = await flowerpotDao.insertUserFlowerList(connection, userIdx, flowerDataIdx);
        connection.commit();
        return response(baseResponse.SUCCESS, addResult);
    }catch(err){
        console.log(`App - addURLList Service Error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }finally{
        connection.release();
    }
}