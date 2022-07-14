module.exports = {

    // 1000: Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
     
    // 2000 : 형식적 Validation Error
    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2001, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 2002, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },
    USER_USERIDX_WRONG : { "isSuccess": false, "code": 2003, "message":"유저 인덱스값이 유효한 값이 아닙니다." },

    RECORDS_FLOWERPOTIDX_EMPTY : { "isSuccess": false, "code": 2011, "message":"화분 인덱스값을 입력해주세요." },
    RECORDS_FLOWERPOTIDX_LENGTH : { "isSuccess": false, "code": 2012, "message":"화분 인덱스값은 0보다 큰 값으로 입력해주세요." },
    // 3000 : 의미적 Validation Error
    USER_NO_RECORDS : { "isSuccess": false, "code": 3000, "message":"해당 유저에 독서 기록이 존재하지 않습니다." },
    FLOWERPOT_NO_FLOWERPOTS : { "isSuccess": false, "code": 3005, "message":"해당 화분이 존재하지 않습니다." },
    FLOWERPOT_NO_RECORDS : { "isSuccess": false, "code": 3006, "message":"해당 화분에 독서 기록이 존재하지 않습니다." },
    USER_NOT_EXIST : { "isSuccess": false, "code": 3010, "message":"해당 idx의 유저가 존재하지 않습니다." },

    // 4000 : DB Error
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}
