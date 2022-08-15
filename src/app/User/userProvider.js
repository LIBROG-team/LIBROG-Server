const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

exports.emailCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.selectUserEmail(connection, email);
    connection.release();
  
    return emailCheckResult;
  };

  exports.passwordCheck = async function (email, password) {
    const connection = await pool.getConnection(async (conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(connection, email, password);
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

  exports.userProfile = async function(userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userProfileInfoResult = await userDao.getUserProfile(connection, userIdx);
    connection.release();

    try {
      userProfileInfoResult[0].idx;
    } catch(err) {
      userProfileInfoResult[0] = {
        "message": "",
      }
      userProfileInfoResult[0].message = '존재하지 않는 유저 번호입니다.';
      return userProfileInfoResult[0];
    }
  
    return userProfileInfoResult[0];
  }

  exports.getProfileImgUrl = async function(idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const getProfileImgUrlResult = await userDao.getProfileImgUrl(connection, idx);
    connection.release();
    return getProfileImgUrlResult[0].profileImgUrl;
  }