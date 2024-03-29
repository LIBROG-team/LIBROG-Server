const { pool } = require("../../../config/database");
const { response, errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
module.exports = function(app){
    const record = require('./recordController');

    // 0.1 test API
    app.get('/app/test', record.getTest);
    app.get('/app/test/consolelog', record.getConsolelog);
    // DB 조회 쿼리
    
    // 0.2 Book table 조회 API
    // app.get('/BookDB', record.getBookDB);
    
    // 0.4 FlowerData table 조회 API
    // app.get('/FlowerDataDB', record.getFlowerDataDB);
    // 0.5 FlowerPot table 조회 API
    // app.get('/FlowerPotDB', record.getFlowerPotDB);
    // 0.6 Follow table 조회 API
    // app.get('/FollowDB', record.getFollowDB);
    // 0.7 ReadingRecord 조회 API
    // app.get('/ReadingRecordDB', record.getReadingRecordDB);
    // 0.8 User table 조회 API
    // app.get('/UserDB', record.getUserDB);
    // 0.9 UserFlowerList table 조회 API
    // app.get('/UserFlowerListDB', record.getUserFlowerListDB);

    // 2.1 유저별 독서 기록 조회 API
    app.get('/records/user/:userIdx', record.getUserRecords);
    
    // 2.2 화분별 독서 기록 조회 API
    app.get('/records/flowerpot/:flowerPotIdx', record.getFlowerPotRecords);

    // 2.3 독서 기록 추가 API
    app.post('/records/addition', record.postRecords);

    // 2.4 독서 기록 수정 API
    app.patch('/records/fix', record.patchRecords);

    // 2.5 독서 기록 삭제 API
    app.delete('/records/removal', record.deleteRecords);

    // 2.6 유저별 독서 기록 통계 조회 API
    app.get('/records/statistics/:userIdx', record.getStatistics);

    // 2.7 유저별 최근 읽은 책 조회 API
    app.get('/records/bookRecords/:userIdx', record.getRecentBookRecords);

    // 2.8 독서기록 상세조회 API
    app.get('/records/:readingRecordIdx', record.getReadingRecord);
    // 책 정보 출력 api

    // 2.9 유저 전체 독서기록 필터 (최근 순) api
    app.get('/records/readingRecord/filter/recent/:userIdx', record.getFilterRecent);

    // 2.10 유저 전체 독서기록 필터 (별점 순) api
    app.get('/records/readingRecord/filter/rating/:userIdx', record.getFilterRating);
    
    // 2.11 유저 전체 독서기록 필터 (제목 순) api
    app.get('/records/readingRecord/filter/title/:userIdx', record.getFilterTitle);

    // function -> reconfigure all flowerPot exp
    // app.patch('/records/reconfigure/flowerpotsExp', record.patchAllFlowerPotExp);
    // 2.12 메인화면 문구, 독서일자 조회 api
    app.get('/records/mainpage/:userIdx', record.getMainPageInfo);
}