const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const axios = require("axios");


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


/**
 * API No. 1.10
 * API Name : Kakao Token 인증 API
 * [POST] /app/users/kakao/certificate/
 */
exports.KakaoLogin = async function (req, res) {

    /**
     * Body: accessToken
     */
    const { accessToken } = req.body;
    
    async function tokenReult(result) {
        const kakaoTokenResult = await userService.kakaoLogin(
            result
        );
        return res.send(kakaoTokenResult);
    }

    // token 값이 비었는지 확인
    if (!accessToken)
        return res.send(response(baseResponse.KAKAO_ACCESS_TOKEN_UNDEFINED));

    axios({
        method: 'get',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then((kakaoResponse) => {
        // 로그인 성공시
        const kakaoResult = {
            email: kakaoResponse.data.kakao_account.email,
            nickname: kakaoResponse.data.properties.nickname,
            profileImgUrl: kakaoResponse.data.kakao_account.profile.profile_image_url,
            loginType: 'kakao',
        }
        return tokenReult(kakaoResult);

    }).catch( err => {

        // 401 Error 인증되지 않은 Token 값
        if (err.response.status == '401') {
            return res.send(response(baseResponse.KAKAO_LOGIN_UNAUTHORIZED_ERROR));
        }
        return res.send(response(baseResponse.KAKAO_LOGIN_ERROR));
    });
}

/**
 * API No. 1.20
 * API Name : 자기 소개 조회 API
 * [GET] /users/introduce/:userIdx
 */
exports.getIntroduce = async function (req, res) {
    const userIdx = req.params.userIdx;
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    const userIntroduceResult = await userProvider.userIntroduce(userIdx);
    return res.send(userIntroduceResult);
}

/**
 * API No. 1.21
 * API Name : 자기 소개 수정 API
 * [PATCH] /users/introduce/edit/
 */
exports.editIntroduce = async function (req, res) {
    let {introduction, idx} = req.body;
    console.log(introduction, idx);


    if(!idx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(idx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }else if(!introduction) {
        introduction = "자기 소개가 없습니다.";
    }else if(introduction.lenght > 300) {
        return res.send(errResponse(baseResponse.INTRODUCE_QUOTE_LENGTH));
    }

    const patchIntroductionParams = [introduction, idx];
    const editIntroduceResult = await userService.editIntroduce(patchIntroductionParams);
    return res.send(editIntroduceResult);
}