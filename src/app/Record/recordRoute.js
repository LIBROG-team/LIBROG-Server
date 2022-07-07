module.exports = function(app){
    const record = require('./recordController');

    // 0.1 test API
    app.get('/app/test', record.getTest);
}