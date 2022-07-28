const flowerpotProvider = require("./flowerpotProvider");
const flowerpotService = require("./flowerpotService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


/**
 * API No.1
 * API Name : 화분 조회 API
 * [GET] /app/flowerpots/:userIdx
 * 
 */
exports.getflowerpots = async function(req, res){
/*
    Path Variable : userIdx
*/
    const userIdx = req.params.userIdx;

    // validation
    if(!userIdx) {
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    } 
    if (userIdx <= 0) {
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    const userIdxResult = await flowerpotProvider.retrieveFlowerpot(userIdx);
    
    return res.send(response(baseResponse.SUCCESS, userIdxResult))

}


/**
 * API No.2
 * API Name : 획득 화분 조회 API
 * [GET] /app/flowerpots/:userIdx/userflowerlist
 * 
 */
 exports.getacquiredflowerpots = async function(req, res){
    /*
        Path Variable : userIdx
    */
        const userIdx = req.params.userIdx;
    
        // validation
        if(!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
    
        const userIdxResult = await flowerpotProvider.retrieveAcquiredFlowerpot(userIdx);
        
        return res.send(response(baseResponse.SUCCESS, userIdxResult))
    
    }

    /**
 * API No.3
 * API Name : 미획득 화분 조회 API
 * [GET] /app/flowerpots/:userIdx/unacqUserflowerlist
 * 
 */
 exports.getunacquiredflowerpots = async function(req, res){
    /*
        Path Variable : userIdx
    */
        const userIdx = req.params.userIdx;
    
        // validation
        if(!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
    
        const userIdxResult = await flowerpotProvider.retrieveunAcquiredFlowerpot(userIdx);
        
        return res.send(response(baseResponse.SUCCESS, userIdxResult))
    
    }

    /**
 * API No.4
 * API Name : 획득/미획득 화분 상세정보 조회 API
 * [GET] /app/flowerpots/:flowerDataIdx
 * 
 */
     exports.getflowerPotInfo = async function(req, res){
        /*
            Path Variable : flowerDataIdx
        */
            const flowerDataIdx = req.params.flowerDataIdx;
        
            // validation
            if(!flowerDataIdx) {
                return res.send(errResponse(baseResponse.FLOWERDATA_EMPTY));
            } 
            if (flowerDataIdx <= 0) {
                return res.send(errResponse(baseResponse.FLOWERDATA_LENGTH));
            }
        
            const flowerDataIdxResult = await flowerpotProvider.retrieveFlowerPotInfo(flowerDataIdx);
            
            return res.send(response(baseResponse.SUCCESS, flowerDataIdxResult))
        
        }

        
    /**
 * API No.5
 * API Name : 유저 화분 삭제 API
 * [GET] /app/flowerpots/flowerpotDelete/:flowerpotIdx
 * 
 */
     exports.deleteFlowerpot = async function(req, res){
        /*
            Path Variable : flowerpotIdx
        */
            const flowerpotIdx = req.params.flowerpotIdx;
        
            // validation
            if(!flowerpotIdx) {
                return res.send(errResponse(baseResponse.FLOWERPOT_EMPTY));
            } 
            if (flowerpotIdx <= 0) {
                return res.send(errResponse(baseResponse.FLOWERPOT_LENGTH));
            }
        
            const flowerpotIdxResult = await flowerpotService.deleteFlowerPotInfo(flowerpotIdx);
            
            return res.send(response(baseResponse.SUCCESS, flowerpotIdxResult))
        
        }
 

