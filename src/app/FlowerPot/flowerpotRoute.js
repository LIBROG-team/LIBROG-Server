module.exports = function(app){
    const flowerpot = require('./flowerpotController');
    const jwtMiddleware = require("../../../config/jwtMiddleware");
  

    // 3.1 화분 조회 API
    app.get('/flowerpots/:userIdx',flowerpot.getflowerpots);

    // 3.2 획득 화분 조회 API
    app.get('/flowerpots/:userIdx/userflowerlist',flowerpot.getacquiredflowerpots);

    //3.3 미획득 화분 조회 API
    app.get('/flowerpots/:userIdx/unacqUserflowerlist',flowerpot.getunacquiredflowerpots);
    
    //3.4 획득/미획득 화분 상세정보 조회 API

    app.get('/flowerpots/flowerPotInfo/:flowerDataIdx',flowerpot.getflowerPotInfo);

    //3.5 유저 화분 삭제 API

    app.delete('/flowerpots/flowerpotDelete/:flowerpotIdx',flowerpot.deleteFlowerpot);

    //3.6 획득 화분 내에서 검색 API
    app.get ('/flowerpots/:userIdx/searchAcqFlower',flowerpot.getSerachAcqFlowerpot);

    //3.7 미획득 화분 내에서 검색 API 
    app.get ('/flowerpots/:userIdx/searchUnacqFlower', flowerpot.getSerachUnacqFlowerpot);

    //3.8 획득 화분에서 유저화분으로 추가 API
    app.post('/flowerpots/flowerpotAdd/:userFlowerListIdx',flowerpot.addFlowerpot);
    
    // 3.9 메인화면 화분 일러스트, 이름 정보 API
    app.get('/flowerpots/flowerpotMain/:userIdx',flowerpot.getFlowerpotMain);

    // 3.10 조건에 맞는 화분 획득 API
    app.post('/flowerpots/new/:userIdx', flowerpot.checkFlowerContidion);





};
