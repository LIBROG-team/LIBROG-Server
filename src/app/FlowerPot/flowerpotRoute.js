module.exports = function(app){
    const flowerpot = require('./flowerpotController');


    // 2.1 화분 조회 API
    app.get('/app/flowerpots/:userIdx',flowerpot.getflowerpots);

};
