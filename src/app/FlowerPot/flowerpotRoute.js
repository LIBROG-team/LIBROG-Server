module.exports = function(app){
    const flowerpot = require('./flowerpotController');
  

    // 3.1 화분 조회 API
    app.get('/flowerpots/:userIdx',flowerpot.getflowerpots);

};
