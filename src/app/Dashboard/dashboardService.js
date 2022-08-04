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