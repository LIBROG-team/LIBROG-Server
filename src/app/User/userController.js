const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const axios = require("axios");
const nodemailer = require("nodemailer");


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

/**
 * API No. 1.22
 * API Name : 이메일 주소로 임시 비밀번호 발급 API
 * [PATCH] /users/findMyPassword/
 */
 exports.findPassword = async function (req, res) {
    let { email } = req.body;

    // e-mail validation
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

        // 임시 비밀번호를 발급받는 함수
        function getNewPassword() {
            let first = Math.floor(Math.random() * 12 ** 4);
            let second = numToStr(Math.floor(Math.random() * 10 ** 1));
            let third = numToStr(Math.floor(Math.random() * 10 ** 1));
            let fourth = Math.floor(Math.random() * 12 ** 4);
            let fifth = numToStr(Math.floor(Math.random() * 10 ** 1));
            let sixth = numToStr(Math.floor(Math.random() * 10 ** 1));
            
            function numToStr(num) {
              if (num == '1') {
                return 'A';
              } else if (num == '2') {
                return 'B';
              } else if (num == '3') {
                return 'D';
              } else if (num == '4') {
                return 'E';
              } else if (num == '5') {
                return 'G';
              } else if (num == '6') {
                return 'H';
              } else if (num == '7') {
                return 'J';
              } else if (num == '8') {
                return 'K';
              } else if (num == '9') {
                return 'M';
              } else if (num == '0') {
                return 'N';
              }
            }

            const newPass = first + second + third + fourth + fifth + sixth;
            return newPass;
        }    

    const findPasswordParams = [getNewPassword(), email];
    const findPasswordResult = await userService.findPassword(findPasswordParams);
    
    // 실패했다면 이메일 전송하지 않음
    if (findPasswordResult.isSuccess == false) {
        return res.send(findPasswordResult);
    }

    // email 전송 부분
const textContent = `
임시 발급된 비밀번호를 전달드리오니, 임시 비밀번호로 로그인 후 안전한 비밀번호로 변경해주시길 바랍니다.
만일 비밀번호 재설정 요청을 하신 적이 없는 경우 해당 이메일 주소로 회신하여 주시기 바랍니다.
임시발급 된 비밀번호는 다음과 같습니다.

`

    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "librogmanager",
          pass: "/* google key here */",
        },
      });

    const message = {
        from: "librogmanager",
        to: email,
        subject: "[리브로그 알림] 비밀번호가 재설정 되었습니다.",
        text: textContent + findPasswordParams[0],
      };

      transport.sendMail(message, (err, info) => {
        if (err) {
          console.error("err", err);
          return;
        }
       
        console.log("ok", info);
      });

    return res.send(findPasswordResult);
}

