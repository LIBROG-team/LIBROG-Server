const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const contentsDao = require("./contentsDao");

exports.retrieveNotice = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const noticeResult = await contentsDao.selectNotice(connection);
  
    connection.release();

    return noticeResult;
  };

exports.retrieveRecommendBooks = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const RecommendBooksResult = await contentsDao.selectRecommendBooks(connection);

  connection.release();

  return RecommendBooksResult;
};