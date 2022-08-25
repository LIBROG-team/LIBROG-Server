const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const dashboardProvider = require("./dashboardProvider");
const dashboardDao = require("./dashboardDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const userDao = require("../User/userDao");
const flowerpotDao = require("../FlowerPot/flowerpotDao");

exports.patchFlowerData = async function(patchFlowerDataparams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const patchFlowerData = await dashboardDao.patchFlowerData(connection, patchFlowerDataparams);
        return response(baseResponse.SUCCESS, patchFlowerData);

    } catch(err) {
        logger.error(`App - patchFlowerData Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.promotionCertification = async function(promotionCertificationparams) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const [email, code] = promotionCertificationparams;
        const certificationEamil = await dashboardDao.certificateEmail(connection, email);
        const promotionCertification = await dashboardDao.promotionCertification(connection, code);
        // 이메일, 유효쿠폰 검증
        if (!certificationEamil[0]) {
            // console.log("가입X")
            return errResponse(baseResponse.SIGNIN_EMAIL_CANNOT_FIND);
        } 

        if (!promotionCertification[0]) {
            // console.log("유효X")
            return errResponse(baseResponse.NOT_VALID_COUPON);
        }
        // 유저가 이미 화분 획득했는지 검증
        const userIdx = await userDao.selectUserAccount(connection, email);
        const userFlowerList = await flowerpotDao.selectUFLList(connection, userIdx[0].idx, promotionCertification[0].rewardsIdx);
        // console.log(userFlowerList);
        if(userFlowerList.length > 0){
            return errResponse(baseResponse.COUPON_ADDED);
        }

        // 프로모션 코드 화분 추가 api
        const result = promotionCertification[0];
        return response(baseResponse.SUCCESS, result);

    } catch(err) {
        logger.error(`App - promotion certification Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}