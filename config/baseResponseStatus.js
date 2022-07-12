module.exports = {

    // 1000: Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    

    //2000: Request error

    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2019, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 2020, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },



     //Connection, Transaction 등의 서버 오류
     DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
     SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}
