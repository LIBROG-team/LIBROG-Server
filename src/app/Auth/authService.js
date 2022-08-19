const {pool} = require("../../../config/database");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const authDao = require("./authDao");
const authProvider = require("./authProvider");
const userProvider = require("../User/userProvider");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const secret_config = require("../../../config/secret.js");

exports.postSignIn = async function (email, password) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        //email validation
        const emailRows = await userProvider.emailCheck(email);

        if (emailRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_EMAIL_CANNOT_FIND);
        }

        //salt+password => hash
        //1. salt 조회해서 가져오기
        const salt = await userProvider.saltCheck(email);
        // console.log('authService:',salt[0]); //{ salt: 'd55b25e00bdaca81', idx: 177 }
        // console.log('authService:',salt[0].salt); //d55b25e00bdaca81
        //2. DB상의 비밀번호, DB상의 salt 합쳐서 hash 처리
        const hashedPassword = crypto.pbkdf2Sync(password, salt[0].salt, 1, 64, 'sha512').toString('hex');
        //3. 사용자에게 password입력받기
        const passwordRows = await userProvider.passwordCheck(email, password);
        
        // console.log(passwordRows[0].password);
        // console.log(hashedPassword);

        //password validation
        if (passwordRows[0].password != hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        const userAccountRows = await userProvider.accountCheck(email);

        if (userAccountRows[0].status == "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userAccountRows[0].status == "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        let token = jwt.sign(
        //토큰 내용(payload)
        {
            idx: userAccountRows[0].idx,
        },
        //비밀키
        secret_config.jwtsecret,
        //유효기간
        {
            expiresIn: "180m",
            subject: "User",
        }
        );

        return response(baseResponse.SUCCESS, { 'jwt': token, 'userIdx': userAccountRows[0].idx});

        
    } catch (err) {
        console.log(`App - postSignIn Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
}