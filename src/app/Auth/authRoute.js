module.exports = function(app) {
    const auth = require('./authController');

    // 2.1 일반 로그인 API
    app.post('/auth/login', auth.login)

    // // 2.2 로그아웃 API
    // app.post('/auth/logout', auth.logout)

    // // 2.3 디코더 된 값 확인 API
    // app.get('/auth/token', auth.token)
}