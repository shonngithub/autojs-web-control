"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbm_1 = require("@/common/dbm");
const log4js_1 = require("./log4js");
const logger = log4js_1.default('db.ts');
const orm = new dbm_1.DBM({
    connectionLimit: 10,
    host: '10.55.17.241',
    port: 10000,
    user: 'root',
    password: '123456',
    database: 'cloud_auto',
    isDebug: true,
});
orm.setLogger(logger);
exports.default = orm;
