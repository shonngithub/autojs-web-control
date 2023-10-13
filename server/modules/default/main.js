"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const koaLogger = require("koa-logger");
const application_1 = require("@/common/application");
const enums_1 = require("@/utils/enums");
const log4js_1 = require("@/utils/log4js");
const error_handle_1 = require("@/middleware/error-handle");
const WebSocketManager_1 = require("@/service/WebSocketManager");
const DeviceManager_1 = require("@/service/DeviceManager");
const AdminSocketManager_1 = require("@/service/AdminSocketManager");
const SchedulerManager_1 = require("@/service/SchedulerManager");
const config_1 = require("./config");
const router = require("./router");
const logger = log4js_1.default('main.ts');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield application_1.createApplication(__dirname, Object.keys(router).map(k => router[k]), {
            logger: log4js_1.default('app'),
        });
        if (config_1.default.env === enums_1.NODE_ENV.dev) {
            app.use(koaLogger());
        }
        app.use(error_handle_1.default());
        app.listen(config_1.default.port);
        WebSocketManager_1.WebSocketManager.init(app.getHttpServer());
        DeviceManager_1.DeviceManager.init();
        AdminSocketManager_1.AdminSocketManager.init();
        yield SchedulerManager_1.SchedulerManager.init();
    });
}
process.on('rejectionHandled', logger.error.bind(logger));
process.on('uncaughtException', logger.error.bind(logger));
process.on('warning', logger.warn.bind(logger));
main();
