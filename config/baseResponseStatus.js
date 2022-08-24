module.exports = {

    // 1000: Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    
    SUCCESS_KAKAO_LOGIN : { "isSuccess": true, "code": 1500, "message":"카카오 로그인 성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },
    KAKAO_LOGIN_ERROR : { "isSuccess": false, "code": 3500, "message":"카카오 로그인에서 오류가 발생했습니다. 서버로그를 참조해주세요." },
    KAKAO_ACCESS_TOKEN_UNDEFINED : { "isSuccess": false, "code": 3501, "message":"카카오 Access Token 값이 비어있거나 유효하지 않습니다." },
    KAKAO_LOGIN_UNAUTHORIZED_ERROR : { "isSuccess": false, "code": 3502, "message":"카카오 로그인 에러. 인증되지 않은 Token 입니다. (code : 401)" },

    // 2000 : 형식적 Validation Error
    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2001, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 2002, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },
    USER_USERIDX_WRONG : { "isSuccess": false, "code": 2003, "message":"유저 인덱스값이 유효한 값이 아닙니다." },
    INTRODUCE_QUOTE_LENGTH : { "isSuccess": false, "code": 2004, "message":"유저 자기소개는 300자를 넘길 수 없습니다." },
    USER_IDX_NOT_MATCH : { "isSuccess": false, "code": 2005, "message": "유저 인덱스 값을 확인해주세요" },

    RECORDS_FLOWERPOTIDX_EMPTY : { "isSuccess": false, "code": 2011, "message":"화분 인덱스값을 입력해주세요." },
    RECORDS_FLOWERPOTIDX_LENGTH : { "isSuccess": false, "code": 2012, "message":"화분 인덱스값은 0보다 큰 값으로 입력해주세요." },
    
    RECORDS_BOOK_NOT_EXIST : { "isSuccess": false, "code": 2019, "message":"존재하지 않는 책 이름입니다." },
    RECORDS_BOOKIDX_EMPTY : { "isSuccess": false, "code": 2020, "message":"bookIdx값을 입력해주세요." },
    RECORDS_BOOKIDX_LENGTH : { "isSuccess": false, "code": 2021, "message":"bookIdx값은 0보다 큰 값으로 입력해주세요." },
    RECORDS_RATING_LENGTH : { "isSuccess": false, "code": 2025, "message":"starRating값은 0~5 사이의 값으로 입력해주세요." },
    RECORDS_RECORDSIDX_LENGTH : { "isSuccess": false, "code": 2026, "message":"recordsIdx값은 0보다 큰 값으로 입력해주세요." },
    RECORDS_RECORDSIDX_EMPTY : { "isSuccess": false, "code": 2027, "message":"recordsIdx값을 입력해주세요." },
    
    RECORDS_BOOKNAME_EMPTY : { "isSuccess": false, "code": 2028, "message":"bookName값을 입력해주세요." },
    RECORDS_BOOKNAME_LENGTH : { "isSuccess": false, "code": 2029, "message":"bookName값은 100자보다 짧게 입력해주세요." },
    RECORDS_QUOTE_LENGTH : { "isSuccess": false, "code": 2030, "message":"quote는 1000자보다 짧게 입력해주세요." },
    RECORDS_CONTENT_LENGTH : { "isSuccess": false, "code": 2031, "message":"content는 10000자보다 짧게 입력해주세요." },

    
    RECORDS_AUTHOR_LENGTH : { "isSuccess": false, "code": 2033, "message":"author값은 100자보다 짧게 입력해주세요." },
    RECORDS_PUBLISHER_LENGTH : { "isSuccess": false, "code": 2035, "message":"publisher값은 45자보다 짧게 입력해주세요." },
    RECORDS_PUBLISHED_DATE_LENGTH : { "isSuccess": false, "code": 2037, "message":"publishedDate값은 45자보다 짧게 입력해주세요." },

    RECORDS_READING_RECORD_EMPTY : { "isSuccess": false, "code": 2038, "message":"readingRecordIdx값을 입력해주세요." },
    RECORDS_READING_RECORD_LENGTH : { "isSuccess": false, "code": 2039, "message":"readingRecordIdx값을 0보다 큰 값으로 입력해주세요." },

    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2040, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2041, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2042, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2043, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2044, "message":"비밀번호는 8~20자리를 입력해주세요." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2045, "message":"이름을 입력 해주세요." },
    SIGNUP_NAME_LENGTH : { "isSuccess": false,"code": 2046,"message":"이름은 20자보다 짧게 입력해주세요." },
    SIGNUP_PROFILEIMGURL_EMPTY : { "isSuccess": false,"code": 2047,"message":"프로필 사진을 첨부해주세요." },
    SIGNUP_INTRODUCTION_EMPTY : { "isSuccess": false,"code": 2048,"message":"자기소개를 입력해주세요." },


    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2050, "message":"email을 입력해주세요." },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2051, "message":"email은 255글자 이하의 길이로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2052, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2053, "message":"password를 입력해주세요." },
    SIGNIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 2054, "message":"password는 8글자 이상 20글자 이하의 길이로 입력해주세요." },

    FLOWERDATA_EMPTY : { "isSuccess": false, "code": 2060, "message": "flowerDataIdx를 입력해주세요." },
    FLOWERDATA_LENGTH : { "isSuccess": false, "code": 2061, "message": "flowerDataIdx는 0보다 큰 값으로 입력해주세요." },

    FLOWERPOT_EMPTY : { "isSuccess": false, "code": 2071, "message": "flowerpotIdx를 입력해주세요." },
    FLOWERPOT_LENGTH : { "isSuccess": false, "code": 2072, "message": "flowerpotIdx는 0보다 큰 값으로 입력해주세요." },

    FLOWERNAME_EMPTY : { "isSuccess": false, "code": 2081, "message": "flowerName을 입력해주세요." },

    FLOWERLIST_EMPTY : { "isSuccess": false, "code": 2091, "message": "flowerListIdx를 입력해주세요." },
    FLOWERLIST_LENGTH : { "isSuccess": false, "code": 2092, "message": "flowerListIdx는 0보다 큰 값으로 입력해주세요." },





    // 3000 : 의미적 Validation Error
    USER_NO_RECORDS : { "isSuccess": false, "code": 3001, "message":"해당 유저에 독서 기록이 존재하지 않습니다." },
    USER_NO_FLOWERPOTS: { "isSuccess": false, "code": 3002, "message":"해당 유저에 화분이 존재하지 않습니다." },
    USER_NO_ACQFLOWERPOTS: { "isSuccess": false, "code": 3003, "message":"해당 유저가 획득한 화분이 존재하지 않습니다." },
    USER_NO_UNACQFLOWERPOTS: { "isSuccess": false, "code": 3004, "message":"해당 유저가 미획득한 화분이 존재하지 않습니다." },

    USERFLOWERPOT_ONE_FLOWERPOTS : { "isSuccess": false, "code": 3005, "message":"해당유저에 화분이 1개이하일 때는 삭제가 불가능합니다." },
    FLOWERPOT_NO_RECORDS : { "isSuccess": false, "code": 3006, "message":"해당 화분에 독서 기록이 존재하지 않습니다." },
    USER_NO_AVAILABLE_FLOWERPOTS : { "isSuccess": false, "code": 3007, "message":"현재 유저가 추가할 수 있는 화분이 없습니다. 화분을 만들고 기록을 추가해주세요" },
    FLOWERLIST_NO_FLOWERPOTS : { "isSuccess": false, "code": 3008, "message":"획득화분에서 지워졌거나 존재하지 않는 화분입니다." },
    USER_SEARCH_NO_FLOWERPOTS:{ "isSuccess": false, "code": 3009, "message":"해당 화분이 존재하지 않습니다." },
   

    USER_NOT_EXIST : { "isSuccess": false, "code": 3010, "message":"해당 idx의 유저가 존재하지 않습니다." },
    USER_INACTIVE_USER : { "isSuccess": false, "code": 3011, "message":"비활성화된 계정입니다." },
    USER_DELETED_USER : { "isSuccess": false, "code": 3012, "message":"삭제된 계정입니다." },
    USER_ONE_FLOWERPOT:{ "isSuccess": false, "code": 3009, "message":"해당유저에 화분이 1개만 존재하므로 삭제가 불가능합니다." },
   


    RECORDS_NO_RECORDS : { "isSuccess": false, "code": 3015, "message":"지워졌거나 존재하지 않는 독서기록입니다." },
    RECORDS_NO_AUTHOR : { "isSuccess": false, "code": 3016, "message":"해당 독서기록에서 저자가 null값입니다." },
    MAIN_FLOWERPOT_NOT_EXIST : { "isSuccess": false, "code": 3017, "message":"메인 화면에 표시할 화분이 없습니다." },

    STATISTICS_ERROR : { "isSuccess": false, "code": 3018, "message":"유저 통계를 불러오던 중 오류가 발생했습니다." },
    // Response error
    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3020, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3021, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3022, "message": "비활성화 된 계정입니다." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3023, "message": "탈퇴 처리된 계정입니다." },
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3024, "message":"중복된 이메일입니다." },
    CANT_CHANGE_PASSWORD_SOCIAL_ACCOUNT : { "isSuccess": false, "code": 3025, "message":"소셜 로그인 된 계정은 비밀번호를 변경할 수 없습니다." },
    SIGNIN_EMAIL_CANNOT_FIND : { "isSuccess": false, "code": 3026, "message": "해당 이메일로 가입된 계정이 존재하지 않습니다." },
    NEW_PASSWORD_PLEASE : { "isSuccess": false, "code": 3027, "message": "기존 비밀번호와 동일한 비밀번호입니다. 새로운 비밀번호를 입력해주세요." },


    // 4000 : DB Error
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}