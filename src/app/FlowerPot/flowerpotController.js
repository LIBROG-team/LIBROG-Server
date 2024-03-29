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
        
      /**
 * API No.6
 * API Name : 획득화분내에서 검색 API
 * [GET] /app/flowerpots/:userIdx/searchAcqFlower?flowerName=
 * 
 */
       exports.getSerachAcqFlowerpot = async function(req, res){
        /*
            Path Variable : userIdx

            Query String: flowerName
        */
            const userIdx = req.params.userIdx;
            const flowerName=req.query.flowerName;

        // validation
        if(!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
        if(!flowerName) {
            return res.send(errResponse(baseResponse.FLOWERNAME_EMPTY));
        } 
    
        const searchAcqResult = await flowerpotProvider.retrieveSearchAcqFlowerpot(userIdx,flowerName);
        
        return res.send(response(baseResponse.SUCCESS, searchAcqResult))
    }

     /**
 * API No.7
 * API Name : 미획득화분내에서 검색 API
 * [GET] /app/flowerpots/:userIdx/searchUnacqFlower?flowerName=
 * 
 */
      exports.getSerachUnacqFlowerpot = async function(req, res){
        /*
            Path Variable : userIdx

            Query String: flowerName
        */
            const userIdx = req.params.userIdx;
            const flowerName=req.query.flowerName;

        // validation
        if(!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
        if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
        if(!flowerName) {
            return res.send(errResponse(baseResponse.FLOWERNAME_EMPTY));
        } 
    
        const searchUnacqResult = await flowerpotProvider.retrieveSearchUnacqFlowerpot(userIdx,flowerName);
        
        return res.send(response(baseResponse.SUCCESS, searchUnacqResult))
    }

    
         /**
 * API No.8
 * API Name : 획득 화분에서 유저화분으로 추가 API
 * [GET] /app/flowerpots/flowerpotAdd/:userFlowerListIdx
 * 
 */
          exports.addFlowerpot = async function(req, res){
            /*
                Path Variable : userFlowerListIdx
    
            */
                //const userFlowerListIdxFromJWT = req.verifiedToken.userFlowerListIdx;
                const userFlowerListIdx=req.params.userFlowerListIdx;
    
            // validation
            /*if (userIdxFromJWT != userIdx) {
                return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
            }*/
            if (!userFlowerListIdx) {
                return res.send(errResponse(baseResponse.FLOWERLIST_EMPTY));
            } 
            if (userFlowerListIdx <= 0) {
                return res.send(errResponse(baseResponse.FLOWERLIST_LENGTH));
            }
        
            const addFlowerpotResponse = await flowerpotService.addUserFlowerpot(userFlowerListIdx);
            return res.send(addFlowerpotResponse);
        }


/**
 * API No.9
 * API Name : 메인화면 화분 일러스트, 이름 정보 API
 * [GET] /flowerpots/flowerpotMain/:userIdx
 * 
 */
          exports.getFlowerpotMain = async function(req, res){
            const userIdx = req.params.userIdx;
    
            if (!userIdx) {
                return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
            } 
            if (userIdx <= 0) {
                return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
            }
        
            const getFlowerpotMainResponse = await flowerpotProvider.getFlowerpotMain(userIdx);
            
            if (!getFlowerpotMainResponse) {    // 0818 | 변수 == undefined로 하면 undefined가 변수로 취급되어 그 값이 undefined기때문에 true로 판단될 때도 있음. 하지만 오류나서 이렇게 수정.
                return res.send(errResponse(baseResponse.MAIN_FLOWERPOT_NOT_EXIST))
            }

            return res.send(response(baseResponse.SUCCESS, getFlowerpotMainResponse))
        }

/**
 * API No. 3.10
 * API Name: 조건에 맞는 화분 획득 API
 * [POST] /flowerpots/new/:userIdx
 */
exports.checkFlowerContidion = async function(req, res){
    const userIdx = req.params.userIdx;
    // validation
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    
    const checkFlowerContidionResult = await flowerpotService.flowerPotCondition(userIdx);
    return res.send(checkFlowerContidionResult);
}