const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

exports.emailCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.selectUserEmail(connection, email);
    connection.release();
  
    return emailCheckResult;
  };

  exports.passwordCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        email
    );
    connection.release();
    return passwordCheckResult[0];
  };
  
  exports.accountCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, email);
    connection.release();
  
    return userAccountResult;
  };

  exports.kakaoAccountCheck = async function(email, type) {
    const connection = await pool.getConnection(async (conn) => conn);
    const kakaoAccountCheckResult = await userDao.kakaoUserAccountCheck(connection, email, type);
    connection.release();
  
    return kakaoAccountCheckResult;
  }

  exports.kakaoUserAccountInfo = async function(email, type) {
    const connection = await pool.getConnection(async (conn) => conn);
    const kakaoUserAccountInfoResult = await userDao.kakaoUserAccountInfo(connection, email, type);
    connection.release();
  
    return kakaoUserAccountInfoResult;
  }