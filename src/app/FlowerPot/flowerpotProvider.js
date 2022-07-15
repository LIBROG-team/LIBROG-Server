const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const flowerpotDao = require("./flowerpotDao");

exports.retrieveFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userFlowerpotResult = await flowerpotDao.selectUserFlowerpot(connection, userIdx);
  
    connection.release();
  
    return userFlowerpotResult;
  };

  exports.retrieveAcquiredFlowerpot = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAcquiredFlowerpotResult = await flowerpotDao.selectUserAcquiredFlowerpot(connection, userIdx);
  
    connection.release();
  
    return userAcquiredFlowerpotResult;
  };