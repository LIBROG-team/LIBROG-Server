module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 1.1 유저 생성 (회원가입) API
    app.post('/users', user.postUsers);

    // 1.4 유저 탈퇴 API
    app.delete('/users/:userIdx', user.deleteUsers);

    // // 1.5 자기소개 수정 API
    // app.patch('/users/introduction', user.patchUserIntroduction);

    // // 1.2 마이페이지 유저정보 조회 API
    // app.get('/users/:idx', user.getUserPage);

    // // TODO: After 로그인 인증 방법 (JWT)
    // // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    // app.get('/app/auto-login', jwtMiddleware, user.check);
    // TODO: 탈퇴하기 API

    // 1.10 Kakao Login 및 인증
    app.post('/users/kakao/certificate/', user.KakaoLogin);

    // 1.20 자기소개 조회 api
    app.get('/users/introduce/:userIdx', user.getIntroduce);

    // 1.21 자기소개 수정 api 
    app.patch('/users/introduce/edit', user.editIntroduce);

    // 1.22 비밀번호 찾기 / 임시 비밀번호를 이메일 주소로 발송
    app.patch('/users/findMyPassword', user.findPassword);
}