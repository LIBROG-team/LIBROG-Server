const contentsProvider = require("../../app/Contents/contentsProvider");
const contentsService = require("../../app/Contents/contentsService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 4.1
 * API Name : 공지사항 배너 조회 API
 * [GET] /contents/notice
 * 
 */
 exports.getNotice = async function(req, res){
    const noticeResult = await contentsProvider.retrieveNotice();
    return res.send(response(baseResponse.SUCCESS, noticeResult));
}

/**
 * API No. 4.2
 * API Name : 추천 책 조회 API
 * [GET] /contents/recommendBooks/',
 * 
 */
 exports.getRecommendBooks = async function(req, res){
    const RecommendBooksResult = await contentsProvider.retrieveRecommendBooks();
    return res.send(response(baseResponse.SUCCESS, RecommendBooksResult));
}