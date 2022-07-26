const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, name) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, name];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.kakaoLogin = async function (kakaoResult) {
    // 이미 가입된 유저인지 확인
    const kakaoAccountRow = await userProvider.kakaoAccountCheck(kakaoResult.email, 'kakao');

    try {
        if (kakaoAccountRow[0].email.length > 0 && kakaoAccountRow[0].type == 'kakao') {
            console.log('이미 가입된 유저입니다.');
            console.log(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoAccountRow);
            return response(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoAccountRow);
        } 
    } catch(err) {
    // DB에 등록 되있지 않은 유저라면, DB에 정보 추가
        const insertKakaoUserInfoParams = [kakaoResult.email, kakaoResult.nickname, kakaoResult.profileImgUrl, 'kakao'];

        const connection = await pool.getConnection(async (conn) => conn);
        
        const kakaoUserIdResult = await userDao.kakaoUserAccountInsert(connection, insertKakaoUserInfoParams);
        console.log(`추가된 회원 : ${kakaoUserIdResult[0].insertId}`)
        connection.release();
        console.log(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoAccountRow);
        return response(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoAccountRow);
    }

}