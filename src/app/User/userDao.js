const { default: axios } = require("axios");

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
    const selectUserEmailQuery = `
                  SELECT email
                  FROM User
                  WHERE email = ?;
                  `;
    const [emailRows] = await connection.query(selectUserEmailQuery, email);
    return emailRows;
  }

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
          INSERT INTO User(email, password, name)
          VALUES (?, ?, ?);
      `;
    const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
    );
  
    return insertUserInfoRow;
  }

// 패스워드 체크
async function selectUserPassword(connection, email) {
  const selectUserPasswordQuery = `
        SELECT idx, password
        FROM User
        WHERE email = ?`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      email
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 idx 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, idx
        FROM User
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

// 카카오계정 이메일이 존재하는지 확인
async function kakaoUserAccountCheck(connection, email, type) {
  const selectkakaoUserAccountQuery = `
        SELECT email, type
        FROM User
        WHERE email = ? AND type = 'kakao';`;
        const [kakaoUserAccountCheckRow] = await connection.query(
          selectkakaoUserAccountQuery,
          email,
          type,
      );
      return kakaoUserAccountCheckRow;
}

// 카카오 계정으로 로그인 시 DB에 계정이 없다면 DB에 새 계정을 등록
async function kakaoUserAccountInsert(connection, insertKakaoUserInfoParams) {
    const insertKakaoUserInfoQuery = `
    INSERT INTO User(email, name, profileImgUrl, type)
    VALUES (?, ?, ?, ?);
    `;
    const insertKakaoUserInfoQueryRow = await connection.query(
    insertKakaoUserInfoQuery,
    insertKakaoUserInfoParams
    );

    return insertKakaoUserInfoQueryRow;
}

// DB에 저장된 카카오 로그인 정보 가져오기
async function kakaoUserAccountInfo(connection, email, type) {
  const selectkakaoUserAccountInfoQuery = `
        SELECT idx, email, name, profileImgUrl, type
        FROM User
        WHERE email = ? AND type = 'kakao';`;
        const [kakaoUserAccountInfoRow] = await connection.query(
          selectkakaoUserAccountInfoQuery,
          email,
          type
          );
      return kakaoUserAccountInfoRow;
}


  module.exports = {
    selectUserEmail,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    kakaoUserAccountCheck,
    kakaoUserAccountInsert,
    kakaoUserAccountInfo,
  };