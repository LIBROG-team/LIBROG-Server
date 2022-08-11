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

exports.createUser = async function (email, password, name, profileImgUrl, introduction) {
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

        const insertUserInfoParams = [email, hashedPassword, name, profileImgUrl, introduction];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);

        ///초기 화분 추가 api

        const createdUserIdx= userIdResult.insertId;

        const acqFlowerpotResult = await userDao.acquireFlowerpot(connection, createdUserIdx);
        if(acqFlowerpotResult.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NOT_EXIST);
        }

        ///


        // console.log(userIdResult[0].insertId);
        connection.release();
        return response(baseResponse.SUCCESS);
        
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/*
API Name: 유저 삭제 API
*/

exports.deleteUserInfo = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const withdrawalResponse = await userDao.deleteUser(connection, userIdx);
        return response(baseResponse.SUCCESS);

        // // validation 이미 탈퇴한 유저일 때
        // const IsItActiveUserList = await userDao.IsItActiveUser(connection, userIdx);
        // if(IsItActiveUserList.length < 1 || IsItActiveUserList[0].status == 'DELETED'){
        //     connection /*여기서부터 나중에*/
        // }
    } catch (err) {
        console.log(`App - deleteUserInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};



exports.kakaoLogin = async function (kakaoResult) {
    try {
        const kakaoAccountRow = await userProvider.kakaoAccountCheck(kakaoResult.email, 'kakao');
        if (kakaoAccountRow[0] === undefined) {
            // DB에 등록 되있지 않은 유저라면, DB에 정보 추가
            const insertKakaoUserInfoParams = [kakaoResult.email, kakaoResult.nickname, kakaoResult.profileImgUrl, 'kakao'];

            const connection = await pool.getConnection(async (conn) => conn);
            
            const kakaoUserIdResult = await userDao.kakaoUserAccountInsert(connection, insertKakaoUserInfoParams);
            console.log(`추가된 회원 : ${kakaoUserIdResult[0].insertId}`)
            connection.release();

            const kakaoLoginResultObj = {
                "message": '새로운 카카오 계정이 DB에 등록 되었습니다.',
                "idx": kakaoUserIdResult[0].insertId,
                "email": kakaoResult.email,
                "name": kakaoResult.nickname,
                "profileImgUrl": kakaoResult.profileImgUrl,
                "loginType": 'kakao',
            }
            return response(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoLoginResultObj);
        }

        // 이미 가입된 유저라면 로그인 결과 return
        if (kakaoAccountRow[0].email.length > 0 && kakaoAccountRow[0].type == 'kakao') {
            const kakaoAccountInfoRow = await userProvider.kakaoUserAccountInfo(kakaoAccountRow[0].email, 'kakao');
            const kakaoLoginResultObj = {
                "message": '이미 가입된 유저입니다.',
                "idx": kakaoAccountInfoRow[0].idx,
                "email": kakaoAccountInfoRow[0].email,
                "name": kakaoAccountInfoRow[0].name,
                "profileImgUrl": kakaoAccountInfoRow[0].profileImgUrl,
                "loginType": 'kakao',
            }
            return response(baseResponse.SUCCESS_KAKAO_LOGIN, kakaoLoginResultObj);
        }
    } catch(err) {
        console.log(err);
    }

}

exports.editIntroduce = async function(patchIntroductionParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const editIntroduction = await userDao.editUserIntroduction(connection, patchIntroductionParams);
        return response(baseResponse.SUCCESS, editIntroduction);

    } catch(err) {
        logger.error(`App - editUserIntroduction Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.findPassword = async function (findPasswordParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const findPassword = await userDao.findPassword(connection, findPasswordParams);
        if (findPassword.isSocialLogined) {
            return errResponse(baseResponse.CANT_CHANGE_PASSWORD_SOCIAL_ACCOUNT, findPassword);
        }
        
        return response(baseResponse.SUCCESS, findPassword);

    } catch(err) {
        logger.error(`App - find password Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}