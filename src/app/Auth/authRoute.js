module.exports = function(app) {
    const auth = require('./authController');

    // 2.1 일반 로그인 API
    app.post('/auth/login', auth.login)
}