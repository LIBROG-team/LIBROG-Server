const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const dashboardDao = require("./dashboardDao");

exports.retrieveUserCount = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const userCountResult = await dashboardDao.selectUserCount(connection);
  
    connection.release();

    return userCountResult[0];
  };

exports.retrieveFlowerpotCount = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const flowerpotCountResult = await dashboardDao.selectFlowerpotCount(connection);

  connection.release();

  return flowerpotCountResult[0];
};

exports.retrieveBookCount = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookCountResult = await dashboardDao.selectBookCount(connection);

  connection.release();

  return bookCountResult[0];
};

exports.retrieveGetAllFlower = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const getAllFlowerResult = await dashboardDao.selectGetAllFlower(connection);

  connection.release();

  return getAllFlowerResult;
}