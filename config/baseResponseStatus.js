module.exports = {

    // 1000: Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
     
    // 2000 : 형식적 Validation Error
    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2001, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 2002, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },
    USER_USERIDX_WRONG : { "isSuccess": false, "code": 2003, "message":"유저 인덱스값이 유효한 값이 아닙니다." },

    RECORDS_FLOWERPOTIDX_EMPTY : { "isSuccess": false, "code": 2011, "message":"화분 인덱스값을 입력해주세요." },
    RECORDS_FLOWERPOTIDX_LENGTH : { "isSuccess": false, "code": 2012, "message":"화분 인덱스값은 0보다 큰 값으로 입력해주세요." },
    
    RECORDS_BOOKIDX_EMPTY : { "isSuccess": false, "code": 2020, "message":"bookIdx값을 입력해주세요." },
    RECORDS_BOOKIDX_LENGTH : { "isSuccess": false, "code": 2021, "message":"bookIdx값은 0보다 큰 값으로 입력해주세요." },
    RECORDS_RATING_LENGTH : { "isSuccess": false, "code": 2025, "message":"starRating값은 0~5 사이의 값으로 입력해주세요." },
    RECORDS_RECORDSIDX_LENGTH : { "isSuccess": false, "code": 2026, "message":"recordsIdx값은 0보다 큰 값으로 입력해주세요." },
    RECORDS_RECORDSIDX_EMPTY : { "isSuccess": false, "code": 2027, "message":"recordsIdx값을 입력해주세요." },
    
    RECORDS_QUOTE_LENGTH : { "isSuccess": false, "code": 2030, "message":"quote는 1000자보다 짧게 입력해주세요." },
    RECORDS_CONTENT_LENGTH : { "isSuccess": false, "code": 2031, "message":"content는 10000자보다 짧게 입력해주세요." },

    FLOWERDATA_EMPTY : { "isSuccess": false, "code": 2041, "message": "flowerDataIdx를 입력해주세요." },
    FLOWERDATA_LENGTH : { "isSuccess": false, "code": 2042, "message": "flowerDataIdx는 0보다 큰 값으로 입력해주세요." },

    FLOWERPOT_EMPTY : { "isSuccess": false, "code": 2051, "message": "flowerpotIdx를 입력해주세요." },
    FLOWERPOT_LENGTH : { "isSuccess": false, "code": 2052, "message": "flowerpotIdx는 0보다 큰 값으로 입력해주세요." },


    // 3000 : 의미적 Validation Error
    USER_NO_RECORDS : { "isSuccess": false, "code": 3000, "message":"해당 유저에 독서 기록이 존재하지 않습니다." },
    FLOWERPOT_NO_FLOWERPOTS : { "isSuccess": false, "code": 3005, "message":"지워졌거나 존재하지 않는 화분입니다." },
    FLOWERPOT_NO_RECORDS : { "isSuccess": false, "code": 3006, "message":"해당 화분에 독서 기록이 존재하지 않습니다." },

    USER_NOT_EXIST : { "isSuccess": false, "code": 3010, "message":"해당 idx의 유저가 존재하지 않습니다." },
    USER_INACTIVE_USER : { "isSuccess": false, "code": 3011, "message":"비활성화된 계정입니다." },
    USER_DELETED_USER : { "isSuccess": false, "code": 3012, "message":"삭제된 계정입니다." },

    RECORDS_NO_RECORDS : { "isSuccess": false, "code": 3015, "message":"지워졌거나 존재하지 않는 독서기록입니다." },

    FLOWERPOT_NO_FLOWERDATA : { "isSuccess": false, "code": 3021, "message":"지워졌거나 존재하지 않는 화분입니다." },

    // 4000 : DB Error
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}
