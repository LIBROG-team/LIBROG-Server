async function selectNotice(connection) {
    const selectNoticeQuery = `
    SELECT idx, title, author, connectUrl, noticeImgUrl
    FROM Notice
    WHERE status = 'ACTIVE';
    `;
    const [noticeCountRow] = await connection.query(selectNoticeQuery);
    return noticeCountRow;
  };

async function selectRecommendBooks(connection) {
    const selectRecommendBooksQuery = `
    SELECT idx, title, name, author, publisher, bookCoverImg, connectUrl
    FROM RecommendBooks
    WHERE status = 'ACTIVE';
    `;
    const [selectRecommendBooksRow] = await connection.query(selectRecommendBooksQuery);
    return selectRecommendBooksRow;
  };

  module.exports = {
    selectNotice,
    selectRecommendBooks,
  }