"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const config = {
    replaceConsole: true,
    appenders: {
        stdout: { type: 'stdout' },
        access: {
            type: 'dateFile',
            filename: 'log/access.log',
            pattern: '-yyyy-MM-dd',
            category: 'http',
        },
        app: {
            type: 'file',
            filename: 'log/app.log',
            maxLogSize: 10485760,
            numBackups: 3,
        },
        errorFile: {
            type: 'file',
            filename: 'log/errors.log',
        },
        errors: {
            type: 'logLevelFilter',
            level: 'ERROR',
            appender: 'errorFile',
        },
    },
    categories: {
        default: { appenders: ['stdout', 'app', 'errors'], level: 'DEBUG' },
        http: { appenders: ['stdout', 'access'], level: 'DEBUG' },
    },
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
};
log4js_1.configure(config);
exports.default = log4js_1.getLogger;
