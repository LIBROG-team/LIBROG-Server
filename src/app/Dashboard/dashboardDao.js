async function selectUserCount(connection) {
    const selectUserCountQuery = `
    SELECT count(*) AS userCount
    FROM User
    `;
    const [userCountRow] = await connection.query(selectUserCountQuery, "count(*)");
    return userCountRow;
  }

  module.exports = {
    selectUserCount,
  }