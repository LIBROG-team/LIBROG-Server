const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const dashboardDao = require("./dashboardDao");

exports.retrieveUserCount = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const userCountResult = await dashboardDao.selectUserCount(connection);
  
    connection.release();

    return userCountResult[0];
  };
