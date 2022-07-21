const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API No. 1.1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /users
 */
 exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, name
     */
    const {email, password, name} = req.body;

    // 이메일 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 이메일 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 비밀번호 빈 값 체크
    if (!password)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 비밀번호 길이 체크
    if (email.length < 8 || email.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 이름 빈 값 체크
    if (!name)
    return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));

    // 이름 길이 체크
    if (name.length > 20)
        return res.send(response(baseResponse.SIGNUP_NAME_LENGTH));


    const signUpResponse = await userService.createUser(
        email,
        password,
        name
    );
    
    return res.send(signUpResponse);
};

/**
 * API No. 1.2
 * API Name : 유저 탈퇴 API
 * [PATCH] /app/users
 */

