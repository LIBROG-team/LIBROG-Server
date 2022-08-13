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
          INSERT INTO User(email, password, name, profileImgUrl, introduction)
          VALUES (?, ?, ?, ?, ?);
      `;
      
    const [insertUserInfoRow] = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
    );
  
    return insertUserInfoRow;
  }

// 패스워드 체크
async function selectUserPassword(connection, email, password) {
  const selectUserPasswordQuery = `
        SELECT password, idx
        FROM User
        WHERE email = ?`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      email,
      password
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

// 유저 관련 데이터 삭제(ReadingRecord / FlowerPot / UserFlowerList / User 순서로 삭제)
//성공 쿼리 - 유저 삭제 1. readingRecord 삭제
async function deleteUserRRInfo(connection, userIdx) {
  const deleteReadingRecordQuery = `
    DELETE rr.*
    FROM FlowerPot as fp
    left join ReadingRecord as rr on rr.flowerPotIdx = fp.idx
    WHERE fp.userIdx=?;
  `;

  const deleteReadingRecordRow = await connection.query(
    deleteReadingRecordQuery,
    userIdx
  );
  return deleteReadingRecordRow[0];
}
//성공 쿼리 - 유저 삭제 2. 화분
async function deleteUserFPInfo(connection, userIdx) {
  const deleteFlowerPotQuery = `
    DELETE fp.*
    FROM FlowerPot as fp
    WHERE fp.userIdx=?;
  `;

  const deleteFPQueryRow = await connection.query(
    deleteFlowerPotQuery,
    userIdx
  );
  
  return deleteFPQueryRow[0];
}

//성공 쿼리 - 3. 유저플라워리스트
async function deleteUserUFLInfo(connection, userIdx) {
  const deleteUFLQuery = `
    DELETE ufl.*
    FROM UserFlowerList as ufl
    WHERE ufl.userIdx=?;
  `;

  const deleteUFLQueryRow = await connection.query(
    deleteUFLQuery,
    userIdx
  );

  return deleteUFLQueryRow[0];
}

//성공 쿼리 - 4. 유저테이블
async function deleteUserUInfo(connection, userIdx) {
  const deleteUQuery = `
    DELETE u.*
    FROM User as u
    WHERE u.idx=?;
  `;

  const deleteUQueryRow = await connection.query(
    deleteUQuery,
    userIdx
  );

  return deleteUQueryRow[0];
}

// // 유저 탈퇴 시 존재하는 유저인지 확인()
// async function IsItActiveUser(connection, userIdx) {
//   const IsItActiveUserQuery = `
//     SELECT idx
//     FROM User
//     WHERE idx = ?;
//   `;
//   const [IsItActiveUserRows] = await connection.query(IsItActiveUserQuery, userIdx);
//   return IsItActiveUserRows;
// }

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

async function getUserProfile(connection, userIdx) {
    const selectuserProfileQuery = `
    SELECT idx, profileImgUrl, name, introduction, type
    FROM User
    WHERE idx = ?;`;
    const [selectuserProfileQueryRow] = await connection.query(
      selectuserProfileQuery,
      userIdx
      );
  return selectuserProfileQueryRow;
}

async function editUserIntroduction(connection, patchIntroductionParams) {
    const patchUserIntroduceQuery = `
    UPDATE User
    SET introduction = ?
    WHERE idx = ?`;
    const [patchUserIntroduceQueryRow] = await connection.query(
      patchUserIntroduceQuery,
      patchIntroductionParams
      );
    return patchUserIntroduceQueryRow;
}

async function findPassword(connection, findPasswordParams) {
  // 소셜 로그인 된 계정인지 확인
  const checkSocialLoginQuery = `
  SELECT type
  FROM User
  WHERE email = ?`
  const [checkSocialLoginQueryRow] = await connection.query(
    checkSocialLoginQuery,
    findPasswordParams[1]
    );
  
  // 소셜 로그인 된 계정이 아니라면
  if (checkSocialLoginQueryRow[0].type == null) {
    const findPasswordQuery = `
    UPDATE User
    SET password = ?
    WHERE email = ?;`;
    const [findPasswordQueryRow] = await connection.query(
      findPasswordQuery,
      findPasswordParams
      );
    return findPasswordQueryRow;
  } else {
  // 소셜 로그인 된 계정이라면
  const response = {
    "isSocialLogined": true,
    "message": "소셜 로그인으로 등록되어 있는 계정은 비밀번호 재설정이 불가능 합니다."
  }
  return response;
  }


}


  module.exports = {
    selectUserEmail,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    // deleteUserRR,
    deleteUserRRInfo,
    deleteUserFPInfo,
    deleteUserUFLInfo,
    deleteUserUInfo,
    kakaoUserAccountCheck,
    kakaoUserAccountInsert,
    kakaoUserAccountInfo,
    getUserProfile,
    editUserIntroduction,
    findPassword,
  };