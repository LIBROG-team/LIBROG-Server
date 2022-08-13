const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const userDao = require("./userDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const axios = require("axios");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


/**
 * API No. 1.1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /users
 */
 exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, name, profileImgUrl, introduction
     */
    const {email, password, name, profileImgUrl, introduction} = req.body;

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
    if (password.length < 8 || password.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 이름 빈 값 체크
    if (!name)
    return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));

    // 이름 길이 체크
    if (name.length > 20)
        return res.send(response(baseResponse.SIGNUP_NAME_LENGTH));

    // 프로필 사진 빈 값 체크
    if (!profileImgUrl)
        return res.send(response(baseResponse.SIGNUP_PROFILEIMGURL_EMPTY));

    // 자기소개 빈 값 체크
    if (!introduction)
        return res.send(response(baseResponse.SIGNUP_INTRODUCTION_EMPTY));

    const signUpResponse = await userService.createUser(
        email,
        password,
        name,
        profileImgUrl,
        introduction
    );
    
    return res.send(signUpResponse);

};

/**
 * API No. 1.2
 * API Name : 유저 탈퇴 API
 * [DELETE] /users/:userIdx
 */
exports.deleteUsers = async function (req, res) {
    /*
        Path Variable : userIdx
    */
    const userIdx = req.params.userIdx;

    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }

    const userIdxResult = await userService.deleteUserInfo(userIdx);
    return res.send(response(baseResponse.SUCCESS, userIdxResult));
}

/**
 * API No. 1.5
 * API Name : 비밀번호 변경 API
 * [PATCH] /users
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
 * API Name : 프로필 조회 API
 * [GET] /users/profile/:userIdx
 */
exports.getProfile = async function (req, res) {
    const userIdx = req.params.userIdx;
    if(!userIdx){
        return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
    }else if(userIdx <= 0){
        return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
    }
    const userProfileResult = await userProvider.userProfile(userIdx);
    return res.send(userProfileResult);
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
            const hashed = crypto.createHash('sha512').update(newPass).digest('hex');
            return hashed;
        }    

    const findPasswordParams = [getNewPassword(), email];
    const findPasswordResult = await userService.findPassword(findPasswordParams);
    
    // 실패했다면 이메일 전송하지 않음
    if (findPasswordResult.isSuccess == false) {
        return res.send(findPasswordResult);
    }

    // email 전송 부분
const textContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
</style>
<body>
    <div style="width: 100%; max-width: 680px; background-color:#64BE78; border-radius: 10px; padding: 8px;"> 
      <img src="https://sadad64.shop/LIBROG-logo.png" style="width: 70px;"/>
    </div>
    <div style="margin-left: 4px;">
      <div style="font-family: Pretendard; font-size: 20px; margin-top: 10px;">리브로그 비밀번호 재설정 알림</div>
      <div style="font-family: Pretendard; font-size: 16px; margin-top: 10px;"> 임시 발급된 비밀번호를 전달드리오니, 임시 비밀번호로 로그인 후 안전한 비밀번호로 변경해주시길 바랍니다. <br>
      <br>
          만일 비밀번호 재설정 요청을 하신 적이 없는 경우 해당 이메일 주소로 회신하여 주시기 바랍니다. <br>
      <br>
          임시발급 된 비밀번호는 다음과 같습니다.</div>
      <div style="margin-top: 20px; width: 40vw; font-family: Pretendard; font-size: 20px;">${findPasswordParams[0]}</div>
    </div>
</body>
</html>
`
    const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "librogmanager",
          pass: "sjvbncbrxuaylgeo",
        },
      });

    const message = {
        from: "librogmanager",
        to: email,
        subject: "[리브로그 알림] 비밀번호가 재설정 되었습니다.",
        html: textContent,
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

