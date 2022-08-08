const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const morgan = require('morgan');

var cors = require('cors');
module.exports = function () {
    const app = express();
    const whitelist = ['https://sadad64.shop'];
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("CORS ERROR : Not Allowed Origin."))
            }
        }
    };

    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());
    app.use(cors(corsOptions));
    app.use(morgan(':date[iso] | HTTP/:http-version | [:method] :url | From :remote-addr'));  // log 남기는 것
    // app.use(express.static(process.cwd() + '/public'));

    // 도메인 추가
    require('../src/app/Record/recordRoute')(app);
    require('../src/app/User/userRoute')(app);
    require('../src/app/Auth/authRoute')(app);
    require('../src/app/FlowerPot/flowerpotRoute')(app);
    require('../src/app/Dashboard/dashboardRoute')(app);
    require('../src/app/Contents/contentsRoute')(app);

    return app;
};