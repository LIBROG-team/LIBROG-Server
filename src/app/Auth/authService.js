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
        const emailRows = await userProvider.emailCheck(email);

        if (emailRows.length < 1) {
            return errResponse(baseResponse.SIGNIN_EMAIL_CANNOT_FIND);
        }

        const hashedPassword = crypto
        .createHash("sha512")
        .update(password)
        .digest("hex");

        const passwordRows = await userProvider.passwordCheck(email, password);

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