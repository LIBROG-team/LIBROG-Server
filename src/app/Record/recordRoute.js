module.exports = function(app){
    const record = require('./recordController');

    // 0.1 test API
    app.get('/app/test', record.getTest);

    // 2.1 유저별 독서 기록 조회 API
    app.get('/records/user/:userIdx', record.getUserRecords);
    // 2.2 화분별 독서 기록 조회 API
    app.get('/records/flowerpot/:flowerPotIdx', record.getFlowerPotRecords);

    // 2.3 독서 기록 추가 API
    // app.post('/records/addition', record.postRecords);

    // 2.4 독서 기록 수정 API
    // app.patch('/records/edit', record.patchRecords);

    // 2.5 ㄷ고서 기록 삭제 API
    // app.patch('/records/removal', record.deleteRecords);
}