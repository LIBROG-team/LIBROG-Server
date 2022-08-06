module.exports = function(app){
    const contents = require('./contentsController');


    // 4.1 공지사항 배너 조회 API
    app.get('/contents/notice/', contents.getNotice);

    // 4.2 추천 책 조회 API
    app.get('/contents/recommendBooks/', contents.getRecommendBooks);
}