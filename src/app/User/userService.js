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

        //salt and hash
        const salt = crypto
            .randomBytes(8)
            .toString('hex');

        // console.log('salt:', salt);
        
        const hashed = crypto.pbkdf2Sync(password, salt, 1, 64, 'sha512').toString('hex');
        
        // console.log('hashed:', hashed);

        const insertUserInfoParams = [email, hashed, salt, name, profileImgUrl, introduction];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);

        ////초기 화분 추가 api

        const createdUserIdx= userIdResult.insertId;

        const acqFlowerpotResult = await userDao.acquireFlowerpot(connection, createdUserIdx);
        if(acqFlowerpotResult.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NOT_EXIST);
        }
        const userFlowerpotResult = await userDao.userFlowerpot(connection, createdUserIdx);
        if(userFlowerpotResult.length < 1){
            connection.release();
            return errResponse(baseResponse.USER_NOT_EXIST);
        }

        



        // console.log(userIdResult[0].insertId);
        connection.release();

        const resultObj = { "createdUserIdx" : userIdResult.insertId };
        return response(baseResponse.SUCCESS, resultObj);

        
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

/*
API Name: 유저 탈퇴 API
*/

exports.deleteUserInfo = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        const deleteUserRRInfoResult = await userDao.deleteUserRRInfo(connection, userIdx);
        // console.log('SUCCESS. You deleted 1. ReadingRecord.');
        const deleteUserFPInfoResult = await userDao.deleteUserFPInfo(connection, userIdx);
        // console.log('SUCCESS. You deleted 2. FlowerPot.');
        const deleteUserUFLInfoResult = await userDao.deleteUserUFLInfo(connection, userIdx);
        // console.log('SUCCESS. You deleted 3. UserFlowerList.');
        const deleteUserUInfoResult = await userDao.deleteUserUInfo(connection, userIdx);
        // console.log('SUCCESS. You deleted 4. User.');

        return response(baseResponse.SUCCESS, { 'deletedUserIdx': userIdx });
    } catch (err) {
        console.log(`App - deleteUserInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

//비밀번호 변경
exports.changePassword = async function (userIdx, oldPassword, newPassword) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        //1. DB에서 salt 조회해서 가져오기
        const saltRows = await userDao.saltCheck(connection, userIdx);

        //2. 입력받은 기존비번, DB상의 salt 합쳐서 hash 처리
        const hashedOldPassword = crypto.pbkdf2Sync(oldPassword, saltRows[0].salt, 1, 64, 'sha512').toString('hex');

        //3. DB상의 비번 조회해서 가져오기
        const oldPasswordRows = await userDao.oldPasswordCheck(connection, userIdx, oldPassword);

        if (hashedOldPassword != oldPasswordRows[0].password) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        console.log('test is done');

        // 입력받은 새로운 비밀번호를, oldPassword와 중복 확인
        if (newPassword == oldPassword) {
            return errResponse(baseResponse.NEW_PASSWORD_PLEASE);
        }

        const hashedNewPassword = crypto.pbkdf2Sync(newPassword, saltRows[0].salt, 1, 64, 'sha512').toString('hex');

        //비번변경 쿼리 호출
        const changeUserPasswordResult = await userDao.changeUserPassword(connection, hashedNewPassword, userIdx);

        console.log('SUCCESS. You changed your password.');
        // console.log('NewPassword is :', newPassword);


        const resultObj = { "userIdx" : userIdx, "newPassword" : newPassword };
        return response(baseResponse.SUCCESS, resultObj);

    } catch (err) {
        logger.error(`App - changePassword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }

}


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

exports.getSalt = async function(email) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        const saltRows = await userDao.selectOnlySalt(connection, email);
        console.log('Service- saltRows[0].salt: ', saltRows[0].salt);
        const resultObj = saltRows[0].salt;
        return response(baseResponse.SUCCESS, resultObj);
    } catch (err) {
        logger.error(`App - getSalt Service error\n: ${err.message}`);
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

exports.deletePreviousImage = async function (idx) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        const deletePreviousImage = await userDao.deletePreviousImage(connection, idx);    
        return response(baseResponse.SUCCESS, deletePreviousImage);
    } catch(err) {
        logger.error(`App - Delete previous image url Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}

exports.editProfile = async function (editProfileParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
        const editProfile = await userDao.editProfile(connection, editProfileParams);    
        return response(baseResponse.SUCCESS, editProfile);
    } catch(err) {
        logger.error(`App - Edit Profile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}