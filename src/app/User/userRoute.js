module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const multer = require('multer');

    // 1.1 유저 생성 (회원가입) API
    // 확장자 알아내는 함수

    function getExt(fileName) {
        if (fileName.indexOf(".") == -1) {
          let fileExt = "Directory";
          return fileExt;
        }
    
        let fileLength = fileName.length;
        let lastDot = fileName.lastIndexOf(".");
        let fileExt = fileName.substring(lastDot, fileLength).toLowerCase().replace(".", "");
    
        return fileExt;
      }
    
    const storage = multer.diskStorage({
        destination: '/home/ubuntu/source/profileImg',
        filename: (req, file, cb) => {
            return cb (null, `${file.fieldname}_${Date.now()}.${getExt(file.originalname)}`);
        }
    })

    const upload = multer({
        storage: storage,
    });
    
    app.post('/users', upload.single('profileImg'), (req, res) => {
        if (req.file === undefined) {
            console.log(`req.file is undefined`);
            let body = {
                "email": req.body.email,
                "name": req.body.name,
                "password": req.body.password,
                "introduction": req.body.introduction,
                "profileImgUrl": 'https://librog.shop/source/profileImg/defaultImg.png',
            }
            user.postUsers(body, res)
        } else {
            let body = {
                "email": req.body.email,
                "name": req.body.name,
                "password": req.body.password,
                "introduction": req.body.introduction,
                "profileImgUrl": `https://librog.shop/source/profileImg/${req.file.filename}`,
            }
            user.postUsers(body, res)
        }


    });

    // 1.4 유저 탈퇴 API
    app.delete('/users/userDelete/:userIdx', user.deleteUsers);

    // 1.5 비밀번호 변경 API
    app.patch('/users/password/change', jwtMiddleware, user.changePassword);

    // // TODO: After 로그인 인증 방법 (JWT)
    // // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
    // JWT 검증 API
    // app.get('/app/auto-login', jwtMiddleware, user.check);

    // 1.10 Kakao Login 및 인증
    app.post('/users/kakao/certificate/', user.KakaoLogin);

    // 1.20 자기소개 조회 api
    app.get('/users/profile/:userIdx', user.getProfile);

    // 1.21 자기소개 수정 api 
    app.patch('/users/introduce/edit', user.editIntroduce);

    // 1.22 비밀번호 찾기 / 임시 비밀번호를 이메일 주소로 발송
    app.patch('/users/findMyPassword', user.findPassword);

    // 1.23 이메일 중복확인 api
    app.patch('/users/findMyPassword', user.findPassword);

    // 1.24 자기소개 수정 api
    app.patch('/users/profile/edit', upload.single('profileImg'), (req, res) => {
        if (req.file === undefined) {
            let body = {
                "idx": req.body.idx,
                "name": req.body.name,
                "introduction": req.body.introduction,
                "profileImgUrl": req.body.profileImg,
                "newProfileImg": false,
            }
            user.editProfile(body, res);
        } else {
            let body = {
                "idx": req.body.idx,
                "name": req.body.name,
                "introduction": req.body.introduction,
                "profileImgUrl": `https://librog.shop/source/profileImg/${req.file.filename}`,
                "newProfileImg": true,
            }
            user.editProfile(body, res);
        }
    });

}