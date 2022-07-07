const mysql = require('mysql2/promise');
const {logger} = require('./winston');

const pool = mysql.createPool({
    host: '',       // rds 링크
    user: '',       // 유저 이름  
    port: '3306',
    password: '',   // db 비번
    database: ''    // db 이름
});

module.exports = {
    pool: pool
};