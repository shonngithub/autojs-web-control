"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("@/utils/log4js");
const logger = log4js_1.default('LogcatManager');
class LogcatManager {
    static getInstance() {
        if (!LogcatManager.instance) {
            logger.info('LogcatManager Not initialized!');
        }
        return LogcatManager.instance;
    }
    static init() { }
    log() { }
    addListener(listener) { }
}
exports.LogcatManager = LogcatManager;
