const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const flowerpotDao = require("./flowerpotDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const flowerpotProvider = require("./flowerpotProvider");



exports.deleteFlowerPotInfo = async function (flowerpotIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    
    try {
        const deleteFlowerPotInfoResult = await flowerpotDao.deleteFlowerPot(connection, flowerpotIdx);

        return response(baseResponse.SUCCESS);
    } catch (err) {
        console.log(`App - deleteFlowerPotInfo Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
   
  };