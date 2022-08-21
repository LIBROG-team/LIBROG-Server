const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const dashboardProvider = require("./dashboardProvider");
const dashboardDao = require("./dashboardDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

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
        const certificationEamil = await dashboardDao.certificateEmail(connection, promotionCertificationparams[0]);
        const promotionCertification = await dashboardDao.promotionCertification(connection, promotionCertificationparams[1]);
        
        let result = promotionCertification[0]

        if (certificationEamil[0] == undefined) {
            console.log("가입X")
            let result = {
                "message": "가입되지 않은 이메일입니다.",
            }
            return result;
        } 

        if (promotionCertification[0] == undefined) {
            console.log("유효X")
            let result = {
                "message": "유효하지 않은 쿠폰번호 입니다.",
            }
            return result;
        }

        return response(baseResponse.SUCCESS, result);

    } catch(err) {
        logger.error(`App - promotion certification Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}