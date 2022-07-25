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



  module.exports = {
    selectUserEmail,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
  };