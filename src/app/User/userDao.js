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
          INSERT INTO User(email, password, salt, name, profileImgUrl, introduction)
          VALUES (?, ?, ?, ?, ?, ?);
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
      [email,
      password]
  );

  return selectUserPasswordRow;
}

//salt 체크
async function selectUserSalt(connection, email) {
  const selectUserSaltQuery = `
        SELECT salt, idx
        FROM User
        WHERE email = ?`;
  const selectUserSaltRow = await connection.query(
      selectUserSaltQuery,
      email
  );
  // console.log('dao salt:', selectUserSaltRow);
  return selectUserSaltRow;
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

//기존 비밀번호 확인
async function oldPasswordCheck(connection, userIdx, oldPassword) {

  const oldPasswordCheckQuery = `
  SELECT idx, password
  FROM User
  WHERE idx = ?;
  `;
  //이 쿼리로 가져온 u.password는 oldPassword로 선언되어야 함
  //여기서 password는 hashed된 값이 아니므로
  // 기존의 password라고 입력받은 걸 hashed처리한 값과 / db상에 password로 저장된 걸(이걸 쿼리에서 뽑아온 거임) 비교하면 됨 
  const [oldPasswordCheckQueryRow] = await connection.query(
    oldPasswordCheckQuery,
    [userIdx, oldPassword]
  );
  return oldPasswordCheckQueryRow;
}

//saltCheck for chagnePassword
async function saltCheck(connection, userIdx) {
  const saltCheckQuery = `
  SELECT salt
  FROM User
  WHERE idx = ?;
  `;

  const saltCheckQueryRow = await connection.query(
    saltCheckQuery,
    userIdx
  );
  // console.log('dao saltqueryrow: ', saltCheckQueryRow);
  // console.log(saltCheckQueryRow[0]);
  return saltCheckQueryRow[0];
}

//비밀번호 변경
async function changeUserPassword(connection, hashedNewPassword, userIdx) {
  const patchPasswordQuery = `
  UPDATE User
  SET password = ?
  WHERE idx = ?;
  `;


  const [patchPasswordQueryRow] = await connection.query(
      patchPasswordQuery,
      [hashedNewPassword, userIdx]
    );

  // console.log('dao:', hashedNewPassword);

  return patchPasswordQueryRow;
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

// APPLE 계정 이메일이 존재하는지 확인
async function appleUserAccountCheck(connection, email, type) {
  const selectkakaoUserAccountQuery = `
        SELECT email, type
        FROM User
        WHERE email = ? AND type = 'apple';`;
        const [kakaoUserAccountCheckRow] = await connection.query(
          selectkakaoUserAccountQuery,
          email,
          type,
      );
      return kakaoUserAccountCheckRow;
}

// APPLE 계정으로 로그인 시 DB에 계정이 없다면 DB에 새 계정을 등록
async function appleUserAccountInsert(connection, insertAppleUserInfoParams) {
  const insertAppleUserInfoQuery = `
  INSERT INTO User(email, name, type, profileImgUrl)
  VALUES (?, ?, ?, https://librog.shop/source/profileImg/default.png);
  `;
  const insertAppleUserInfoQueryRow = await connection.query(
    insertAppleUserInfoQuery,
    insertAppleUserInfoParams
  );

  return insertAppleUserInfoQueryRow;
}

// DB에 저장된 APPLE 로그인 정보 가져오기
async function appleUserAccountInfo(connection, email, type) {
  const selectappleUserAccountInfoQuery = `
        SELECT idx, email, name, profileImgUrl, type
        FROM User
        WHERE email = ? AND type = 'apple';`;
        const [appleUserAccountInfoRow] = await connection.query(
          selectappleUserAccountInfoQuery,
          email,
          type
          );
      return appleUserAccountInfoRow;
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

async function acquireFlowerpot(connection, createdUserIdx) {
  const acquireFlowerpotQuery = `
  INSERT INTO  UserFlowerList(userIdx,flowerDataIdx)
  VALUES (?,3)
  `;
  const [acquireFlowerpotRow] = await connection.query(acquireFlowerpotQuery,createdUserIdx);
  return acquireFlowerpotRow;
}

async function deletePreviousImage(connection, idx) {
  const deleteImgQuery = `
  UPDATE User
  SET profileImgUrl = null
  WHERE idx = ?;`;
  const deleteImgQueryRow = await connection.query(deleteImgQuery, idx);
  return deleteImgQueryRow[0];
}

async function editProfile(connection, editProfileParams) {
  const editProfileQuery = `
  UPDATE User
  SET name = ?, introduction = ?, profileImgUrl = ?
  WHERE idx = ?;
  `
  const [editProfileQueryRow] = await connection.query(editProfileQuery, editProfileParams);
  return editProfileQueryRow[0];
}

async function getProfileImgUrl(connection, idx) {
  const getProfileImgUrlQuery = `
  SELECT profileImgUrl
  FROM User
  WHERE idx = ?;
  `
  const [getProfileImgUrlQueryRow] = await connection.query(getProfileImgUrlQuery, idx);
  return getProfileImgUrlQueryRow;
}

 // 초기 화분 획득
    
 async function acquireFlowerpot(connection, createdUserIdx) {
  const acquireFlowerpotQuery = `
  INSERT INTO  UserFlowerList(userIdx,flowerDataIdx)
  VALUES (?,3)
  `;
  const [acquireFlowerpotRow] = await connection.query(acquireFlowerpotQuery,createdUserIdx);
  return acquireFlowerpotRow;
}

 // 초기 유저의 화분 추가
    
 async function userFlowerpot(connection, createdUserIdx) {
  const userFlowerpotQuery = `
  INSERT INTO  FlowerPot(userIdx,flowerDataIdx)
  VALUES (?,3);
  `;
  const [userFlowerpotRow] = await connection.query(userFlowerpotQuery,createdUserIdx);
  return userFlowerpotRow;
}

  module.exports = {
    selectUserEmail,
    insertUserInfo,
    selectUserPassword,
    selectUserSalt,
    selectUserAccount,
    deleteUserRRInfo,
    deleteUserFPInfo,
    deleteUserUFLInfo,
    deleteUserUInfo,
    oldPasswordCheck,
    saltCheck,
    changeUserPassword,
    kakaoUserAccountCheck,
    kakaoUserAccountInsert,
    kakaoUserAccountInfo,
    appleUserAccountCheck,
    appleUserAccountInsert,
    appleUserAccountInfo,
    getUserProfile,
    editUserIntroduction,
    findPassword,
    acquireFlowerpot,
    deletePreviousImage,
    editProfile,
    getProfileImgUrl,
    acquireFlowerpot,
    userFlowerpot
  };