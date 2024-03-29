const dashboardProvider = require("../../app/Dashboard/dashboardProvider");
const dashboardService = require("../../app/Dashboard/dashboardService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotService = require("../FlowerPot/flowerpotService");
const userProvider = require("../User/userProvider");

/**
 * API No.10.1
 * API Name : 유저 수 조회 API
 * [GET] /dashboard/countUser
 * 
 */
exports.countUser = async function(req, res){
    const countUserResult = await dashboardProvider.retrieveUserCount();
    return res.send(response(baseResponse.SUCCESS, countUserResult));
}


/**
 * API No.10.2
 * API Name : 화분 수 조회 API
 * [GET] /dashboard/countFlowerpot
 * 
 */
 exports.countFlowerpot = async function(req, res){
    const countFlowerpotResult = await dashboardProvider.retrieveFlowerpotCount();
    return res.send(response(baseResponse.SUCCESS, countFlowerpotResult));
}


/**
 * API No.10.3
 * API Name : 책 수 조회 API
 * [GET] /dashboard/countBook
 * 
 */
 exports.countBook = async function(req, res){
    const countBookResult = await dashboardProvider.retrieveBookCount();
    return res.send(response(baseResponse.SUCCESS, countBookResult));
}


/**
 * API No.10.3
 * API Name : 책 수 조회 API
 * [GET] /dashboard/flower/getAllFlower
 * 
 */
 exports.getAllFlower = async function(req, res){
    const getAllFlowerResult = await dashboardProvider.retrieveGetAllFlower();
    return res.send(response(baseResponse.SUCCESS, getAllFlowerResult));
}


/**
 * API No.10.10
 * API Name : 식물 정보 수정 API
 * [PATCH] /dashboard/flower/edit
 * 
 */
 exports.patchFlowerData = async function(req, res){
    console.log(req.body);
    const {idx, name, engName, flowerImgUrl, flowerPotImgUrl, maxExp, bloomingPeriod, content, type} = req.body;
    console.log(idx, name, engName, flowerImgUrl, flowerPotImgUrl, maxExp, bloomingPeriod, content, type);

    const patchFlowerDataparams = [name, engName, flowerImgUrl, flowerPotImgUrl, maxExp, bloomingPeriod, content, type, idx];
    const patchFlowerDataResult = await dashboardService.patchFlowerData(patchFlowerDataparams);
    return res.send(response(baseResponse.SUCCESS, patchFlowerDataResult));
}

/**
 * 
 * API No.10.40
 * API Name : 프로모션 쿠폰코드 API
 * [POST] /dashboard/promotion/code/certification
 */
exports.promotionCertification = async function(req, res){
    // console.log(req.body);
    const {email, promotionCode} = req.body;
    // console.log(email, promotionCode);

    if (!email) {
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY))
    } else if (!promotionCode) {
        return res.send(errResponse(baseResponse.COUPON_CODE_EMPTY))
    }

    const promotionCertificationparams = [email, promotionCode];
    const promotionCertificationResult = await dashboardService.promotionCertification(promotionCertificationparams);
    // console.log(promotionCertificationResult);

    // 검증 성공시 추가
    if(promotionCertificationResult.isSuccess){ 
        // console.log(promotionCertificationResult);
        const flowerDataIdx = promotionCertificationResult.result.rewardIdx;  // + 3 하면 fdIdx 값 됨.
        const userIdxList = await userProvider.accountCheck(email);
        if(!userIdxList){   // 유저 인덱스 없으면 오류나서 여기서 검증.
            return res.send(errResponse(baseResponse.USER_NOT_EXIST));
        }
        const promotionResult = await flowerpotService.addUFLList(userIdxList[0].idx, flowerDataIdx);
        // console.log(promotionResult);
    }
    return res.send(promotionCertificationResult);
}