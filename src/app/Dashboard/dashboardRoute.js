module.exports = function(app){
    const dashboard = require('./dashboardController');


    // 10.1 유저 수 조회 API
    app.get('/dashboard/countUser', dashboard.countUser);

    // 10.2 화분 수 조회 API
    app.get('/dashboard/countFlowerpot', dashboard.countFlowerpot);
    
    // 10.3 책 수 조회 API
    app.get('/dashboard/countBook', dashboard.countBook);

    // 10.7 DB 상의 모든 식물 정보 조회 API
    app.get('/dashboard/getAllFlower', dashboard.getAllFlower);
}