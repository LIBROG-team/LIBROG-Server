const mysql = require('mysql2/promise');
const {logger} = require('./winston');

const pool = mysql.createPool({
    host: 'librog-db.cpstpi1llc7z.ap-northeast-2.rds.amazonaws.com',       // rds 링크
    user: 'librogmaster',       // 유저 이름  
    port: '3306',
    password: 'bookfarm313',   // db 비번
    database: 'librogDB'    // db 이름
});

module.exports = {
    pool: pool
};