module.exports = function(app){
    const dashboard = require('./dashboardController');


    // 10.1 유저 수 조회 API
    app.get('/dashboard/countUser', dashboard.countUser);

}