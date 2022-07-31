async function selectNotice(connection) {
    const selectNoticeQuery = `
    SELECT idx, title, author, connectUrl, noticeImgUrl
    FROM Notice
    WHERE status = 'ACTIVE';
    `;
    const [noticeCountRow] = await connection.query(selectNoticeQuery);
    return noticeCountRow;
  }

  module.exports = {
    selectNotice,
  }