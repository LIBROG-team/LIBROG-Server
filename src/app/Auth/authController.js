const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const authService = require("./authService");
const authProvider = require("./authProvider");
const cookieParser = require('cookie-parser');
const regexEmail = require("regex-email");
const secret = require("../../../config/secret");
const { application } = require("express");

// const regexPwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

/*
    API No. 2.1
    API Name: 로그인 API
    [POST] /auth/login
*/

exports.login = async function(req, res) {
    /*
    body: email, password
    */
    const { email, password } = req.body;

    //email validation
    if (!email) {
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_EMPTY));
    }   else if (!regexEmail.test(email)) {
        return res.send(errResponse(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    }

    //password validation
    if (!password) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
    }   else if (password.length < 8) {
        return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
    }
    // //    else if (!regexPwd.test(password)) {
    // //     return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
    // // }

    const signInResponse = await authService.postSignIn(email, password);
    return res.send(signInResponse);
}

// /*
//     API No. 2.2
//     API Name: 로그아웃 API
//     [post] /auth/logout
// */

// exports.logout = async function(req, res) {
//     res.cookie('token', null, {
//         maxAge: 0, //쿠키 만료시간 0-> 클라이언트가 쿠키를 바로 만료시키도록
//        });
//     // const signOutResponse = await authService.postSignOut();
//     // return res.send(signOutResponse);
// }

// /*
//     API No. 2.3
//     API Name: 디코더 된 값 확인 API
//     [get] /auth/token
// */

// exports.token = async function(req, res) {
//     res.send(req.decoded);
// }